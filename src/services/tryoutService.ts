/**
 * Service untuk mengelola tryout di Firestore
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Tryout,
  TryoutResult,
  TryoutStats,
  ScheduledTryout,
  TryoutFilter,
  TryoutStatus,
  SubtestResult
} from '@/models/tryout';
import { Question, UserAnswer } from '@/models/practice';
import { getQuestionById } from './practiceService';

// Nama koleksi di Firestore
const TRYOUTS_COLLECTION = 'tryouts';
const TRYOUT_RESULTS_COLLECTION = 'tryoutResults';
const SCHEDULED_TRYOUTS_COLLECTION = 'scheduledTryouts';
const TRYOUT_REGISTRATIONS_COLLECTION = 'tryoutRegistrations';

/**
 * Mengambil semua tryout dengan filter opsional
 */
export const getTryouts = async (
  filter?: TryoutFilter, 
  lastDoc?: QueryDocumentSnapshot<DocumentData>, 
  pageSize: number = 10
): Promise<{ tryouts: Tryout[], lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    let tryoutsQuery = collection(db, TRYOUTS_COLLECTION);
    let constraints = [];
    
    // Menerapkan filter
    if (filter) {
      if (filter.status) {
        constraints.push(where('status', '==', filter.status));
      }
      
      if (filter.difficulty) {
        constraints.push(where('difficulty', '==', filter.difficulty));
      }
      
      if (filter.subtest) {
        constraints.push(where('subtests', 'array-contains', { name: filter.subtest }));
      }
    }
    
    // Menambahkan pengurutan berdasarkan tanggal pembaruan
    constraints.push(orderBy('updatedAt', 'desc'));
    
    // Membuat query dengan semua constraint
    let tryoutsRef = query(tryoutsQuery, ...constraints);
    
    // Menambahkan pagination jika ada lastDoc
    if (lastDoc) {
      tryoutsRef = query(tryoutsRef, startAfter(lastDoc), limit(pageSize));
    } else {
      tryoutsRef = query(tryoutsRef, limit(pageSize));
    }
    
    const snapshot = await getDocs(tryoutsRef);
    const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
    
    const tryouts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        startTime: typeof data.startTime === 'string' ? data.startTime : data.startTime?.toDate()
      } as Tryout;
    });
    
    return { tryouts, lastDoc: lastVisible };
  } catch (error) {
    console.error('Error getting tryouts:', error);
    throw error;
  }
};

/**
 * Mengambil tryout berdasarkan ID
 */
export const getTryoutById = async (id: string): Promise<Tryout | null> => {
  try {
    const tryoutRef = doc(db, TRYOUTS_COLLECTION, id);
    const tryoutDoc = await getDoc(tryoutRef);
    
    if (!tryoutDoc.exists()) {
      return null;
    }
    
    const data = tryoutDoc.data();
    return {
      ...data,
      id: tryoutDoc.id,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      startTime: typeof data.startTime === 'string' ? data.startTime : data.startTime?.toDate()
    } as Tryout;
  } catch (error) {
    console.error('Error getting tryout by ID:', error);
    throw error;
  }
};

/**
 * Menambahkan tryout baru
 */
export const addTryout = async (tryout: Omit<Tryout, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const tryoutData = {
      ...tryout,
      participants: 0, // Mulai dengan 0 peserta
      createdAt: now,
      updatedAt: now,
      startTime: typeof tryout.startTime === 'string' ? tryout.startTime : Timestamp.fromDate(tryout.startTime as Date)
    };
    
    const docRef = await addDoc(collection(db, TRYOUTS_COLLECTION), tryoutData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding tryout:', error);
    throw error;
  }
};

/**
 * Memperbarui tryout
 */
export const updateTryout = async (id: string, tryout: Partial<Tryout>): Promise<void> => {
  try {
    const tryoutRef = doc(db, TRYOUTS_COLLECTION, id);
    
    // Pastikan updatedAt diperbarui
    const updateData = {
      ...tryout,
      updatedAt: Timestamp.now(),
      startTime: typeof tryout.startTime === 'string' ? 
        tryout.startTime : 
        tryout.startTime ? Timestamp.fromDate(tryout.startTime as Date) : undefined
    };
    
    await updateDoc(tryoutRef, updateData);
  } catch (error) {
    console.error('Error updating tryout:', error);
    throw error;
  }
};

/**
 * Menghapus tryout
 */
export const deleteTryout = async (id: string): Promise<void> => {
  try {
    // Periksa apakah ada hasil tryout yang menggunakan tryout ini
    const resultsRef = query(
      collection(db, TRYOUT_RESULTS_COLLECTION),
      where('tryoutId', '==', id)
    );
    
    const snapshot = await getDocs(resultsRef);
    
    if (!snapshot.empty) {
      throw new Error('Cannot delete tryout that has results');
    }
    
    const tryoutRef = doc(db, TRYOUTS_COLLECTION, id);
    await deleteDoc(tryoutRef);
  } catch (error) {
    console.error('Error deleting tryout:', error);
    throw error;
  }
};

