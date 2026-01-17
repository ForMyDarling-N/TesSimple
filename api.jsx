// api.jsx
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// =============================================
// 🔥 FIREBASE CONFIGURATION
// =============================================
const firebaseConfig = {
  apiKey: "AIzaSyA5b7KYCxC8WuYkvdYGIi1z6t84gGc-MxA",
  authDomain: "simple-bisnisbrengsekbgt.firebaseapp.com",
  projectId: "simple-bisnisbrengsekbgt",
  storageBucket: "simple-bisnisbrengsekbgt.firebasestorage.app",
  messagingSenderId: "261716836340",
  appId: "1:261716836340:web:b2591092aebc9d3e5983a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

// =============================================
// 🔐 AUTHENTICATION FUNCTIONS
// =============================================

// Google Login Function (FIXED)
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    const result = await signInWithPopup(auth, provider);
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    
    if (!userDoc.exists()) {
      // Create new user document
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName || result.user.email?.split('@')[0] || 'User',
        phone: result.user.phoneNumber || '',
        region: 'Indonesia',
        role: 'user',
        verified: false,
        badges: ['newbie'],
        reputation: 'newbie',
        rating: 0,
        balance: 0,
        pendingBalance: 0,
        photoURL: result.user.photoURL || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        stats: {
          totalQuests: 0,
          completedQuests: 0,
          activeQuests: 0,
          failedQuests: 0
        }
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userData);
    }
    
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

// Email/Password Login
export const loginWithEmailPassword = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error) {
    throw error;
  }
};

// Email/Password Register
export const registerWithEmailPassword = async (userData) => {
  try {
    const { email, password, name, phone, region, role, initialBadge = 'newbie' } = userData;
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    const userProfile = {
      uid: result.user.uid,
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
    
    await setDoc(doc(db, 'users', result.user.uid), userProfile);
    
    return { success: true, user: result.user };
  } catch (error) {
    throw error;
  }
};

// Reset Password Function (Via Email)
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: 'Reset password email sent successfully' };
  } catch (error) {
    throw error;
  }
};

// Update Password
export const updateUserPassword = async (newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    
    await updatePassword(user, newPassword);
    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    throw error;
  }
};

// Auth State Listener
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// =============================================
// 📱 NOTIFICATION FUNCTIONS
// =============================================

// Request Notification Permission
export const requestNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return { success: false, message: 'Browser tidak mendukung notifikasi' };
    }
    
    if (Notification.permission === 'granted') {
      console.log('Notification permission already granted');
      return { success: true, permission: 'granted' };
    }
    
    if (Notification.permission === 'denied') {
      console.log('Notification permission denied');
      return { success: false, permission: 'denied' };
    }
    
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY_HERE' // Ganti dengan VAPID key Anda
      });
      
      if (token) {
        // Save token to Firestore
        const user = auth.currentUser;
        if (user) {
          await updateDoc(doc(db, 'users', user.uid), {
            fcmToken: token,
            updatedAt: serverTimestamp()
          });
        }
      }
      
      return { success: true, permission: 'granted', token };
    } else {
      return { success: false, permission: permission };
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
};

// Handle Foreground Messages
export const setupForegroundNotifications = () => {
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    
    if (Notification.permission === 'granted') {
      const notificationTitle = payload.notification?.title || 'New Notification';
      const notificationOptions = {
        body: payload.notification?.body || 'You have a new message',
        icon: '/icon.png',
        badge: '/badge.png'
      };
      
      new Notification(notificationTitle, notificationOptions);
    }
  });
};

