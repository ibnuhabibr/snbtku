/**
 * Service untuk mengelola materi pembelajaran di Firestore
 * Menggunakan Supabase untuk File Storage
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
} from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Firestore database
import { supabase } from '@/lib/supabaseClient'; // Supabase client
import {
  Material,
  SummaryMaterial,
  VideoMaterial,
  NotesMaterial,
  MaterialFilter,
  MaterialStats,
} from '@/models/material';

// Nama koleksi di Firestore
const MATERIALS_COLLECTION = 'materials';
const SUPABASE_BUCKET_NAME = 'materials'; // Nama bucket di Supabase

/**
 * Mengambil semua materi dengan filter opsional (tetap pakai Firestore)
 */
export const getMaterials = async (
  filter?: MaterialFilter,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  pageSize: number = 10
): Promise<{ materials: Material[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    let materialsQuery = collection(db, MATERIALS_COLLECTION);
    let constraints = [];

    // Menerapkan filter
    if (filter) {
      if (filter.subtest && filter.subtest !== 'all') {
        constraints.push(where('subtest', '==', filter.subtest));
      }
      if (filter.type && filter.type !== 'all') {
        constraints.push(where('type', '==', filter.type));
      }
      if (filter.difficulty && filter.difficulty !== 'all') {
        constraints.push(where('difficulty', '==', filter.difficulty));
      }
      if (filter.topic && filter.topic !== 'all') {
        constraints.push(where('topic', '==', filter.topic));
      }
    }

    constraints.push(orderBy('lastUpdated', 'desc'));

    let materialsRef = query(materialsQuery, ...constraints);

    if (lastDoc) {
      materialsRef = query(materialsRef, startAfter(lastDoc), limit(pageSize));
    } else {
      materialsRef = query(materialsRef, limit(pageSize));
    }

    const snapshot = await getDocs(materialsRef);
    const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

    const materials = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate(),
        lastUpdated: data.lastUpdated?.toDate(),
      } as Material;
    });

    if (filter?.searchQuery) {
      const searchLower = filter.searchQuery.toLowerCase();
      return {
        materials: materials.filter(
          (material) =>
            material.title.toLowerCase().includes(searchLower) ||
            material.description.toLowerCase().includes(searchLower) ||
            material.topic.toLowerCase().includes(searchLower)
        ),
        lastDoc: lastVisible,
      };
    }

    return { materials, lastDoc: lastVisible };
  } catch (error) {
    console.error('Error getting materials:', error);
    throw error;
  }
};

/**
 * Menambahkan materi video baru (Upload thumbnail ke Supabase)
 */
