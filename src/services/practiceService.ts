/**
 * Service untuk mengelola soal latihan di Firestore
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
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Question,
  QuestionSet,
  PracticeResult,
  PracticeStats,
  PracticeFilter,
  RecentActivity
} from '@/models/practice';

// Nama koleksi di Firestore
const QUESTIONS_COLLECTION = 'questions';
const QUESTION_SETS_COLLECTION = 'questionSets';
const PRACTICE_RESULTS_COLLECTION = 'practiceResults';

/**
 * Mengambil semua set soal dengan filter opsional
 */
export const getQuestionSets = async (
  filter?: PracticeFilter, 
  lastDoc?: QueryDocumentSnapshot<DocumentData>, 
  pageSize: number = 10
): Promise<{ questionSets: QuestionSet[], lastDoc: QueryDocumentSnapshot<DocumentData> | null | undefined }> => {
  try {
    let questionSetsQuery = collection(db, QUESTION_SETS_COLLECTION);
    let constraints = [];
    
    // Menerapkan filter
    if (filter) {
      if (filter.subtest && filter.subtest !== 'all') {
        constraints.push(where('subtest', '==', filter.subtest));
      }
      
      if (filter.difficulty && filter.difficulty !== 'all') {
        constraints.push(where('difficulty', '==', filter.difficulty));
      }
      
      if (filter.topic && filter.topic !== 'all') {
        constraints.push(where('topic', '==', filter.topic));
      }
    }
    
    // Menambahkan pengurutan berdasarkan tanggal pembaruan
    constraints.push(orderBy('updatedAt', 'desc'));
    
    // Membuat query dengan semua constraint
    let questionSetsRef = query(questionSetsQuery, ...constraints);
    
    // Menambahkan pagination jika ada lastDoc
    if (lastDoc) {
      questionSetsRef = query(questionSetsRef, startAfter(lastDoc), limit(pageSize));
    } else {
      questionSetsRef = query(questionSetsRef, limit(pageSize));
    }
    
    const snapshot = await getDocs(questionSetsRef);
    const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
    
    const questionSets = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as QuestionSet;
    });
    
    // Jika ada filter pencarian, lakukan filter di client
    if (filter?.searchQuery) {
      const searchLower = filter.searchQuery.toLowerCase();
      return {
        questionSets: questionSets.filter(set => 
          set.title.toLowerCase().includes(searchLower) ||
          set.description.toLowerCase().includes(searchLower) ||
          set.topic.toLowerCase().includes(searchLower)
        ),
        lastDoc: lastVisible
      };
    }
    
    return { questionSets, lastDoc: lastVisible };
  } catch (error) {
    console.error('Error getting question sets:', error);
    throw error;
  }
};

/**
 * Mengambil set soal berdasarkan ID
 */
export const getQuestionSetById = async (id: string): Promise<QuestionSet | null> => {
  try {
    const questionSetRef = doc(db, QUESTION_SETS_COLLECTION, id);
    const questionSetDoc = await getDoc(questionSetRef);
    
    if (!questionSetDoc.exists()) {
      return null;
    }
    
    const data = questionSetDoc.data();
    return {
      ...data,
      id: questionSetDoc.id,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    } as QuestionSet;
  } catch (error) {
    console.error('Error getting question set by ID:', error);
    throw error;
  }
};

/**
 * Mengambil soal berdasarkan ID
 */
export const getQuestionById = async (id: string): Promise<Question | null> => {
  try {
    const questionRef = doc(db, QUESTIONS_COLLECTION, id);
    const questionDoc = await getDoc(questionRef);
    
    if (!questionDoc.exists()) {
      return null;
    }
    
    const data = questionDoc.data();
    return {
      ...data,
      id: questionDoc.id,
      createdAt: data.createdAt?.toDate()
    } as Question;
  } catch (error) {
    console.error('Error getting question by ID:', error);
    throw error;
  }
};

/**
 * Mengambil semua soal dalam set soal
 */
export const getQuestionsInSet = async (questionSetId: string): Promise<Question[]> => {
  try {
    const questionSet = await getQuestionSetById(questionSetId);
    
    if (!questionSet) {
      throw new Error('Question set not found');
    }
    
    const questions: Question[] = [];
    
    for (const questionId of questionSet.questions) {
      const question = await getQuestionById(questionId);
      if (question) {
        questions.push(question);
      }
    }
    
    return questions;
  } catch (error) {
    console.error('Error getting questions in set:', error);
    throw error;
  }
};

/**
 * Menambahkan soal baru
 */
export const addQuestion = async (question: Omit<Question, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const questionData = {
      ...question,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, QUESTIONS_COLLECTION), questionData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
};

/**
 * Menambahkan set soal baru
 */