// Send Notification to User
export const sendNotificationToUser = async (userId, title, message, type = 'info') => {
  try {
    const notificationData = {
      userId: userId,
      title: title,
      message: message,
      type: type,
      read: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await addDoc(collection(db, 'notifications'), notificationData);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// =============================================
// 🗺️ GEOLOCATION FUNCTIONS
// =============================================

// Get User Location
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

// Reverse Geocoding (Get Address from Coordinates)
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }
    
    const data = await response.json();
    return data.address;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

// =============================================
// 🗺️ MAP & MARKER FUNCTIONS
// =============================================

// Initialize Map (Leaflet)
export const initMap = (mapId, center = [-6.200000, 106.816666], zoom = 13) => {
  const L = window.L;
  if (!L) {
    console.error('Leaflet not loaded');
    return null;
  }
  
  const map = L.map(mapId).setView(center, zoom);
  
  // Add tile layers
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  
  return map;
};

// Add Marker to Map
export const addMarkerToMap = (map, latlng, title, category = 'default', options = {}) => {
  const L = window.L;
  if (!L || !map) return null;
  
  let iconColor = 'blue';
  let iconHtml = '<i class="fas fa-map-marker-alt"></i>';
  
  switch (category) {
    case 'traffic':
      iconColor = 'red';
      iconHtml = '<i class="fas fa-traffic-light"></i>';
      break;
    case 'accident':
      iconColor = 'orange';
      iconHtml = '<i class="fas fa-car-crash"></i>';
      break;
    case 'shop':
      iconColor = 'green';
      iconHtml = '<i class="fas fa-store"></i>';
      break;
    case 'service':
      iconColor = 'purple';
      iconHtml = '<i class="fas fa-tools"></i>';
      break;
    case 'event':
      iconColor = 'yellow';
      iconHtml = '<i class="fas fa-calendar"></i>';
      break;
  }
  
  const customIcon = L.divIcon({
    html: `
      <div style="
        background: ${iconColor};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border: 2px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
      ">
        ${iconHtml}
      </div>
    `,
    className: 'custom-marker-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });
  
  const marker = L.marker(latlng, { icon: customIcon, ...options }).addTo(map);
  return marker;
};

// Save Marker to Firestore
export const saveMarker = async (markerData) => {
  try {
    const markerId = 'marker_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const data = {
      id: markerId,
      ...markerData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(doc(db, 'markers', markerId), data);
    
    return { success: true, markerId: markerId };
  } catch (error) {
    console.error('Error saving marker:', error);
    throw error;
  }
};

// Get Markers by Category
export const getMarkersByCategory = async (category) => {
  try {
    let q;
    if (category === 'all') {
      q = query(collection(db, 'markers'));
    } else {
      q = query(collection(db, 'markers'), where('category', '==', category));
    }
    
    const snapshot = await getDocs(q);
    const markers = [];
    snapshot.forEach(doc => markers.push(doc.data()));
    
    return markers;
  } catch (error) {
    console.error('Error getting markers:', error);
    throw error;
  }
};

// Listen to Markers Changes
export const listenToMarkers = (callback) => {
  return onSnapshot(collection(db, 'markers'), (snapshot) => {
    const markers = [];
    snapshot.forEach(doc => markers.push(doc.data()));
    callback(markers);
  });
};

// =============================================
// 👷 WORKER & EMPLOYER FUNCTIONS
// =============================================

// Get User Profile
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update User Profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...profileData,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Get Workers by Rating
export const getWorkersByRating = async (minRating = 0, limit = 50) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('role', 'in', ['worker', 'both']),
      where('rating', '>=', minRating)
    );
    
    const snapshot = await getDocs(q);
    const workers = [];
    snapshot.forEach(doc => workers.push(doc.data()));
    
    // Sort by rating (descending)
    workers.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    return workers.slice(0, limit);
  } catch (error) {
    console.error('Error getting workers:', error);
    throw error;
  }
};

// Get Employers by Reputation
export const getEmployersByReputation = async (limit = 50) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('role', 'in', ['employer', 'both'])
    );
    
    const snapshot = await getDocs(q);
    const employers = [];
    snapshot.forEach(doc => employers.push(doc.data()));
    
    // Sort by number of posted quests (descending)
    employers.sort((a, b) => (b.stats?.totalQuests || 0) - (a.stats?.totalQuests || 0));
    
    return employers.slice(0, limit);
  } catch (error) {
    console.error('Error getting employers:', error);
    throw error;
  }
};

// =============================================
// 🎖️ BADGE SYSTEM FUNCTIONS
// =============================================