/**
 * Mengambil soal-soal untuk subtest dalam tryout
 */
export const getTryoutSubtestQuestions = async (tryoutId: string, subtestName: string): Promise<Question[]> => {
  try {
    const tryout = await getTryoutById(tryoutId);
    
    if (!tryout) {
      throw new Error('Tryout not found');
    }
    
    const subtest = tryout.subtests.find(s => s.name === subtestName);
    
    if (!subtest || !subtest.questionIds) {
      throw new Error('Subtest not found or no questions available');
    }
    
    const questions: Question[] = [];
    
    for (const questionId of subtest.questionIds) {
      const question = await getQuestionById(questionId);
      if (question) {
        questions.push(question);
      }
    }
    
    return questions;
  } catch (error) {
    console.error('Error getting tryout subtest questions:', error);
    throw error;
  }
};

/**
 * Menyimpan hasil tryout
 */
export const saveTryoutResult = async (result: Omit<TryoutResult, 'id'>): Promise<string> => {
  try {
    const resultData = {
      ...result,
      completedDate: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, TRYOUT_RESULTS_COLLECTION), resultData);
    
    // Update jumlah peserta tryout
    const tryoutRef = doc(db, TRYOUTS_COLLECTION, result.tryoutId);
    await updateDoc(tryoutRef, {
      participants: increment(1)
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving tryout result:', error);
    throw error;
  }
};

/**
 * Mengambil hasil tryout berdasarkan ID
 */
export const getTryoutResultById = async (id: string): Promise<TryoutResult | null> => {
  try {
    const resultRef = doc(db, TRYOUT_RESULTS_COLLECTION, id);
    const resultDoc = await getDoc(resultRef);
    
    if (!resultDoc.exists()) {
      return null;
    }
    
    const data = resultDoc.data();
    return {
      ...data,
      id: resultDoc.id,
      completedDate: data.completedDate?.toDate()
    } as TryoutResult;
  } catch (error) {
    console.error('Error getting tryout result by ID:', error);
    throw error;
  }
};

/**
 * Mengambil hasil tryout untuk pengguna tertentu
 */
export const getUserTryoutResults = async (userId: string, limit?: number): Promise<TryoutResult[]> => {
  try {
    let resultsRef = query(
      collection(db, TRYOUT_RESULTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('completedDate', 'desc')
    );
    
    if (limit) {
      resultsRef = query(resultsRef, limit(limit));
    }
    
    const snapshot = await getDocs(resultsRef);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        completedDate: data.completedDate?.toDate()
      } as TryoutResult;
    });
  } catch (error) {
    console.error('Error getting user tryout results:', error);
    throw error;
  }
};

/**
 * Mengambil statistik tryout untuk pengguna tertentu
 */
export const getUserTryoutStats = async (userId: string): Promise<TryoutStats> => {
  try {
    // Ambil semua hasil tryout pengguna
    const userResults = await getUserTryoutResults(userId);
    
    // Hitung statistik
    const totalTryOuts = userResults.length;
    const completed = userResults.length;
    
    // Hitung skor rata-rata dan skor terbaik
    let totalScore = 0;
    let bestScore = 0;
    
    userResults.forEach(result => {
      totalScore += result.score;
      if (result.score > bestScore) {
        bestScore = result.score;
      }
    });
    
    const averageScore = totalTryOuts > 0 ? Math.round(totalScore / totalTryOuts) : 0;
    
    // Ambil peringkat pengguna (implementasi sederhana)
    // Dalam implementasi nyata, ini mungkin memerlukan perhitungan yang lebih kompleks
    let rank = 0;
    
    if (userResults.length > 0) {
      // Ambil hasil tryout terbaru
      const latestResult = userResults[0];
      rank = latestResult.rank;
    }
    
    return {
      totalTryOuts,
      completed,
      averageScore,
      bestScore,
      rank
    };
  } catch (error) {
    console.error('Error getting user tryout stats:', error);
    throw error;
  }
};

/**
 * Menambahkan tryout terjadwal baru
 */
export const addScheduledTryout = async (scheduledTryout: Omit<ScheduledTryout, 'id'>): Promise<string> => {
  try {
    const scheduledTryoutData = {
      ...scheduledTryout,
      date: typeof scheduledTryout.date === 'string' ? 
        scheduledTryout.date : 
        Timestamp.fromDate(scheduledTryout.date as Date)
    };
    
    const docRef = await addDoc(collection(db, SCHEDULED_TRYOUTS_COLLECTION), scheduledTryoutData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding scheduled tryout:', error);
    throw error;
  }
};

/**
 * Mengambil semua tryout terjadwal
 */
export const getScheduledTryouts = async (): Promise<ScheduledTryout[]> => {
  try {
    const scheduledTryoutsRef = query(
      collection(db, SCHEDULED_TRYOUTS_COLLECTION),
      where('status', '==', 'open'),
      orderBy('date', 'asc')
    );
    
    const snapshot = await getDocs(scheduledTryoutsRef);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        date: typeof data.date === 'string' ? data.date : data.date?.toDate()
      } as ScheduledTryout;
    });
  } catch (error) {
    console.error('Error getting scheduled tryouts:', error);
    throw error;
  }
};