export const addVideoMaterial = async (
  material: Omit<VideoMaterial, 'id' | 'createdAt'>,
  thumbnailFile?: File
): Promise<string> => {
  try {
    let thumbnailUrl = material.thumbnail;

    if (thumbnailFile) {
      const filePath = `thumbnails/${Date.now()}_${thumbnailFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from(SUPABASE_BUCKET_NAME)
        .upload(filePath, thumbnailFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(SUPABASE_BUCKET_NAME).getPublicUrl(filePath);
      thumbnailUrl = data.publicUrl;
    }

    const materialData = {
      ...material,
      thumbnail: thumbnailUrl,
      type: 'video',
      createdAt: Timestamp.now(),
      lastUpdated: Timestamp.now(),
      views: 0,
    };

    const docRef = await addDoc(collection(db, MATERIALS_COLLECTION), materialData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding video material:', error);
    throw error;
  }
};

/**
 * Menambahkan materi catatan/rumus baru (Upload file ke Supabase)
 */
export const addNotesMaterial = async (
  material: Omit<NotesMaterial, 'id' | 'createdAt' | 'fileUrl'>,
  file: File
): Promise<string> => {
  try {
    const filePath = `notes/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(SUPABASE_BUCKET_NAME).getPublicUrl(filePath);
    const fileUrl = data.publicUrl;

    const materialData = {
      ...material,
      fileUrl,
      type: 'notes',
      createdAt: Timestamp.now(),
      lastUpdated: Timestamp.now(),
      downloads: 0,
    };

    const docRef = await addDoc(collection(db, MATERIALS_COLLECTION), materialData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding notes material:', error);
    throw error;
  }
};

/**
 * Menghapus materi (termasuk file di Supabase)
 */
export const deleteMaterial = async (id: string): Promise<void> => {
  try {
    const material = await getMaterialById(id);

    if (material) {
      // Hapus file dari Supabase Storage jika ada
      let fileUrlToDelete: string | null = null;
      if (material.type === 'video') {
        fileUrlToDelete = (material as VideoMaterial).thumbnail;
      } else if (material.type === 'notes') {
        fileUrlToDelete = (material as NotesMaterial).fileUrl;
      }

      if (fileUrlToDelete) {
        try {
          const url = new URL(fileUrlToDelete);
          const filePath = url.pathname.split(`/v1/object/public/${SUPABASE_BUCKET_NAME}/`)[1];
          if (filePath) {
            await supabase.storage.from(SUPABASE_BUCKET_NAME).remove([filePath]);
          }
        } catch (storageError) {
          console.error('Error deleting file from Supabase:', storageError);
          // Lanjutkan meskipun ada error saat menghapus file
        }
      }
    }

    // Hapus dokumen dari Firestore
    const materialRef = doc(db, MATERIALS_COLLECTION, id);
    await deleteDoc(materialRef);
  } catch (error) {
    console.error('Error deleting material:', error);
    throw error;
  }
};


// ===================================================================
// SISA FUNGSI DI BAWAH INI TIDAK PERLU DIUBAH KARENA HANYA BERINTERAKSI
// DENGAN FIRESTORE DAN TIDAK ADA HUBUNGANNYA DENGAN FILE STORAGE.
// ===================================================================

/**
 * Mengambil materi berdasarkan ID
 */
export const getMaterialById = async (id: string): Promise<Material | null> => {
    try {
      const materialRef = doc(db, MATERIALS_COLLECTION, id);
      const materialDoc = await getDoc(materialRef);
      
      if (!materialDoc.exists()) {
        return null;
      }
      
      const data = materialDoc.data();
      return {
        ...data,
        id: materialDoc.id,
        createdAt: data.createdAt?.toDate(),
        lastUpdated: data.lastUpdated?.toDate()
      } as Material;
    } catch (error) {
      console.error('Error getting material by ID:', error);
      throw error;
    }
  };
  
  /**
   * Menambahkan materi rangkuman baru
   */
  export const addSummaryMaterial = async (material: Omit<SummaryMaterial, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const materialData = {
        ...material,
        type: 'summary',
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now(),
        views: 0
      };
      
      const docRef = await addDoc(collection(db, MATERIALS_COLLECTION), materialData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding summary material:', error);
      throw error;
    }
  };

/**
 * Memperbarui materi
 */
export const updateMaterial = async (id: string, material: Partial<Material>): Promise<void> => {
  try {
    const materialRef = doc(db, MATERIALS_COLLECTION, id);
    
    // Pastikan lastUpdated diperbarui
    const updateData = {
      ...material,
      lastUpdated: Timestamp.now()
    };
    
    await updateDoc(materialRef, updateData);
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};


/**
 * Menambah jumlah view untuk materi
 */
export const incrementMaterialViews = async (id: string): Promise<void> => {
  try {
    const materialRef = doc(db, MATERIALS_COLLECTION, id);
    const materialDoc = await getDoc(materialRef);
    
    if (materialDoc.exists()) {
      const currentViews = materialDoc.data().views || 0;
      await updateDoc(materialRef, { views: currentViews + 1 });
    }
  } catch (error) {
    console.error('Error incrementing material views:', error);
    throw error;
  }
};

/**
 * Menambah jumlah download untuk materi catatan/rumus
 */
export const incrementMaterialDownloads = async (id: string): Promise<void> => {
  try {
    const materialRef = doc(db, MATERIALS_COLLECTION, id);
    const materialDoc = await getDoc(materialRef);
    
    if (materialDoc.exists()) {
      const currentDownloads = materialDoc.data().downloads || 0;
      await updateDoc(materialRef, { downloads: currentDownloads + 1 });
    }
  } catch (error) {
    console.error('Error incrementing material downloads:', error);
    throw error;
  }
};

/**
 * Mengambil statistik materi
 */
export const getMaterialStats = async (): Promise<MaterialStats> => {
  try {
    const materialsRef = collection(db, MATERIALS_COLLECTION);
    const snapshot = await getDocs(materialsRef);
    
    let totalMaterials = 0;
    let videos = 0;
    let summaries = 0;
    let downloads = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      totalMaterials++;
      
      if (data.type === 'video') {
        videos++;
      } else if (data.type === 'summary') {
        summaries++;
      }
      
      if (data.type === 'notes') {
        downloads += data.downloads || 0;
      }
    });
    
    return {
      totalMaterials,
      videos,
      summaries,
      downloads
    };
  } catch (error) {
    console.error('Error getting material stats:', error);
    throw error;
  }
};

/**
 * Mengambil materi berdasarkan subtest
 */
export const getMaterialsBySubtest = async (subtest: string): Promise<Material[]> => {
  try {
    const materialsRef = query(
      collection(db, MATERIALS_COLLECTION),
      where('subtest', '==', subtest),
      orderBy('lastUpdated', 'desc')
    );
    
    const snapshot = await getDocs(materialsRef);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate(),
        lastUpdated: data.lastUpdated?.toDate()
      } as Material;
    });
  } catch (error) {
    console.error('Error getting materials by subtest:', error);
    throw error;
  }
};