const BADGES = {
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

// Assign Badge to User
export const assignBadgeToUser = async (userId, badgeId, adminId = null) => {
  try {
    const badge = BADGES[badgeId];
    if (!badge) {
      throw new Error('Invalid badge ID');
    }
    
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const user = userDoc.data();
    const currentBadges = user.badges || [];
    
    // Check if user already has the badge
    if (currentBadges.includes(badgeId)) {
      throw new Error('User already has this badge');
    }
    
    // Check admin permission for admin-only badges
    if (badge.assignableBy === 'admin' && !adminId) {
      throw new Error('This badge can only be assigned by admin');
    }
    
    const newBadges = [...currentBadges, badgeId];
    
    await updateDoc(doc(db, 'users', userId), {
      badges: newBadges,
      updatedAt: serverTimestamp()
    });
    
    // Record badge assignment
    const assignmentId = 'badge_assign_' + Date.now();
    await setDoc(doc(db, 'badge_assignments', assignmentId), {
      id: assignmentId,
      userId: userId,
      badgeId: badgeId,
      assignedBy: adminId || 'system',
      assignedAt: serverTimestamp(),
      expiresAt: badge.duration === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : null
    });
    
    return { success: true, badge: badge };
  } catch (error) {
    console.error('Error assigning badge:', error);
    throw error;
  }
};

// Check Badge Requirements
export const checkBadgeEligibility = async (userId, badgeId) => {
  try {
    const badge = BADGES[badgeId];
    if (!badge) {
      throw new Error('Invalid badge ID');
    }
    
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const user = userDoc.data();
    
    // Check if user already has the badge
    if ((user.badges || []).includes(badgeId)) {
      return { eligible: false, reason: 'Already has badge' };
    }
    
    // Check requirements
    if (badge.requirements) {
      if (badge.requirements.type === 'quests_completed') {
        const completedQuests = user.stats?.completedQuests || 0;
        const rating = user.rating || 0;
        
        if (completedQuests < badge.requirements.count || rating < badge.requirements.rating) {
          return { 
            eligible: false, 
            reason: `Need ${badge.requirements.count} completed quests with rating ≥ ${badge.requirements.rating}`
          };
        }
      } else if (badge.requirements.type === 'quests_posted') {
        const postedQuests = user.stats?.totalQuests || 0;
        
        if (postedQuests < badge.requirements.count) {
          return { 
            eligible: false, 
            reason: `Need to post ${badge.requirements.count} quests`
          };
        }
      }
    }
    
    return { eligible: true };
  } catch (error) {
    console.error('Error checking badge eligibility:', error);
    throw error;
  }
};

// Get User Badges
export const getUserBadges = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const user = userDoc.data();
    const badgeIds = user.badges || [];
    
    const badges = badgeIds.map(badgeId => BADGES[badgeId]).filter(b => b);
    
    return badges;
  } catch (error) {
    console.error('Error getting user badges:', error);
    throw error;
  }
};

// =============================================
// 🎥 PROFILE BACKGROUND VIDEO HANDLER
// =============================================

// Upload Profile Video
export const uploadProfileVideo = async (userId, videoFile) => {
  try {
    const storageRef = ref(storage, `profile_videos/${userId}/${Date.now()}_${videoFile.name}`);
    
    const snapshot = await uploadBytes(storageRef, videoFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Update user profile with video URL
    await updateDoc(doc(db, 'users', userId), {
      profileVideoURL: downloadURL,
      updatedAt: serverTimestamp()
    });
    
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Error uploading profile video:', error);
    throw error;
  }
};

// Get Profile Video URL
export const getProfileVideoURL = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const user = userDoc.data();
      return user.profileVideoURL || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting profile video URL:', error);
    throw error;
  }
};

// =============================================
// 👑 ADMIN DYNAMIC API LOADER
// =============================================

