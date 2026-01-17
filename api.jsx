// api.jsx
// =============================================
// 🔥 FIREBASE CONFIGURATION (MIGRATED FROM index.html)
// =============================================
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  getDocs,
  writeBatch
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA5b7KYCxC8WuYkvdYGIi1z6t84gGc-MxA",
  authDomain: "simple-bisnisbrengsekbgt.firebaseapp.com",
  projectId: "simple-bisnisbrengsekbgt",
  storageBucket: "simple-bisnisbrengsekbgt.firebasestorage.app",
  messagingSenderId: "261716836340",
  appId: "1:261716836340:web:b2591092aebc9d3e5983a1"
};

// =============================================
// 🌍 GLOBAL CONSTANTS (MIGRATED FROM index.html)
// =============================================
export const ADMIN_EMAILS = [
  'skizoservice@gmail.com',
  'owner2@gmail.com', 
  'naylagentasaka2006@gmail.com'
];

export const BADGES = {
  'newbie': {
    name: 'NEWBIE',
    class: 'badge-newbie',
    icon: 'fas fa-seedling',
    price: 0,
    description: 'Pengguna baru',
    autoAssign: true
  },
  'verified': {
    name: 'VERIFIED',
    class: 'badge-verified',
    icon: 'fas fa-check-circle',
    price: 10000,
    description: 'Akun terverifikasi',
    duration: 'monthly'
  },
  'trusted_worker': {
    name: 'TRUSTED WORKER',
    class: 'badge-trusted-worker',
    icon: 'fas fa-award',
    price: 0,
    description: 'Pekerja terpercaya (10 quest selesai)',
    requirements: { type: 'quests_completed', count: 10, rating: 4.5 }
  },
  'trusted_employer': {
    name: 'TRUSTED EMPLOYER',
    class: 'badge-trusted-employer',
    icon: 'fas fa-briefcase',
    price: 0,
    description: 'Pemberi kerja terpercaya (10 quest diposting)',
    requirements: { type: 'quests_posted', count: 10 }
  },
  'scammer': {
    name: 'SCAMMER',
    class: 'badge-scammer',
    icon: 'fas fa-skull-crossbones',
    price: 0,
    description: 'Pengguna nakal',
    assignableBy: 'admin'
  },
  'hoax': {
    name: 'HOAX',
    class: 'badge-hoax',
    icon: 'fas fa-exclamation-triangle',
    price: 0,
    description: 'Penyebar hoax',
    assignableBy: 'admin'
  },
  'vip': {
    name: 'VIP',
    class: 'badge-vip',
    icon: 'fas fa-crown',
    price: 50000,
    description: 'Member VIP',
    duration: 'monthly'
  }
};

// =============================================
// 🔥 FIREBASE SERVICES (MIGRATED FROM index.html)
// =============================================
let app;
let auth;
let db;

export const initializeFirebase = () => {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("🔥 Firebase initialized successfully");
    return { app, auth, db };
  } catch (error) {
    console.error("🔥 Firebase initialization error:", error);
    throw error;
  }
};

export const getFirebaseServices = () => {
  if (!app || !auth || !db) {
    throw new Error("Firebase not initialized. Call initializeFirebase() first.");
  }
  return { app, auth, db };
};