/**
 * Mendaftarkan pengguna untuk tryout terjadwal
 */
export const registerForScheduledTryout = async (userId: string, scheduledTryoutId: string): Promise<void> => {
  try {
    // Periksa apakah pengguna sudah terdaftar
    const registrationRef = doc(db, `${TRYOUT_REGISTRATIONS_COLLECTION}/${scheduledTryoutId}/users`, userId);
    const registrationDoc = await getDoc(registrationRef);
    
    if (registrationDoc.exists()) {
      throw new Error('User already registered for this tryout');
    }
    
    // Tambahkan pendaftaran
    await updateDoc(registrationRef, {
      userId,
      registeredAt: Timestamp.now(),
      status: 'registered'
    });
    
    // Update jumlah peserta
    const scheduledTryoutRef = doc(db, SCHEDULED_TRYOUTS_COLLECTION, scheduledTryoutId);
    await updateDoc(scheduledTryoutRef, {
      participants: increment(1)
    });
  } catch (error) {
    console.error('Error registering for scheduled tryout:', error);
    throw error;
  }
};

/**
 * Memeriksa apakah pengguna terdaftar untuk tryout terjadwal
 */
export const isUserRegisteredForTryout = async (userId: string, scheduledTryoutId: string): Promise<boolean> => {
  try {
    const registrationRef = doc(db, `${TRYOUT_REGISTRATIONS_COLLECTION}/${scheduledTryoutId}/users`, userId);
    const registrationDoc = await getDoc(registrationRef);
    
    return registrationDoc.exists();
  } catch (error) {
    console.error('Error checking if user is registered for tryout:', error);
    throw error;
  }
};

/**
 * Mengambil tryout terjadwal yang diikuti oleh pengguna
 */
export const getUserScheduledTryouts = async (userId: string): Promise<ScheduledTryout[]> => {
  try {
    const scheduledTryouts = await getScheduledTryouts();
    const userScheduledTryouts: ScheduledTryout[] = [];
    
    for (const tryout of scheduledTryouts) {
      const isRegistered = await isUserRegisteredForTryout(userId, tryout.id);
      
      if (isRegistered) {
        userScheduledTryouts.push({
          ...tryout,
          status: 'registered'
        });
      }
    }
    
    return userScheduledTryouts;
  } catch (error) {
    console.error('Error getting user scheduled tryouts:', error);
    throw error;
  }
};

/**
 * Membuat tryout dengan soal-soal untuk setiap subtest
 */
export const createTryoutWithQuestions = async (
  tryout: Omit<Tryout, 'id' | 'createdAt' | 'updatedAt'>,
  subtestQuestions: Record<string, string[]> // Map dari nama subtest ke array ID soal
): Promise<string> => {
  try {
    const batch = writeBatch(db);
    const now = Timestamp.now();
    
    // Perbarui subtests dengan questionIds
    const updatedSubtests = tryout.subtests.map(subtest => {
      return {
        ...subtest,
        questionIds: subtestQuestions[subtest.name] || []
      };
    });
    
    // Tambahkan tryout dengan referensi ke soal-soal
    const tryoutRef = doc(collection(db, TRYOUTS_COLLECTION));
    batch.set(tryoutRef, {
      ...tryout,
      subtests: updatedSubtests,
      participants: 0,
      createdAt: now,
      updatedAt: now,
      startTime: typeof tryout.startTime === 'string' ? 
        tryout.startTime : 
        Timestamp.fromDate(tryout.startTime as Date)
    });
    
    await batch.commit();
    return tryoutRef.id;
  } catch (error) {
    console.error('Error creating tryout with questions:', error);
    throw error;
  }
};

/**
 * Menghitung skor tryout berdasarkan jawaban pengguna
 */
export const calculateTryoutScore = async (
  tryoutId: string,
  subtestAnswers: Record<string, UserAnswer[]> // Map dari nama subtest ke array jawaban
): Promise<SubtestResult[]> => {
  try {
    const tryout = await getTryoutById(tryoutId);
    
    if (!tryout) {
      throw new Error('Tryout not found');
    }
    
    const subtestResults: SubtestResult[] = [];
    
    for (const subtest of tryout.subtests) {
      const answers = subtestAnswers[subtest.name] || [];
      const correctAnswers = answers.filter(answer => answer.isCorrect).length;
      const score = Math.round((correctAnswers / subtest.questions) * 100);
      const maxScore = 100;
      
      subtestResults.push({
        name: subtest.name,
        score,
        maxScore,
        percentage: score,
        answers,
        timeSpent: answers.reduce((total, answer) => total + answer.timeSpent, 0)
      });
    }
    
    return subtestResults;
  } catch (error) {
    console.error('Error calculating tryout score:', error);
    throw error;
  }
};