// Load Admin Dynamic API
export const loadAdminDynamicAPI = async (apiName, apiConfig) => {
  try {
    const apiId = 'api_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const apiData = {
      id: apiId,
      name: apiName,
      config: apiConfig,
      enabled: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(doc(db, 'admin_apis', apiId), apiData);
    
    // Execute API based on type
    switch (apiConfig.type) {
      case 'webhook':
        await setupWebhookAPI(apiConfig);
        break;
      case 'cron':
        await setupCronAPI(apiConfig);
        break;
      case 'payment':
        await setupPaymentAPI(apiConfig);
        break;
      default:
        console.log(`API type ${apiConfig.type} loaded`);
    }
    
    return { success: true, apiId: apiId };
  } catch (error) {
    console.error('Error loading admin API:', error);
    throw error;
  }
};

// Setup Webhook API
const setupWebhookAPI = async (config) => {
  const { url, events, secret } = config;
  
  // Store webhook configuration
  await setDoc(doc(db, 'webhooks', 'current'), {
    url: url,
    events: events,
    secret: secret,
    updatedAt: serverTimestamp()
  });
  
  console.log('Webhook API loaded:', url);
};

// Setup Cron API
const setupCronAPI = async (config) => {
  const { schedule, endpoint, method = 'POST', data = {} } = config;
  
  // Store cron configuration
  await setDoc(doc(db, 'cron_jobs', 'current'), {
    schedule: schedule,
    endpoint: endpoint,
    method: method,
    data: data,
    updatedAt: serverTimestamp()
  });
  
  console.log('Cron API loaded:', schedule, endpoint);
};

// Setup Payment API
const setupPaymentAPI = async (config) => {
  const { provider, apiKey, callbackUrl } = config;
  
  // Store payment configuration
  await setDoc(doc(db, 'payment_configs', 'current'), {
    provider: provider,
    apiKey: apiKey,
    callbackUrl: callbackUrl,
    updatedAt: serverTimestamp()
  });
  
  console.log('Payment API loaded:', provider);
};

// Get Active APIs
export const getActiveAPIs = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'admin_apis'));
    const apis = [];
    snapshot.forEach(doc => apis.push(doc.data()));
    
    return apis;
  } catch (error) {
    console.error('Error getting active APIs:', error);
    throw error;
  }
};

// =============================================
// 💳 PAYMENT QRIS OTOMATIS (PAK KASIR)
// =============================================

const PAYMENT_API_KEY = 'EIXlvG2cqApi4lrNzvKVPE5A0OdHHpNb';