/**
 * Mengambil materi terbaru
 */
export const getLatestMaterials = async (count: number = 5): Promise<Material[]> => {
  try {
    const materialsRef = query(
      collection(db, MATERIALS_COLLECTION),
      orderBy('lastUpdated', 'desc'),
      limit(count)
    );
    
    const snapshot = await getDocs(materialsRef);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate(),
        lastUpdated: data.lastUpdated?.toDate()
      } as Material;
    });
  } catch (error) {
    console.error('Error getting latest materials:', error);
    throw error;
  }
};

/**
 * Mengambil materi populer berdasarkan jumlah view
 */
export const getPopularMaterials = async (count: number = 5): Promise<Material[]> => {
  try {
    const materialsRef = query(
      collection(db, MATERIALS_COLLECTION),
      orderBy('views', 'desc'),
      limit(count)
    );
    
    const snapshot = await getDocs(materialsRef);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate(),
        lastUpdated: data.lastUpdated?.toDate()
      } as Material;
    });
  } catch (error) {
    console.error('Error getting popular materials:', error);
    throw error;
  }
};

/**
 * Toggle bookmark status untuk materi
 */
export const toggleMaterialBookmark = async (materialId: string, userId: string): Promise<boolean> => {
  try {
    // Implementasi bookmark menggunakan subcollection di user document
    const bookmarkRef = doc(db, `users/${userId}/bookmarks`, materialId);
    const bookmarkDoc = await getDoc(bookmarkRef);
    
    if (bookmarkDoc.exists()) {
      // Hapus bookmark jika sudah ada
      await deleteDoc(bookmarkRef);
      return false; // tidak di-bookmark
    } else {
      // Tambahkan bookmark jika belum ada
      await updateDoc(bookmarkRef, {
        materialId,
        createdAt: Timestamp.now()
      });
      return true; // di-bookmark
    }
  } catch (error) {
    console.error('Error toggling material bookmark:', error);
    throw error;
  }
};

/**
 * Mengambil materi yang di-bookmark oleh pengguna
 */
export const getBookmarkedMaterials = async (userId: string): Promise<Material[]> => {
  try {
    const bookmarksRef = collection(db, `users/${userId}/bookmarks`);
    const bookmarksSnapshot = await getDocs(bookmarksRef);
    
    // Jika tidak ada bookmark, kembalikan array kosong
    if (bookmarksSnapshot.empty) {
      return [];
    }
    
    // Ambil semua ID materi yang di-bookmark
    const materialIds = bookmarksSnapshot.docs.map(doc => doc.id);
    
    // Ambil data materi untuk setiap ID
    const materials: Material[] = [];
    
    for (const id of materialIds) {
      const material = await getMaterialById(id);
      if (material) {
        materials.push({
          ...material,
          isBookmarked: true
        });
      }
    }
    
    return materials;
  } catch (error) {
    console.error('Error getting bookmarked materials:', error);
    throw error;
  }
};