export const addQuestionSet = async (questionSet: Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const questionSetData = {
      ...questionSet,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, QUESTION_SETS_COLLECTION), questionSetData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding question set:', error);
    throw error;
  }
};

/**
 * Memperbarui soal
 */
export const updateQuestion = async (id: string, question: Partial<Question>): Promise<void> => {
  try {
    const questionRef = doc(db, QUESTIONS_COLLECTION, id);
    await updateDoc(questionRef, question);
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

/**
 * Memperbarui set soal
 */
export const updateQuestionSet = async (id: string, questionSet: Partial<QuestionSet>): Promise<void> => {
  try {
    const questionSetRef = doc(db, QUESTION_SETS_COLLECTION, id);
    
    // Pastikan updatedAt diperbarui
    const updateData = {
      ...questionSet,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(questionSetRef, updateData);
  } catch (error) {
    console.error('Error updating question set:', error);
    throw error;
  }
};

/**
 * Menghapus soal
 */
export const deleteQuestion = async (id: string): Promise<void> => {
  try {
    // Periksa apakah soal digunakan dalam set soal
    const questionSetsRef = query(
      collection(db, QUESTION_SETS_COLLECTION),
      where('questions', 'array-contains', id)
    );
    
    const snapshot = await getDocs(questionSetsRef);
    
    if (!snapshot.empty) {
      throw new Error('Cannot delete question that is used in question sets');
    }
    
    const questionRef = doc(db, QUESTIONS_COLLECTION, id);
    await deleteDoc(questionRef);
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

/**
 * Menghapus set soal
 */
export const deleteQuestionSet = async (id: string): Promise<void> => {
  try {
    // Periksa apakah ada hasil latihan yang menggunakan set soal ini
    const resultsRef = query(
      collection(db, PRACTICE_RESULTS_COLLECTION),
      where('questionSetId', '==', id)
    );
    
    const snapshot = await getDocs(resultsRef);
    
    if (!snapshot.empty) {
      throw new Error('Cannot delete question set that has practice results');
    }
    
    const questionSetRef = doc(db, QUESTION_SETS_COLLECTION, id);
    await deleteDoc(questionSetRef);
  } catch (error) {
    console.error('Error deleting question set:', error);
    throw error;
  }
};

/**
 * Menyimpan hasil latihan soal
 */
export const savePracticeResult = async (result: Omit<PracticeResult, 'id'>): Promise<string> => {
  try {
    const resultData = {
      ...result,
      completedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, PRACTICE_RESULTS_COLLECTION), resultData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving practice result:', error);
    throw error;
  }
};

/**
 * Mengambil hasil latihan soal berdasarkan ID
 */
export const getPracticeResultById = async (id: string): Promise<PracticeResult | null> => {
  try {
    const resultRef = doc(db, PRACTICE_RESULTS_COLLECTION, id);
    const resultDoc = await getDoc(resultRef);
    
    if (!resultDoc.exists()) {
      return null;
    }
    
    const data = resultDoc.data();
    return {
      ...data,
      id: resultDoc.id,
      completedAt: data.completedAt?.toDate()
    } as PracticeResult;
  } catch (error) {
    console.error('Error getting practice result by ID:', error);
    throw error;
  }
};

/**
 * Mengambil hasil latihan soal untuk pengguna tertentu
 */
export const getUserPracticeResults = async (userId: string, limitCount?: number): Promise<PracticeResult[]> => {
  try {
    let resultsRef = query(
      collection(db, PRACTICE_RESULTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc')
    );
    
    if (limitCount) {
      resultsRef = query(resultsRef, limit(limitCount));
    }
    
    const snapshot = await getDocs(resultsRef);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        completedAt: data.completedAt?.toDate()
      } as PracticeResult;
    });
  } catch (error) {
    console.error('Error getting user practice results:', error);
    throw error;
  }
};

/**
 * Mengambil statistik latihan soal untuk pengguna tertentu
 */
export const getUserPracticeStats = async (userId: string): Promise<PracticeStats> => {
  try {
    const resultsRef = query(
      collection(db, PRACTICE_RESULTS_COLLECTION),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(resultsRef);
    
    let totalQuestions = 0;
    let answeredQuestions = 0;
    let correctAnswers = 0;
    let totalTime = 0;
    let streak = 0;
    
    // Urutkan hasil berdasarkan tanggal
    const sortedResults = snapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          completedAt: data.completedAt?.toDate()
        } as PracticeResult;
      })
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
    
    // Hitung streak (berapa hari berturut-turut pengguna berlatih)
    if (sortedResults.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastPracticeDate = new Date(sortedResults[0]?.completedAt || new Date());
      lastPracticeDate.setHours(0, 0, 0, 0);
      
      const dayDiff = Math.floor((today.getTime() - lastPracticeDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff <= 1) {
        streak = 1;
        
        // Periksa hari-hari sebelumnya
        let currentDate = new Date(lastPracticeDate);
        currentDate.setDate(currentDate.getDate() - 1);
        
        for (let i = 1; i < sortedResults.length; i++) {
          const practiceDate = new Date(sortedResults[i]?.completedAt || new Date());
          practiceDate.setHours(0, 0, 0, 0);
          
          if (practiceDate.getTime() === currentDate.getTime()) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else if (practiceDate.getTime() < currentDate.getTime()) {
            break;
          }
        }
      }
    }
    
    // Hitung statistik lainnya
    sortedResults.forEach(result => {
      totalQuestions += result.totalQuestions;
      answeredQuestions += result.totalQuestions;
      correctAnswers += result.totalCorrect;
      totalTime += result.completionTime;
    });
    
    const accuracy = answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0;
    const averageTimePerQuestion = answeredQuestions > 0 ? totalTime / answeredQuestions : 0;
    
    // Format waktu rata-rata
    const minutes = Math.floor(averageTimePerQuestion / 60);
    const seconds = Math.floor(averageTimePerQuestion % 60);
    const averageTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    return {
      totalQuestions,
      answeredQuestions,
      accuracy: Math.round(accuracy),
      averageTime,
      streak
    };
  } catch (error) {
    console.error('Error getting user practice stats:', error);
    throw error;
  }
};

/**
 * Mengambil aktivitas latihan terbaru untuk pengguna tertentu
 */
export const getRecentActivity = async (userId: string, count: number = 5): Promise<RecentActivity[]> => {
  try {
    const resultsRef = query(
      collection(db, PRACTICE_RESULTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc'),
      limit(count)
    );
    
    const snapshot = await getDocs(resultsRef);
    
    const recentActivity: RecentActivity[] = [];
    
    for (const doc of snapshot.docs) {
      const resultData = doc.data() as PracticeResult;
      const questionSet = await getQuestionSetById(resultData.questionSetId);
      
      if (questionSet) {
        // Tentukan performa berdasarkan skor
        let performance: 'excellent' | 'good' | 'average' | 'poor' = 'average';
        const percentage = (resultData.score / resultData.totalQuestions) * 100;
        
        if (percentage >= 90) {
          performance = 'excellent';
        } else if (percentage >= 75) {
          performance = 'good';
        } else if (percentage >= 50) {
          performance = 'average';
        } else {
          performance = 'poor';
        }
        
        // Format waktu
        const minutes = Math.floor(resultData.completionTime / 60);
        const seconds = Math.floor(resultData.completionTime % 60);
        const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Format tanggal
        const completedDate = resultData.completedAt instanceof Date 
          ? resultData.completedAt 
          : (resultData.completedAt as any)?.toDate ? (resultData.completedAt as any).toDate() : new Date();
        const now = new Date();
        let dateFormatted: string;
        
        const diffDays = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          dateFormatted = 'Hari ini';
        } else if (diffDays === 1) {
          dateFormatted = 'Kemarin';
        } else if (diffDays < 7) {
          dateFormatted = `${diffDays} hari lalu`;
        } else if (diffDays < 30) {
          const weeks = Math.floor(diffDays / 7);
          dateFormatted = `${weeks} minggu lalu`;
        } else {
          dateFormatted = completedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }
        
        recentActivity.push({
          id: doc.id,
          title: questionSet.title,
          questionSetId: questionSet.id,
          date: dateFormatted,
          questions: resultData.totalQuestions,
          score: resultData.score,
          time: timeFormatted,
          performance
        });
      }
    }
    
    return recentActivity;
  } catch (error) {
    console.error('Error getting recent activity:', error);
    throw error;
  }
};

/**
 * Membuat set soal dengan soal-soal baru sekaligus
 */
export const createQuestionSetWithQuestions = async (
  questionSet: Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt' | 'questions'>,
  questions: Omit<Question, 'id' | 'createdAt'>[]
): Promise<string> => {
  try {
    const batch = writeBatch(db);
    const now = Timestamp.now();
    
    // Tambahkan soal-soal terlebih dahulu
    const questionIds: string[] = [];
    
    for (const question of questions) {
      const questionRef = doc(collection(db, QUESTIONS_COLLECTION));
      batch.set(questionRef, {
        ...question,
        createdAt: now
      });
      questionIds.push(questionRef.id);
    }
    
    // Tambahkan set soal dengan referensi ke soal-soal yang baru dibuat
    const questionSetRef = doc(collection(db, QUESTION_SETS_COLLECTION));
    batch.set(questionSetRef, {
      ...questionSet,
      questions: questionIds,
      questionCount: questionIds.length,
      createdAt: now,
      updatedAt: now
    });
    
    await batch.commit();
    return questionSetRef.id;
  } catch (error) {
    console.error('Error creating question set with questions:', error);
    throw error;
  }
};