// =============================================
// 📱 AUTHENTICATION SERVICES (MIGRATED FROM index.html)
// =============================================
export const authService = {
  // Login with email/password
  loginWithEmailPassword: async (email, password) => {
    try {
      const { auth } = getFirebaseServices();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Login gagal! ";
      
      switch(error.code) {
        case 'auth/user-not-found':
          errorMessage += "User tidak ditemukan.";
          break;
        case 'auth/wrong-password':
          errorMessage += "Password salah.";
          break;
        case 'auth/invalid-email':
          errorMessage += "Email tidak valid.";
          break;
        default:
          errorMessage += error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Register with email/password
  registerWithEmailPassword: async (userData) => {
    try {
      const { auth, db } = getFirebaseServices();
      const { name, email, password, phone, region, role, initialBadge = 'newbie' } = userData;
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const userProfile = {
        uid: userCredential.user.uid,
        email: email,
        name: name,
        phone: phone,
        region: region,
        role: role || 'user',
        verified: false,
        badges: [initialBadge],
        reputation: 'newbie',
        rating: 0,
        balance: 0,
        pendingBalance: 0,
        photoURL: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        stats: {
          totalQuests: 0,
          completedQuests: 0,
          activeQuests: 0,
          failedQuests: 0
        }
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
      
      return { success: true, user: userCredential.user, profile: userProfile };
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Pendaftaran gagal! ";
      
      switch(error.code) {
        case 'auth/email-already-in-use':
          errorMessage += "Email sudah terdaftar.";
          break;
        case 'auth/invalid-email':
          errorMessage += "Email tidak valid.";
          break;
        case 'auth/weak-password':
          errorMessage += "Password terlalu lemah.";
          break;
        default:
          errorMessage += error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Login with Google
  loginWithGoogle: async () => {
    try {
      const { auth } = getFirebaseServices();
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error) {
      console.error("Google login error:", error);
      return { success: false, error: "Login dengan Google gagal: " + error.message };
    }
  },

  // Logout
  logout: async () => {
    try {
      const { auth } = getFirebaseServices();
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  },

  // Auth state listener
  onAuthStateChanged: (callback) => {
    const { auth } = getFirebaseServices();
    return onAuthStateChanged(auth, callback);
  },

  // Check if user is admin
  checkAdminStatus: (userEmail, userRole) => {
    const isAdmin = ADMIN_EMAILS.includes(userEmail?.toLowerCase()) || 
                   userRole === 'admin' || 
                   userRole === 'owner';
    const isOwner = userRole === 'owner';
    const isKasir = userRole === 'kasir';
    
    return { isAdmin, isOwner, isKasir };
  }
};

// =============================================
// 👤 USER PROFILE SERVICES (MIGRATED FROM index.html)
// =============================================
export const userService = {
  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const { db } = getFirebaseServices();
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        return { success: false, error: "User tidak ditemukan" };
      }
      
      return { success: true, profile: userDoc.data() };
    } catch (error) {
      console.error("Error getting user profile:", error);
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    try {
      const { db } = getFirebaseServices();
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return { success: false, error: error.message };
    }
  },

  // Upload profile image
  uploadProfileImage: async (userId, file) => {
    try {
      // Convert file to base64 (mimicking original functionality)
      const base64Image = await convertToBase64(file);
      
      const { db } = getFirebaseServices();
      await updateDoc(doc(db, 'users', userId), {
        photoURL: base64Image,
        updatedAt: serverTimestamp()
      });
      
      return { success: true, photoURL: base64Image };
    } catch (error) {
      console.error("Error uploading profile image:", error);
      return { success: false, error: error.message };
    }
  },

  // Get user statistics
  getUserStatistics: async (userId) => {
    try {
      const { db } = getFirebaseServices();
      
      // Count quests posted
      const questsPostedQuery = query(
        collection(db, 'quests'),
        where('employerId', '==', userId)
      );
      const questsPostedSnapshot = await getDocs(questsPostedQuery);
      const questsPosted = questsPostedSnapshot.size;
      
      // Count quests taken
      const questsTakenQuery = query(
        collection(db, 'quests'),
        where('workerId', '==', userId)
      );
      const questsTakenSnapshot = await getDocs(questsTakenQuery);
      const questsTaken = questsTakenSnapshot.size;
      
      // Get user balance from profile
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userProfile = userDoc.data();
      
      return {
        success: true,
        stats: {
          questsPosted,
          questsTaken,
          rating: userProfile?.rating || 0,
          balance: userProfile?.balance || 0,
          pendingBalance: userProfile?.pendingBalance || 0
        }
      };
    } catch (error) {
      console.error("Error getting user statistics:", error);
      return { success: false, error: error.message };
    }
  },

  // Get user transactions
  getUserTransactions: async (userId, limitCount = 10) => {
    try {
      const { db } = getFirebaseServices();
      
      const paymentsQuery = query(
        collection(db, 'payments'),
        where('employerId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(paymentsQuery);
      const transactions = [];
      
      snapshot.forEach(doc => {
        transactions.push(doc.data());
      });
      
      return { success: true, transactions };
    } catch (error) {
      console.error("Error getting user transactions:", error);
      return { success: false, error: error.message };
    }
  }
};

// =============================================
// 🗺️ MAP SERVICES (MIGRATED FROM index.html)
// =============================================
export const mapService = {
  // Add new marker
  addMarker: async (markerData) => {
    try {
      const { db } = getFirebaseServices();
      const markerId = 'marker_' + Date.now();
      
      const markerWithId = {
        ...markerData,
        id: markerId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'markers', markerId), markerWithId);
      return { success: true, markerId };
    } catch (error) {
      console.error("Error adding marker:", error);
      return { success: false, error: error.message };
    }
  },

  // Get all markers
  getAllMarkers: async () => {
    try {
      const { db } = getFirebaseServices();
      const snapshot = await getDocs(collection(db, 'markers'));
      const markers = [];
      
      snapshot.forEach(doc => {
        markers.push(doc.data());
      });
      
      return { success: true, markers };
    } catch (error) {
      console.error("Error getting markers:", error);
      return { success: false, error: error.message };
    }
  },

  // Listen to markers changes
  listenToMarkers: (callback) => {
    const { db } = getFirebaseServices();
    return onSnapshot(collection(db, 'markers'), (snapshot) => {
      const markers = [];
      snapshot.forEach(doc => {
        markers.push(doc.data());
      });
      callback(markers);
    });
  },

  // Delete marker
  deleteMarker: async (markerId) => {
    try {
      const { db } = getFirebaseServices();
      await deleteDoc(doc(db, 'markers', markerId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting marker:", error);
      return { success: false, error: error.message };
    }
  },

  // Search markers
  searchMarkers: async (searchTerm, category = 'all') => {
    try {
      const { db } = getFirebaseServices();
      const snapshot = await getDocs(collection(db, 'markers'));
      const allMarkers = [];
      
      snapshot.forEach(doc => {
        allMarkers.push(doc.data());
      });
      
      // Filter markers
      const filteredMarkers = allMarkers.filter(marker => {
        const matchesCategory = category === 'all' || marker.category === category;
        const matchesSearch = !searchTerm || 
          marker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          marker.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (marker.userName && marker.userName.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesCategory && matchesSearch;
      });
      
      return { success: true, markers: filteredMarkers };
    } catch (error) {
      console.error("Error searching markers:", error);
      return { success: false, error: error.message };
    }
  }
};

// =============================================
// 📋 QUEST SERVICES (MIGRATED FROM index.html)
// =============================================
export const questService = {
  // Create new quest
  createQuest: async (questData) => {
    try {
      const { db } = getFirebaseServices();
      const questId = 'quest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const adminFee = Math.floor(questData.budget * 0.05);
      const totalAmount = questData.budget + adminFee;
      
      const questWithId = {
        ...questData,
        id: questId,
        adminFee: adminFee,
        totalAmount: totalAmount,
        status: 'pending_payment',
        paymentStatus: 'pending',
        workerId: null,
        workerName: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'quests', questId), questWithId);
      return { success: true, questId, totalAmount, adminFee };
    } catch (error) {
      console.error("Error creating quest:", error);
      return { success: false, error: error.message };
    }
  },

  // Get all quests
  getAllQuests: async () => {
    try {
      const { db } = getFirebaseServices();
      const snapshot = await getDocs(collection(db, 'quests'));
      const quests = [];
      
      snapshot.forEach(doc => {
        quests.push(doc.data());
      });
      
      return { success: true, quests };
    } catch (error) {
      console.error("Error getting quests:", error);
      return { success: false, error: error.message };
    }
  },

  // Listen to quests changes
  listenToQuests: (callback) => {
    const { db } = getFirebaseServices();
    return onSnapshot(collection(db, 'quests'), (snapshot) => {
      const quests = [];
      snapshot.forEach(doc => {
        quests.push(doc.data());
      });
      callback(quests);
    });
  },

  // Get quest by ID
  getQuestById: async (questId) => {
    try {
      const { db } = getFirebaseServices();
      const questDoc = await getDoc(doc(db, 'quests', questId));
      
      if (!questDoc.exists()) {
        return { success: false, error: "Quest tidak ditemukan" };
      }
      
      return { success: true, quest: questDoc.data() };
    } catch (error) {
      console.error("Error getting quest:", error);
      return { success: false, error: error.message };
    }
  },

  // Take quest
  takeQuest: async (questId, workerId, workerName, workerBadges = []) => {
    try {
      const { db } = getFirebaseServices();
      await updateDoc(doc(db, 'quests', questId), {
        status: 'taken',
        workerId: workerId,
        workerName: workerName,
        workerBadges: workerBadges,
        takenAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error taking quest:", error);
      return { success: false, error: error.message };
    }
  },

  // Update quest status
  updateQuestStatus: async (questId, updates) => {
    try {
      const { db } = getFirebaseServices();
      await updateDoc(doc(db, 'quests', questId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error updating quest:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete quest
  deleteQuest: async (questId) => {
    try {
      const { db } = getFirebaseServices();
      await deleteDoc(doc(db, 'quests', questId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting quest:", error);
      return { success: false, error: error.message };
    }
  },

  // Search quests
  searchQuests: async (searchTerm, category = 'all', paymentStatus = 'paid') => {
    try {
      const { db } = getFirebaseServices();
      const snapshot = await getDocs(collection(db, 'quests'));
      const allQuests = [];
      
      snapshot.forEach(doc => {
        allQuests.push(doc.data());
      });
      
      // Filter quests
      const filteredQuests = allQuests.filter(quest => {
        const matchesCategory = category === 'all' || quest.category === category;
        const matchesPayment = quest.paymentStatus === paymentStatus;
        const matchesSearch = !searchTerm || 
          quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (quest.employerName && quest.employerName.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesCategory && matchesPayment && matchesSearch;
      });
      
      return { success: true, quests: filteredQuests };
    } catch (error) {
      console.error("Error searching quests:", error);
      return { success: false, error: error.message };
    }
  }
};

// =============================================
// 💳 PAYMENT SERVICES (MIGRATED FROM index.html)
// =============================================
export const paymentService = {
  // PAYMENT API KEY (NEW QRIS SYSTEM)
  PAYMENT_API_KEY: "EIXlvG2cqApi4lrNzvKVPE5A0OdHHpNb",
  
  // QRIS URL (PAK KASIR SYSTEM)
  QRIS_URL: "https://files.catbox.moe/f1h9md.png",
  
  // Submit payment proof
  submitPaymentProof: async (paymentData) => {
    try {
      const { db } = getFirebaseServices();
      const paymentId = 'payment_' + Date.now();
      
      const paymentWithId = {
        ...paymentData,
        id: paymentId,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'payments', paymentId), paymentWithId);
      
      // Update quest payment status
      if (paymentData.questId) {
        await updateDoc(doc(db, 'quests', paymentData.questId), {
          paymentStatus: 'pending_verification',
          paymentId: paymentId,
          proofBase64: paymentData.proofBase64,
          updatedAt: serverTimestamp()
        });
      }
      
      return { success: true, paymentId };
    } catch (error) {
      console.error("Error submitting payment proof:", error);
      return { success: false, error: error.message };
    }
  },

  // Auto payment handler (NEW QRIS SYSTEM)
  processAutoPayment: async (transactionData) => {
    try {
      // NEW QRIS SYSTEM - OTOMATIS
      // API KEY: EIXlvG2cqApi4lrNzvKVPE5A0OdHHpNb
      // User scan QR → Status sukses → Unlock badge & fitur
      
      const { db } = getFirebaseServices();
      const { userId, amount, questId, badgeId } = transactionData;
      
      // Simulate auto verification (in production, this would connect to payment gateway)
      const paymentId = 'auto_payment_' + Date.now();
      
      // Create payment record
      await setDoc(doc(db, 'payments', paymentId), {
        id: paymentId,
        userId: userId,
        questId: questId,
        amount: amount,
        status: 'approved',
        method: 'qris_auto',
        gateway: 'PAK_KASIR_SYSTEM',
        approvedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Update quest if exists
      if (questId) {
        await updateDoc(doc(db, 'quests', questId), {
          paymentStatus: 'paid',
          status: 'open',
          paymentId: paymentId,
          updatedAt: serverTimestamp()
        });
      }
      
      // Unlock badge if badge purchase
      if (badgeId) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        const user = userDoc.data();
        
        const newBadges = user.badges ? [...user.badges, badgeId] : [badgeId];
        const newBalance = user.balance - amount;
        
        await updateDoc(doc(db, 'users', userId), {
          badges: newBadges,
          balance: newBalance,
          updatedAt: serverTimestamp()
        });
      }
      
      return { 
        success: true, 
        message: "Pembayaran berhasil! Fitur/badge telah diunlock.",
        paymentId 
      };
    } catch (error) {
      console.error("Error processing auto payment:", error);
      return { success: false, error: error.message };
    }
  },

  // Get pending payments for admin
  getPendingPayments: async () => {
    try {
      const { db } = getFirebaseServices();
      const paymentsQuery = query(
        collection(db, 'payments'),
        where('status', '==', 'pending')
      );
      
      const snapshot = await getDocs(paymentsQuery);
      const payments = [];
      
      snapshot.forEach(doc => {
        payments.push(doc.data());
      });
      
      return { success: true, payments };
    } catch (error) {
      console.error("Error getting pending payments:", error);
      return { success: false, error: error.message };
    }
  },

  // Approve payment
  approvePayment: async (paymentId, adminId) => {
    try {
      const { db } = getFirebaseServices();
      
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: adminId,
        updatedAt: serverTimestamp()
      });
      
      // Get payment data to update quest
      const paymentDoc = await getDoc(doc(db, 'payments', paymentId));
      const payment = paymentDoc.data();
      
      if (payment.questId) {
        await updateDoc(doc(db, 'quests', payment.questId), {
          paymentStatus: 'paid',
          status: 'open',
          updatedAt: serverTimestamp()
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error approving payment:", error);
      return { success: false, error: error.message };
    }
  },

  // Reject payment
  rejectPayment: async (paymentId, adminId, reason) => {
    try {
      const { db } = getFirebaseServices();
      
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: serverTimestamp(),
        rejectedBy: adminId,
        updatedAt: serverTimestamp()
      });
      
      // Get payment data to update quest
      const paymentDoc = await getDoc(doc(db, 'payments', paymentId));
      const payment = paymentDoc.data();
      
      if (payment.questId) {
        await updateDoc(doc(db, 'quests', payment.questId), {
          paymentStatus: 'rejected',
          updatedAt: serverTimestamp()
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error rejecting payment:", error);
      return { success: false, error: error.message };
    }
  }
};

// =============================================
// 👷 WORK PROOF SERVICES (MIGRATED FROM index.html)
// =============================================
export const workProofService = {
  // Submit work proof
  submitWorkProof: async (workProofData) => {
    try {
      const { db } = getFirebaseServices();
      const workProofId = 'workproof_' + Date.now();
      
      const proofWithId = {
        ...workProofData,
        id: workProofId,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'work_proofs', workProofId), proofWithId);
      
      // Update quest work proof status
      if (workProofData.questId) {
        await updateDoc(doc(db, 'quests', workProofData.questId), {
          workProofId: workProofId,
          workProofStatus: 'pending',
          updatedAt: serverTimestamp()
        });
      }
      
      return { success: true, workProofId };
    } catch (error) {
      console.error("Error submitting work proof:", error);
      return { success: false, error: error.message };
    }
  },

  // Get pending work proofs for admin
  getPendingWorkProofs: async () => {
    try {
      const { db } = getFirebaseServices();
      const proofsQuery = query(
        collection(db, 'work_proofs'),
        where('status', '==', 'pending')
      );
      
      const snapshot = await getDocs(proofsQuery);
      const proofs = [];
      
      snapshot.forEach(doc => {
        proofs.push(doc.data());
      });
      
      return { success: true, proofs };
    } catch (error) {
      console.error("Error getting pending work proofs:", error);
      return { success: false, error: error.message };
    }
  },

  // Approve work proof
  approveWorkProof: async (workProofId, adminId) => {
    try {
      const { db } = getFirebaseServices();
      
      await updateDoc(doc(db, 'work_proofs', workProofId), {
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: adminId,
        updatedAt: serverTimestamp()
      });
      
      // Get proof data
      const proofDoc = await getDoc(doc(db, 'work_proofs', workProofId));
      const proof = proofDoc.data();
      
      if (proof.questId) {
        // Get quest data
        const questDoc = await getDoc(doc(db, 'quests', proof.questId));
        const quest = questDoc.data();
        
        // Update worker balance
        const workerDoc = await getDoc(doc(db, 'users', proof.workerId));
        const worker = workerDoc.data();
        
        const newBalance = (worker.balance || 0) + quest.budget;
        
        await updateDoc(doc(db, 'users', proof.workerId), {
          balance: newBalance,
          updatedAt: serverTimestamp()
        });
        
        // Update quest status
        await updateDoc(doc(db, 'quests', proof.questId), {
          workProofStatus: 'approved',
          status: 'completed',
          completedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error approving work proof:", error);
      return { success: false, error: error.message };
    }
  },

  // Reject work proof
  rejectWorkProof: async (workProofId, adminId, reason) => {
    try {
      const { db } = getFirebaseServices();
      
      await updateDoc(doc(db, 'work_proofs', workProofId), {
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: serverTimestamp(),
        rejectedBy: adminId,
        updatedAt: serverTimestamp()
      });
      
      // Get proof data
      const proofDoc = await getDoc(doc(db, 'work_proofs', workProofId));
      const proof = proofDoc.data();
      
      if (proof.questId) {
        await updateDoc(doc(db, 'quests', proof.questId), {
          workProofStatus: 'rejected',
          updatedAt: serverTimestamp()
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error rejecting work proof:", error);
      return { success: false, error: error.message };
    }
  }
};

// =============================================
// 🎖️ BADGE SERVICES (MIGRATED FROM index.html)
// =============================================
export const badgeService = {
  // Purchase badge
  purchaseBadge: async (userId, badgeId) => {
    try {
      const { db } = getFirebaseServices();
      
      // Get user data
      const userDoc = await getDoc(doc(db, 'users', userId));
      const user = userDoc.data();
      
      // Get badge data
      const badge = BADGES[badgeId];
      if (!badge) {
        return { success: false, error: "Badge tidak ditemukan" };
      }
      
      // Check if user already has badge
      if (user.badges && user.badges.includes(badgeId)) {
        return { success: false, error: "Anda sudah memiliki badge ini" };
      }
      
      // Check balance
      if (user.balance < badge.price) {
        return { 
          success: false, 
          error: `Saldo tidak cukup! Dibutuhkan Rp ${formatNumber(badge.price)}` 
        };
      }
      
      // Calculate new values
      const newBalance = user.balance - badge.price;
      const newBadges = user.badges ? [...user.badges, badgeId] : [badgeId];
      
      // Update user
      await updateDoc(doc(db, 'users', userId), {
        badges: newBadges,
        balance: newBalance,
        updatedAt: serverTimestamp()
      });
      
      // Create transaction record
      const transactionId = 'badge_' + Date.now();
      await setDoc(doc(db, 'transactions', transactionId), {
        id: transactionId,
        userId: userId,
        type: 'badge_purchase',
        badgeId: badgeId,
        badgeName: badge.name,
        amount: badge.price,
        status: 'completed',
        createdAt: serverTimestamp()
      });
      
      return { 
        success: true, 
        message: `Badge ${badge.name} berhasil dibeli!`,
        newBalance,
        newBadges
      };
    } catch (error) {
      console.error("Error purchasing badge:", error);
      return { success: false, error: error.message };
    }
  },

  // Assign badge to user (admin only)
  assignBadgeToUser: async (userEmail, badgeId) => {
    try {
      const { db } = getFirebaseServices();
      
      // Find user by email
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', userEmail)
      );
      
      const usersSnapshot = await getDocs(usersQuery);
      
      if (usersSnapshot.empty) {
        return { success: false, error: "User dengan email tersebut tidak ditemukan!" };
      }
      
      const userDoc = usersSnapshot.docs[0];
      const user = userDoc.data();
      
      // Check if user already has badge
      if (user.badges && user.badges.includes(badgeId)) {
        return { success: false, error: "User sudah memiliki badge ini!" };
      }
      
      // Add badge to user
      const newBadges = user.badges ? [...user.badges, badgeId] : [badgeId];
      
      await updateDoc(doc(db, 'users', user.uid), {
        badges: newBadges,
        updatedAt: serverTimestamp()
      });
      
      // Create notification for user
      const badge = BADGES[badgeId];
      await setDoc(doc(db, 'notifications', 'badge_notif_' + Date.now()), {
        userId: user.uid,
        type: 'badge_assigned',
        title: 'Badge Baru',
        message: `Anda telah diberikan badge ${badge.name} oleh admin`,
        read: false,
        createdAt: serverTimestamp()
      });
      
      return { 
        success: true, 
        message: `Badge ${badge.name} berhasil diberikan kepada ${user.name}` 
      };
    } catch (error) {
      console.error("Error assigning badge:", error);
      return { success: false, error: error.message };
    }
  },

  // Get available badges for user
  getAvailableBadges: (userBadges = []) => {
    const availableBadges = [];
    
    for (const [badgeId, badge] of Object.entries(BADGES)) {
      const hasBadge = userBadges.includes(badgeId);
      const canPurchase = badge.price > 0;
      const isAdminAssignable = badge.assignableBy === 'admin';
      
      availableBadges.push({
        id: badgeId,
        ...badge,
        hasBadge,
        canPurchase,
        isAdminAssignable
      });
    }
    
    return availableBadges;
  }
};

// =============================================
// 👑 ADMIN SERVICES (MIGRATED FROM index.html)
// =============================================
export const adminService = {
  // Get admin dashboard statistics
  getDashboardStats: async () => {
    try {
      const { db } = getFirebaseServices();
      
      // Get counts
      const questsSnapshot = await getDocs(collection(db, 'quests'));
      const markersSnapshot = await getDocs(collection(db, 'markers'));
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const paymentsSnapshot = await getDocs(collection(db, 'payments'));
      
      const totalQuests = questsSnapshot.size;
      const totalMarkers = markersSnapshot.size;
      const activeUsers = usersSnapshot.size;
      
      // Calculate quest status
      let questsOpen = 0;
      let questsTaken = 0;
      questsSnapshot.forEach(doc => {
        const quest = doc.data();
        if (quest.status === 'open' && quest.paymentStatus === 'paid') questsOpen++;
        if (quest.status === 'taken') questsTaken++;
      });
      
      // Calculate markers today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let markersToday = 0;
      markersSnapshot.forEach(doc => {
        const marker = doc.data();
        const markerDate = marker.createdAt?.toDate();
        if (markerDate && markerDate >= today) markersToday++;
      });
      
      // Calculate revenue
      let totalRevenue = 0;
      let pendingPayments = 0;
      let adminFeeTotal = 0;
      
      paymentsSnapshot.forEach(doc => {
        const payment = doc.data();
        if (payment.status === 'approved') {
          totalRevenue += payment.amount || 0;
          adminFeeTotal += payment.adminFee || 0;
        } else if (payment.status === 'pending') {
          pendingPayments += payment.amount || 0;
        }
      });
      
      return {
        success: true,
        stats: {
          totalQuests,
          totalMarkers,
          activeUsers,
          questsOpen,
          questsTaken,
          markersToday,
          totalRevenue,
          pendingPayments,
          adminFeeTotal
        }
      };
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
      return { success: false, error: error.message };
    }
  },

  // Get all users with filtering
  getAllUsers: async (searchTerm = '', roleFilter = 'all') => {
    try {
      const { db } = getFirebaseServices();
      
      let usersQuery = collection(db, 'users');
      const snapshot = await getDocs(usersQuery);
      
      let users = [];
      snapshot.forEach(doc => {
        users.push(doc.data());
      });
      
      // Apply filters
      if (roleFilter !== 'all') {
        users = users.filter(user => user.role === roleFilter);
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        users = users.filter(user => 
          user.name?.toLowerCase().includes(term) ||
          user.email?.toLowerCase().includes(term) ||
          user.phone?.toLowerCase().includes(term) ||
          user.region?.toLowerCase().includes(term)
        );
      }
      
      return { success: true, users };
    } catch (error) {
      console.error("Error getting users:", error);
      return { success: false, error: error.message };
    }
  },

  // Update user role
  updateUserRole: async (userId, newRole) => {
    try {
      const { db } = getFirebaseServices();
      
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: serverTimestamp()
      });
      
      // Create notification
      await setDoc(doc(db, 'notifications', 'role_notif_' + Date.now()), {
        userId: userId,
        type: 'role_changed',
        title: 'Role Diubah',
        message: `Role Anda telah diubah menjadi ${newRole.toUpperCase()} oleh admin`,
        read: false,
        createdAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error updating user role:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const { db } = getFirebaseServices();
      await deleteDoc(doc(db, 'users', userId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
    }
  },

  // Clear all markers
  clearAllMarkers: async () => {
    try {
      const { db } = getFirebaseServices();
      const snapshot = await getDocs(collection(db, 'markers'));
      const batch = writeBatch(db);
      
      snapshot.forEach(document => {
        batch.delete(document.ref);
      });
      
      await batch.commit();
      return { success: true };
    } catch (error) {
      console.error("Error clearing markers:", error);
      return { success: false, error: error.message };
    }
  },

  // Clear all quests
  clearAllQuests: async () => {
    try {
      const { db } = getFirebaseServices();
      const snapshot = await getDocs(collection(db, 'quests'));
      const batch = writeBatch(db);
      
      snapshot.forEach(document => {
        batch.delete(document.ref);
      });
      
      await batch.commit();
      return { success: true };
    } catch (error) {
      console.error("Error clearing quests:", error);
      return { success: false, error: error.message };
    }
  },

  // Reset revenue data
  resetRevenueData: async (period, keepGraphData = false) => {
    try {
      const { db } = getFirebaseServices();
      
      let cutoffDate = null;
      const now = new Date();
      
      switch(period) {
        case 'now':
          break;
        case '1day':
          cutoffDate = new Date(now);
          cutoffDate.setDate(now.getDate() - 1);
          break;
        case '7days':
          cutoffDate = new Date(now);
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          cutoffDate = new Date(now);
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case '1year':
          cutoffDate = new Date(now);
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      // Delete payments
      let paymentsQuery = collection(db, 'payments');
      const paymentsSnapshot = await getDocs(paymentsQuery);
      const paymentsBatch = writeBatch(db);
      
      paymentsSnapshot.forEach(document => {
        const payment = document.data();
        const paymentDate = payment.createdAt?.toDate();
        
        if (!cutoffDate || (paymentDate && paymentDate >= cutoffDate)) {
          paymentsBatch.delete(document.ref);
        }
      });
      
      // Delete quests
      let questsQuery = collection(db, 'quests');
      const questsSnapshot = await getDocs(questsQuery);
      const questsBatch = writeBatch(db);
      
      questsSnapshot.forEach(document => {
        const quest = document.data();
        const questDate = quest.createdAt?.toDate();
        
        if (!cutoffDate || (questDate && questDate >= cutoffDate)) {
          if (quest.paymentStatus === 'paid' || quest.paymentStatus === 'pending_verification') {
            questsBatch.delete(document.ref);
          }
        }
      });
      
      // Delete work proofs
      let workProofsQuery = collection(db, 'work_proofs');
      const workProofsSnapshot = await getDocs(workProofsQuery);
      const workProofsBatch = writeBatch(db);
      
      workProofsSnapshot.forEach(document => {
        const proof = document.data();
        const proofDate = proof.createdAt?.toDate();
        
        if (!cutoffDate || (proofDate && proofDate >= cutoffDate)) {
          workProofsBatch.delete(document.ref);
        }
      });
      
      await paymentsBatch.commit();
      await questsBatch.commit();
      await workProofsBatch.commit();
      
      // Reset user balances if needed
      if (period === 'now' && !keepGraphData) {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersBatch = writeBatch(db);
        
        usersSnapshot.forEach(document => {
          usersBatch.update(document.ref, {
            balance: 0,
            pendingBalance: 0,
            updatedAt: serverTimestamp()
          });
        });
        
        await usersBatch.commit();
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error resetting revenue data:", error);
      return { success: false, error: error.message };
    }
  }
};

// =============================================
// 🤖 AI CHAT SERVICES (MIGRATED FROM index.html)
// =============================================
export const aiService = {
  // DeX 75 AI API
  chatWithDex75: async (message) => {
    try {
      const encodedMessage = encodeURIComponent(message);
      const apiUrl = `https://api.ryzumi.vip/api/ai/deepseek?text=${encodedMessage}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const resultText = data.data?.result || data.answer || data.data?.answer || "Tidak ada respons dari DeX 75 AI.";
        return { success: true, response: resultText };
      } else {
        const errorText = await response.text();
        return { success: false, error: `HTTP Error ${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.error("Error with DeX 75 AI:", error);
      return { success: false, error: `Network Error: ${error.message}` };
    }
  },

  // Pollination AI API
  chatWithPollination: async (message) => {
    try {
      const encodedMessage = encodeURIComponent(message);
      const apiUrl = `https://api.ryzumi.vip/api/ai/v2/chatgpt?text=${encodedMessage}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        let resultText = data.data?.result || 
                        data.data?.answer || 
                        data.answer || 
                        data.result ||
                        data.data?.text ||
                        data.text ||
                        data.data?.message ||
                        data.message ||
                        "Tidak ada respons dari Pollination AI.";
        
        if (!resultText || resultText === "Tidak ada respons dari Pollination AI.") {
          resultText = "Pollination AI merespons dengan struktur yang tidak dikenali. Silakan coba lagi.";
        }
        
        return { success: true, response: resultText };
      } else {
        const errorText = await response.text();
        return { success: false, error: `HTTP Error ${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.error("Error with Pollination AI:", error);
      return { success: false, error: `Network Error: ${error.message}` };
    }
  },

  // Generic chat function
  chat: async (message, model = 'dex75') => {
    if (model === 'dex75') {
      return await aiService.chatWithDex75(message);
    } else if (model === 'pollination') {
      return await aiService.chatWithPollination(message);
    } else {
      return { success: false, error: "Model AI tidak dikenali" };
    }
  }
};

// =============================================
// 🛠️ TOOLS SERVICES (MIGRATED FROM index.html)
// =============================================
export const toolsService = {
  // WHOIS & Domain Info Check
  checkDomain: async (domain) => {
    try {
      // Clean domain input
      let cleanDomain = domain.trim().toLowerCase();
      cleanDomain = cleanDomain.replace(/^https?:\/\//, '').split('/')[0];
      
      const parts = cleanDomain.split('.');
      if (parts.length > 2) {
        cleanDomain = parts.slice(-2).join('.');
      }
      
      if (!cleanDomain.includes('.') || cleanDomain.length < 4) {
        return { success: false, error: "Format domain salah (cth: google.com)" };
      }
      
      // Check using Google DNS over HTTPS
      const response = await fetch(`https://dns.google/resolve?name=${cleanDomain}`);
      
      if (!response.ok) {
        throw new Error("Gagal menghubungi Google DNS");
      }
      
      const data = await response.json();
      
      if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
        const ipAddress = data.Answer.find(a => a.type === 1)?.data || 'Tidak ada IP (Mungkin CNAME)';
        const ttl = data.Answer.length > 0 ? data.Answer[0].TTL : '-';
        
        return {
          success: true,
          registered: true,
          domain: cleanDomain,
          ipAddress,
          ttl,
          message: "DOMAIN TERDAFTAR"
        };
      } else if (data.Status === 3) {
        return {
          success: true,
          registered: false,
          domain: cleanDomain,
          message: "DOMAIN KOSONG!"
        };
      } else {
        return {
          success: false,
          error: "Respon DNS tidak valid."
        };
      }
      
    } catch (error) {
      console.error("DNS/Network Error:", error);
      return { 
        success: false, 
        error: `Gagal Melakukan Cek DNS: ${error.message}` 
      };
    }
  },

  // QRIS Information (Rekber System)
  getQRISInfo: () => {
    return {
      qrisUrl: "https://files.catbox.moe/f1h9md.png",
      description: "QRIS untuk sistem rekber aman dengan catbox.moe",
      systemInfo: "Sistem rekber: Bayar dulu → Quest tampil → Kerjakan → Kirim bukti → Terima bayaran"
    };
  }
};

// =============================================
// 🔔 NOTIFICATION SERVICES (MIGRATED FROM index.html)
// =============================================
export const notificationService = {
  // Default notification settings
  defaultSettings: {
    browser: true,
    sound: true,
    quest: true,
    payment: true,
    marker: true
  },

  // Save notification settings to localStorage
  saveSettings: (settings) => {
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(settings));
      return { success: true };
    } catch (error) {
      console.error("Error saving notification settings:", error);
      return { success: false, error: error.message };
    }
  },

  // Load notification settings from localStorage
  loadSettings: () => {
    try {
      const settings = localStorage.getItem('notificationSettings');
      if (settings) {
        return { success: true, settings: JSON.parse(settings) };
      } else {
        return { success: true, settings: notificationService.defaultSettings };
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
      return { success: false, error: error.message };
    }
  },

  // Request browser notification permission
  requestPermission: () => {
    if ("Notification" in window && Notification.permission === "default") {
      return Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          localStorage.setItem('notificationPermission', 'granted');
          return { success: true, permission: 'granted' };
        }
        return { success: false, permission };
      });
    }
    return Promise.resolve({ success: false, permission: Notification.permission });
  },

  // Create notification
  createNotification: async (notificationData) => {
    try {
      const { db } = getFirebaseServices();
      const notificationId = 'notif_' + Date.now();
      
      await setDoc(doc(db, 'notifications', notificationId), {
        id: notificationId,
        ...notificationData,
        read: false,
        createdAt: serverTimestamp()
      });
      
      return { success: true, notificationId };
    } catch (error) {
      console.error("Error creating notification:", error);
      return { success: false, error: error.message };
    }
  },

  // Get user notifications
  getUserNotifications: async (userId, limitCount = 20) => {
    try {
      const { db } = getFirebaseServices();
      
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(notificationsQuery);
      const notifications = [];
      
      snapshot.forEach(doc => {
        notifications.push(doc.data());
      });
      
      return { success: true, notifications };
    } catch (error) {
      console.error("Error getting notifications:", error);
      return { success: false, error: error.message };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const { db } = getFirebaseServices();
      
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        readAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return { success: false, error: error.message };
    }
  }
};

// =============================================
// 📞 WHATSAPP SERVICES (MIGRATED FROM index.html)
// =============================================
export const whatsappService = {
  // Admin WhatsApp number
  ADMIN_NUMBER: "6285811258873",

  // Generate WhatsApp URL
  generateWhatsAppUrl: (phoneNumber, message) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  },

  // Open WhatsApp chat for quest
  openQuestChat: (questTitle = 'Quest') => {
    const message = `Halo, saya tertarik dengan quest "${questTitle}" di Simple Bisnis. Bisa kita diskusikan lebih lanjut?`;
    return whatsappService.generateWhatsAppUrl(whatsappService.ADMIN_NUMBER, message);
  },

  // Open WhatsApp chat for general inquiry
  openGeneralChat: () => {
    const message = "Halo, saya butuh bantuan terkait akun Simple Bisnis.";
    return whatsappService.generateWhatsAppUrl(whatsappService.ADMIN_NUMBER, message);
  },

  // Open WhatsApp chat for payment issue
  openPaymentChat: () => {
    const message = "Halo, saya mengalami masalah dengan pembayaran di Simple Bisnis.";
    return whatsappService.generateWhatsAppUrl(whatsappService.ADMIN_NUMBER, message);
  }
};

// =============================================
// 🛠️ UTILITY FUNCTIONS (MIGRATED FROM index.html)
// =============================================
export const utils = {
  // Format number with thousands separator
  formatNumber: (num) => {
    if (typeof num !== 'number') num = parseFloat(num) || 0;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  },

  // Convert file to base64
  convertToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },

  // Generate unique ID
  generateId: (prefix = 'id') => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Calculate admin fee (5%)
  calculateAdminFee: (amount) => {
    return Math.floor(amount * 0.05);
  },

  // Calculate total amount with fee
  calculateTotalAmount: (amount) => {
    const fee = utils.calculateAdminFee(amount);
    return amount + fee;
  },

  // Show notification (UI)
  showNotification: (message, type = 'info') => {
    // This would be implemented in the UI component
    console.log(`[${type.toUpperCase()}] ${message}`);
    return { message, type, timestamp: new Date().toISOString() };
  }
};

// =============================================
// 📊 EXPORT DATA SERVICES (MIGRATED FROM index.html)
// =============================================
export const exportService = {
  // Export user data to CSV
  exportUsersToCSV: async () => {
    try {
      const { users } = await adminService.getAllUsers();
      
      if (users.length === 0) {
        return { success: false, error: "Tidak ada data user" };
      }
      
      const headers = Object.keys(users[0]);
      const csvRows = [];
      
      csvRows.push(headers.join(','));
      
      for (const user of users) {
        const values = headers.map(header => {
          const value = user[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return `"${value.toString().replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      }
      
      const csv = csvRows.join('\n');
      return { success: true, csv, filename: 'users_export.csv' };
    } catch (error) {
      console.error("Error exporting user data:", error);
      return { success: false, error: error.message };
    }
  },

  // Export quest data to CSV
  exportQuestsToCSV: async () => {
    try {
      const { quests } = await questService.getAllQuests();
      
      if (quests.length === 0) {
        return { success: false, error: "Tidak ada data quest" };
      }
      
      const headers = Object.keys(quests[0]);
      const csvRows = [];
      
      csvRows.push(headers.join(','));
      
      for (const quest of quests) {
        const values = headers.map(header => {
          const value = quest[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return `"${value.toString().replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      }
      
      const csv = csvRows.join('\n');
      return { success: true, csv, filename: 'quests_export.csv' };
    } catch (error) {
      console.error("Error exporting quest data:", error);
      return { success: false, error: error.message };
    }
  },

  // Export marker data to CSV
  exportMarkersToCSV: async () => {
    try {
      const { markers } = await mapService.getAllMarkers();
      
      if (markers.length === 0) {
        return { success: false, error: "Tidak ada data marker" };
      }
      
      const headers = Object.keys(markers[0]);
      const csvRows = [];
      
      csvRows.push(headers.join(','));
      
      for (const marker of markers) {
        const values = headers.map(header => {
          const value = marker[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return `"${value.toString().replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      }
      
      const csv = csvRows.join('\n');
      return { success: true, csv, filename: 'markers_export.csv' };
    } catch (error) {
      console.error("Error exporting marker data:", error);
      return { success: false, error: error.message };
    }
  },

  // Export payment data to CSV
  exportPaymentsToCSV: async () => {
    try {
      const { db } = getFirebaseServices();
      const snapshot = await getDocs(collection(db, 'payments'));
      const payments = [];
      
      snapshot.forEach(doc => {
        payments.push(doc.data());
      });
      
      if (payments.length === 0) {
        return { success: false, error: "Tidak ada data payment" };
      }
      
      const headers = Object.keys(payments[0]);
      const csvRows = [];
      
      csvRows.push(headers.join(','));
      
      for (const payment of payments) {
        const values = headers.map(header => {
          const value = payment[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return `"${value.toString().replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      }
      
      const csv = csvRows.join('\n');
      return { success: true, csv, filename: 'payments_export.csv' };
    } catch (error) {
      console.error("Error exporting payment data:", error);
      return { success: false, error: error.message };
    }
  },

  // Download CSV file
  downloadCSV: (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
};

// =============================================
// 🎯 MAIN EXPORT (ALL SERVICES)
// =============================================
const api = {
  // Firebase
  initializeFirebase,
  getFirebaseServices,
  
  // Services
  auth: authService,
  user: userService,
  map: mapService,
  quest: questService,
  payment: paymentService,
  workProof: workProofService,
  badge: badgeService,
  admin: adminService,
  ai: aiService,
  tools: toolsService,
  notification: notificationService,
  whatsapp: whatsappService,
  utils: utils,
  export: exportService,
  
  // Constants
  ADMIN_EMAILS,
  BADGES
};

export default api;

// Re-export individual functions for backward compatibility
export const convertToBase64 = utils.convertToBase64;
export const formatNumber = utils.formatNumber;