// Generate Auto QRIS
export const generateAutoQris = async (amount, description = 'Pembayaran Simple Bisnis') => {
  try {
    const paymentId = 'pay_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Call Pak Kasir API
    const response = await fetch('https://api.pakkasir.com/v1/qris/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAYMENT_API_KEY}`
      },
      body: JSON.stringify({
        external_id: paymentId,
        amount: amount,
        description: description,
        callback_url: 'https://simplebisnis.com/api/payment/callback'
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate QRIS');
    }
    
    const data = await response.json();
    
    // Save payment record
    await setDoc(doc(db, 'payments', paymentId), {
      id: paymentId,
      amount: amount,
      description: description,
      status: 'pending',
      qrisUrl: data.qris_url,
      qrisString: data.qris_string,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      paymentId: paymentId,
      qrisUrl: data.qris_url,
      qrisString: data.qris_string,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  } catch (error) {
    console.error('Error generating QRIS:', error);
    throw error;
  }
};

// Check Payment Status
export const checkPaymentStatus = async (paymentId) => {
  try {
    const response = await fetch(`https://api.pakkasir.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYMENT_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }
    
    const data = await response.json();
    
    // Update payment record
    await updateDoc(doc(db, 'payments', paymentId), {
      status: data.status,
      updatedAt: serverTimestamp()
    });
    
    return data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

// Listen to Payment Status Changes
export const listenPaymentStatus = (paymentId, callback) => {
  return onSnapshot(doc(db, 'payments', paymentId), (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

// Process Payment Callback
export const processPaymentCallback = async (callbackData) => {
  try {
    const { payment_id, status, amount, timestamp } = callbackData;
    
    // Verify callback signature
    const isVerified = verifyCallbackSignature(callbackData);
    if (!isVerified) {
      throw new Error('Invalid callback signature');
    }
    
    const paymentDoc = await getDoc(doc(db, 'payments', payment_id));
    if (!paymentDoc.exists()) {
      throw new Error('Payment not found');
    }
    
    const payment = paymentDoc.data();
    
    if (status === 'PAID' && payment.status === 'pending') {
      // Update payment status
      await updateDoc(doc(db, 'payments', payment_id), {
        status: 'paid',
        paidAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Process payment success
      await processPaymentSuccess(payment_id, payment);
      
      return { success: true, message: 'Payment processed successfully' };
    }
    
    return { success: false, message: 'Payment not completed' };
  } catch (error) {
    console.error('Error processing payment callback:', error);
    throw error;
  }
};

// Verify Callback Signature
const verifyCallbackSignature = (callbackData) => {
  // Implement signature verification
  // This is a simplified version - implement proper signature verification
  const { signature, ...data } = callbackData;
  return true; // Replace with actual verification
};

// Process Payment Success
const processPaymentSuccess = async (paymentId, payment) => {
  try {
    // Find associated transaction (quest, badge purchase, etc.)
    const transactionQuery = query(
      collection(db, 'transactions'),
      where('paymentId', '==', paymentId)
    );
    
    const snapshot = await getDocs(transactionQuery);
    
    if (!snapshot.empty) {
      const transactionDoc = snapshot.docs[0];
      const transaction = transactionDoc.data();
      
      // Update transaction status
      await updateDoc(doc(db, 'transactions', transaction.id), {
        status: 'completed',
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Process based on transaction type
      switch (transaction.type) {
        case 'badge_purchase':
          await processBadgePurchase(transaction);
          break;
        case 'quest_payment':
          await processQuestPayment(transaction);
          break;
        case 'withdrawal':
          await processWithdrawal(transaction);
          break;
      }
    }
    
    // Send notification
    if (payment.userId) {
      await sendNotificationToUser(
        payment.userId,
        'Pembayaran Berhasil',
        `Pembayaran sebesar Rp ${payment.amount.toLocaleString('id-ID')} berhasil diterima.`,
        'success'
      );
    }
    
  } catch (error) {
    console.error('Error processing payment success:', error);
    throw error;
  }
};

// Process Badge Purchase
const processBadgePurchase = async (transaction) => {
  const { userId, badgeId } = transaction;
  
  // Assign badge to user
  await assignBadgeToUser(userId, badgeId);
  
  // Update user balance if needed
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    const user = userDoc.data();
    const badge = BADGES[badgeId];
    
    if (badge && badge.price > 0) {
      const newBalance = (user.balance || 0) - badge.price;
      await updateDoc(doc(db, 'users', userId), {
        balance: newBalance,
        updatedAt: serverTimestamp()
      });
    }
  }
};

// Process Quest Payment
const processQuestPayment = async (transaction) => {
  const { questId } = transaction;
  
  // Update quest payment status
  await updateDoc(doc(db, 'quests', questId), {
    paymentStatus: 'paid',
    status: 'open',
    updatedAt: serverTimestamp()
  });
};

// Process Withdrawal
const processWithdrawal = async (transaction) => {
  const { userId, amount } = transaction;
  
  // Update user balance
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    const user = userDoc.data();
    const newBalance = (user.balance || 0) - amount;
    
    await updateDoc(doc(db, 'users', userId), {
      balance: newBalance,
      updatedAt: serverTimestamp()
    });
  }
  
  // Record withdrawal
  await setDoc(doc(db, 'withdrawals', transaction.id), {
    ...transaction,
    processedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

// =============================================
// 🗃️ DATA MANAGEMENT FUNCTIONS
// =============================================

// Export Data to CSV
export const exportDataToCSV = async (collectionName, filters = {}) => {
  try {
    let q = query(collection(db, collectionName));
    
    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        q = query(q, where(key, '==', filters[key]));
      }
    });
    
    const snapshot = await getDocs(q);
    const data = [];
    snapshot.forEach(doc => data.push(doc.data()));
    
    // Convert to CSV
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return `"${value.toString().replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

// Bulk Delete Data
export const bulkDeleteData = async (collectionName, ids) => {
  try {
    const batch = writeBatch(db);
    
    ids.forEach(id => {
      const docRef = doc(db, collectionName, id);
      batch.delete(docRef);
    });
    
    await batch.commit();
    return { success: true, deletedCount: ids.length };
  } catch (error) {
    console.error('Error bulk deleting data:', error);
    throw error;
  }
};

// =============================================
// 🎯 QUEST MANAGEMENT FUNCTIONS
// =============================================

// Create Quest
export const createQuest = async (questData) => {
  try {
    const questId = 'quest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const data = {
      id: questId,
      ...questData,
      status: 'pending_payment',
      paymentStatus: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(doc(db, 'quests', questId), data);
    
    return { success: true, questId: questId };
  } catch (error) {
    console.error('Error creating quest:', error);
    throw error;
  }
};

// Update Quest Status
export const updateQuestStatus = async (questId, status, workerId = null) => {
  try {
    const updateData = {
      status: status,
      updatedAt: serverTimestamp()
    };
    
    if (workerId) {
      updateData.workerId = workerId;
      updateData.workerName = await getUsername(workerId);
      updateData.takenAt = serverTimestamp();
    }
    
    await updateDoc(doc(db, 'quests', questId), updateData);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating quest status:', error);
    throw error;
  }
};

// Get Quests by Status
export const getQuestsByStatus = async (status, limit = 50) => {
  try {
    const q = query(
      collection(db, 'quests'),
      where('status', '==', status),
      where('paymentStatus', '==', 'paid')
    );
    
    const snapshot = await getDocs(q);
    const quests = [];
    snapshot.forEach(doc => quests.push(doc.data()));
    
    quests.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    
    return quests.slice(0, limit);
  } catch (error) {
    console.error('Error getting quests:', error);
    throw error;
  }
};

// Get Username Helper
const getUsername = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().name || 'Unknown User';
    }
    return 'Unknown User';
  } catch (error) {
    return 'Unknown User';
  }
};

// =============================================
// 📊 STATISTICS FUNCTIONS
// =============================================

// Get Platform Statistics
export const getPlatformStatistics = async () => {
  try {
    // Get counts
    const [
      usersSnapshot,
      questsSnapshot,
      markersSnapshot,
      paymentsSnapshot
    ] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'quests')),
      getDocs(collection(db, 'markers')),
      getDocs(collection(db, 'payments'))
    ]);
    
    const totalUsers = usersSnapshot.size;
    const totalQuests = questsSnapshot.size;
    const totalMarkers = markersSnapshot.size;
    
    // Calculate revenue
    let totalRevenue = 0;
    let pendingRevenue = 0;
    paymentsSnapshot.forEach(doc => {
      const payment = doc.data();
      if (payment.status === 'paid') {
        totalRevenue += payment.amount || 0;
      } else if (payment.status === 'pending') {
        pendingRevenue += payment.amount || 0;
      }
    });
    
    // Calculate active quests
    let openQuests = 0;
    let takenQuests = 0;
    questsSnapshot.forEach(doc => {
      const quest = doc.data();
      if (quest.status === 'open') openQuests++;
      if (quest.status === 'taken') takenQuests++;
    });
    
    // Calculate today's markers
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayMarkers = 0;
    markersSnapshot.forEach(doc => {
      const marker = doc.data();
      const markerDate = marker.createdAt?.toDate();
      if (markerDate && markerDate >= today) todayMarkers++;
    });
    
    return {
      totalUsers,
      totalQuests,
      totalMarkers,
      totalRevenue,
      pendingRevenue,
      openQuests,
      takenQuests,
      todayMarkers,
      adminFee: totalRevenue * 0.05 // 5% admin fee
    };
  } catch (error) {
    console.error('Error getting platform statistics:', error);
    throw error;
  }
};

// =============================================
// 🚨 EMERGENCY FUNCTIONS
// =============================================

// Reset System Data
export const resetSystemData = async (period = 'now', keepGraphData = true) => {
  try {
    let cutoffDate = null;
    const now = new Date();
    
    switch (period) {
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
    
    // Reset payments
    let paymentsQuery = query(collection(db, 'payments'));
    if (cutoffDate) {
      paymentsQuery = query(paymentsQuery, where('createdAt', '>=', cutoffDate));
    }
    
    const paymentsSnapshot = await getDocs(paymentsQuery);
    const paymentsBatch = writeBatch(db);
    paymentsSnapshot.forEach(doc => {
      paymentsBatch.delete(doc.ref);
    });
    
    // Reset quests
    let questsQuery = query(collection(db, 'quests'));
    if (cutoffDate) {
      questsQuery = query(questsQuery, where('createdAt', '>=', cutoffDate));
    }
    
    const questsSnapshot = await getDocs(questsQuery);
    const questsBatch = writeBatch(db);
    questsSnapshot.forEach(doc => {
      const quest = doc.data();
      if (quest.paymentStatus === 'paid' || quest.paymentStatus === 'pending_verification') {
        questsBatch.delete(doc.ref);
      }
    });
    
    // Reset markers
    let markersQuery = query(collection(db, 'markers'));
    if (cutoffDate) {
      markersQuery = query(markersQuery, where('createdAt', '>=', cutoffDate));
    }
    
    const markersSnapshot = await getDocs(markersQuery);
    const markersBatch = writeBatch(db);
    markersSnapshot.forEach(doc => {
      markersBatch.delete(doc.ref);
    });
    
    // Execute batches
    await Promise.all([
      paymentsBatch.commit(),
      questsBatch.commit(),
      markersBatch.commit()
    ]);
    
    // Reset user balances if needed
    if (period === 'now' && !keepGraphData) {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersBatch = writeBatch(db);
      
      usersSnapshot.forEach(doc => {
        const userRef = doc.ref;
        usersBatch.update(userRef, {
          balance: 0,
          pendingBalance: 0,
          updatedAt: serverTimestamp()
        });
      });
      
      await usersBatch.commit();
    }
    
    return { 
      success: true, 
      message: `System data reset for ${period} period`,
      resetCount: {
        payments: paymentsSnapshot.size,
        quests: questsSnapshot.size,
        markers: markersSnapshot.size
      }
    };
  } catch (error) {
    console.error('Error resetting system data:', error);
    throw error;
  }
};

// =============================================
// 📦 EXPORT ALL FUNCTIONS
// =============================================

export {
  auth,
  db,
  storage,
  messaging
};

export default {
  // Auth
  loginWithGoogle,
  loginWithEmailPassword,
  registerWithEmailPassword,
  resetPassword,
  updateUserPassword,
  onAuthStateChange,
  
  // Notification
  requestNotificationPermission,
  setupForegroundNotifications,
  sendNotificationToUser,
  
  // Geolocation
  getUserLocation,
  reverseGeocode,
  
  // Map & Marker
  initMap,
  addMarkerToMap,
  saveMarker,
  getMarkersByCategory,
  listenToMarkers,
  
  // User Management
  getUserProfile,
  updateUserProfile,
  getWorkersByRating,
  getEmployersByReputation,
  
  // Badge System
  assignBadgeToUser,
  checkBadgeEligibility,
  getUserBadges,
  
  // Profile Media
  uploadProfileVideo,
  getProfileVideoURL,
  
  // Admin API
  loadAdminDynamicAPI,
  getActiveAPIs,
  
  // Payment
  generateAutoQris,
  checkPaymentStatus,
  listenPaymentStatus,
  processPaymentCallback,
  
  // Data Management
  exportDataToCSV,
  bulkDeleteData,
  
  // Quest Management
  createQuest,
  updateQuestStatus,
  getQuestsByStatus,
  
  // Statistics
  getPlatformStatistics,
  
  // Emergency
  resetSystemData,
  
  // Firebase instances
  auth,
  db,
  storage,
  messaging
};
