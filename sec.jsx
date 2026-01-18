// sec.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  auth, 
  db, 
  storage, 
  messaging,
  loginWithGoogle,
  loginWithEmailPassword,
  registerWithEmailPassword,
  resetPassword,
  updateUserPassword,
  onAuthStateChange,
  requestNotificationPermission,
  setupForegroundNotifications,
  sendNotificationToUser,
  getUserLocation,
  reverseGeocode,
  initMap,
  addMarkerToMap,
  saveMarker,
  getMarkersByCategory,
  listenToMarkers,
  getUserProfile,
  updateUserProfile,
  getWorkersByRating,
  getEmployersByReputation,
  assignBadgeToUser,
  checkBadgeEligibility,
  getUserBadges,
  uploadProfileVideo,
  getProfileVideoURL,
  loadAdminDynamicAPI,
  getActiveAPIs,
  generateAutoQris,
  checkPaymentStatus,
  listenPaymentStatus,
  processPaymentCallback,
  exportDataToCSV,
  bulkDeleteData,
  createQuest,
  updateQuestStatus,
  getQuestsByStatus,
  getPlatformStatistics,
  resetSystemData
} from './api.jsx';
import { 
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
  getDocs, 
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

const Sec = () => {
  // =============================================
  // 🏗️ STATE MANAGEMENT
  // =============================================
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isKasir, setIsKasir] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Feed State
  const [feedPosts, setFeedPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Pojok Mahasiswa State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeAPIs, setActiveAPIs] = useState([]);
  
  // Worker/Employer State
  const [workers, setWorkers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [activeQuests, setActiveQuests] = useState([]);
  const [myQuests, setMyQuests] = useState([]);
  
  // Map State
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [newMarker, setNewMarker] = useState({
    title: '',
    description: '',
    category: 'traffic',
    photo: null,
    video: null
  });
  
  // Profile State
  const [activeBadge, setActiveBadge] = useState(null);
  const [profileBackgrounds, setProfileBackgrounds] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState('feed');
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState('login');
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Refs
  const mapRef = useRef(null);
  const videoRef = useRef(null);

  // =============================================
  // 🚀 INITIALIZATION
  // =============================================
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check authentication state
      const unsubscribe = onAuthStateChange(async (user) => {
        if (user) {
          setCurrentUser(user);
          
          // Load user profile
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          
          // Check admin status
          const isAdminUser = profile?.role === 'admin' || profile?.role === 'owner';
          const isOwnerUser = profile?.role === 'owner';
          const isKasirUser = profile?.role === 'kasir';
          
          setIsAdmin(isAdminUser);
          setIsOwner(isOwnerUser);
          setIsKasir(isKasirUser);
          
          // Load user-specific data
          loadUserData(user.uid);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
        
        setLoading(false);
      });

      // Request permissions
      await requestPermissions();
      
      // Setup notifications
      setupForegroundNotifications();
      
      // Load public data
      loadPublicData();
      
      return () => unsubscribe();
    } catch (error) {
      console.error('Initialization error:', error);
      setLoading(false);
    }
  };

  const requestPermissions = async () => {
    try {
      // Request notification permission
      await requestNotificationPermission();
      
      // Request location permission
      const location = await getUserLocation();
      setUserLocation(location);
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const loadPublicData = async () => {
    try {
      // Load active APIs
      const apis = await getActiveAPIs();
      setActiveAPIs(apis);
      
      // Load profile backgrounds
      loadProfileBackgrounds();
      
      // Load markers
      loadMapMarkers();
      
      // Load feed posts
      loadFeedPosts();
    } catch (error) {
      console.error('Error loading public data:', error);
    }
  };

  const loadUserData = async (userId) => {
    try {
      // Load user badges
      const badges = await getUserBadges(userId);
      if (badges.length > 0) {
        setActiveBadge(badges[0]);
      }
      
      // Load user quests
      loadUserQuests(userId);
      
      // Load workers/employers
      loadWorkersAndEmployers();
      
      // Load notifications
      loadNotifications(userId);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // =============================================
  // 📰 FEED HIPER (TWITTER-LIKE)
  // =============================================
  const loadFeedPosts = async () => {
    try {
      const q = query(
        collection(db, 'feed_posts'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const posts = [];
        snapshot.forEach(doc => {
          posts.push({ id: doc.id, ...doc.data() });
        });
        setFeedPosts(posts);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Error loading feed posts:', error);
    }
  };

  const createPost = async () => {
    if (!newPostContent.trim() || !currentUser) return;
    
    try {
      const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const postData = {
        id: postId,
        content: newPostContent,
        userId: currentUser.uid,
        userName: userProfile?.name || 'Anonymous',
        userPhoto: userProfile?.photoURL || '',
        upvotes: [],
        downvotes: [],
        comments: [],
        hoaxReports: [],
        isHoax: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'feed_posts', postId), postData);
      setNewPostContent('');
      
      // Send notification to followers
      await notifyFollowersAboutPost(postId);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const upvotePost = async (postId) => {
    if (!currentUser) return;
    
    try {
      const postRef = doc(db, 'feed_posts', postId);
      
      await updateDoc(postRef, {
        upvotes: arrayUnion(currentUser.uid),
        downvotes: arrayRemove(currentUser.uid),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

  const downvotePost = async (postId) => {
    if (!currentUser) return;
    
    try {
      const postRef = doc(db, 'feed_posts', postId);
      
      await updateDoc(postRef, {
        downvotes: arrayUnion(currentUser.uid),
        upvotes: arrayRemove(currentUser.uid),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error downvoting post:', error);
    }
  };

  const reportHoax = async (postId) => {
    if (!currentUser) return;
    
    try {
      const postRef = doc(db, 'feed_posts', postId);
      
      await updateDoc(postRef, {
        hoaxReports: arrayUnion(currentUser.uid),
        updatedAt: serverTimestamp()
      });
      
      // Check if post should be marked as hoax
      const postDoc = await getDoc(postRef);
      const post = postDoc.data();
      
      if (post.hoaxReports.length >= 5) {
        await updateDoc(postRef, {
          isHoax: true,
          updatedAt: serverTimestamp()
        });
        
        // Notify admin
        await notifyAdminAboutHoax(postId, post.userId);
      }
    } catch (error) {
      console.error('Error reporting hoax:', error);
    }
  };

  const addComment = async (postId, comment) => {
    if (!currentUser || !comment.trim()) return;
    
    try {
      const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const commentData = {
        id: commentId,
        postId: postId,
        userId: currentUser.uid,
        userName: userProfile?.name || 'Anonymous',
        content: comment,
        createdAt: serverTimestamp()
      };
      
      const postRef = doc(db, 'feed_posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion(commentData),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const notifyFollowersAboutPost = async (postId) => {
    // Get user's followers
    const followersQuery = query(
      collection(db, 'followers'),
      where('followingId', '==', currentUser.uid)
    );
    
    const snapshot = await getDocs(followersQuery);
    
    snapshot.forEach(async (doc) => {
      const follower = doc.data();
      await sendNotificationToUser(
        follower.followerId,
        'New Post',
        `${userProfile?.name || 'Someone'} posted something new`,
        'info'
      );
    });
  };

  const notifyAdminAboutHoax = async (postId, postUserId) => {
    // Find admin users
    const adminsQuery = query(
      collection(db, 'users'),
      where('role', 'in', ['admin', 'owner'])
    );
    
    const snapshot = await getDocs(adminsQuery);
    
    snapshot.forEach(async (doc) => {
      const admin = doc.data();
      await sendNotificationToUser(
        admin.uid,
        'Hoax Reported',
        `Post ${postId} has been reported as hoax by multiple users`,
        'warning'
      );
    });
  };

  // =============================================
  // 📚 POJOK MAHASISWA
  // =============================================
  const searchAcademic = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setSearchResults([]);
      
      // Use active APIs for search
      for (const api of activeAPIs) {
        if (api.enabled && api.config.type === 'academic_search') {
          const results = await searchWithAPI(api, searchQuery);
          setSearchResults(prev => [...prev, ...results]);
        }
      }
      
      // Default to Google Scholar if no APIs
      if (activeAPIs.length === 0) {
        const scholarResults = await searchGoogleScholar(searchQuery);
        setSearchResults(scholarResults);
      }
    } catch (error) {
      console.error('Error searching academic:', error);
    }
  };

  const searchWithAPI = async (api, query) => {
    try {
      const response = await fetch(api.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api.config.apiKey}`
        },
        body: JSON.stringify({ query: query })
      });
      
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error(`Error with API ${api.name}:`, error);
      return [];
    }
  };

  const searchGoogleScholar = async (query) => {
    // This is a simplified example - in production, use official API
    return [
      {
        title: `Research about ${query}`,
        authors: ['Author 1', 'Author 2'],
        journal: 'Journal Name',
        year: '2024',
        citations: 10,
        url: '#'
      }
    ];
  };

  const checkPlagiarism = async (text) => {
    try {
      // Find plagiarism API
      const plagiarismAPI = activeAPIs.find(api => 
        api.enabled && api.config.type === 'plagiarism_check'
      );
      
      if (plagiarismAPI) {
        const response = await fetch(plagiarismAPI.config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${plagiarismAPI.config.apiKey}`
          },
          body: JSON.stringify({ text: text })
        });
        
        if (!response.ok) throw new Error('Plagiarism check failed');
        
        const data = await response.json();
        return data;
      }
      
      // Default response if no API
      return {
        score: 0,
        matches: [],
        message: 'No plagiarism API configured'
      };
    } catch (error) {
      console.error('Error checking plagiarism:', error);
      return null;
    }
  };

  const addAcademicAPI = async (apiConfig) => {
    try {
      await loadAdminDynamicAPI(`Academic_${Date.now()}`, {
        type: 'academic_search',
        ...apiConfig
      });
      
      // Reload active APIs
      const apis = await getActiveAPIs();
      setActiveAPIs(apis);
    } catch (error) {
      console.error('Error adding academic API:', error);
    }
  };

  // =============================================
  // 👷 WORKER ↔ EMPLOYER SYSTEM
  // =============================================
  const loadWorkersAndEmployers = async () => {
    try {
      // Load workers
      const workersList = await getWorkersByRating(0, 50);
      setWorkers(workersList);
      
      // Load employers
      const employersList = await getEmployersByReputation(50);
      setEmployers(employersList);
    } catch (error) {
      console.error('Error loading workers/employers:', error);
    }
  };

  const loadUserQuests = async (userId) => {
    try {
      // Load quests where user is employer
      const employerQuery = query(
        collection(db, 'quests'),
        where('employerId', '==', userId)
      );
      
      // Load quests where user is worker
      const workerQuery = query(
        collection(db, 'quests'),
        where('workerId', '==', userId)
      );
      
      const [employerSnapshot, workerSnapshot] = await Promise.all([
        getDocs(employerQuery),
        getDocs(workerQuery)
      ]);
      
      const quests = [];
      
      employerSnapshot.forEach(doc => {
        quests.push({ id: doc.id, ...doc.data(), type: 'employer' });
      });
      
      workerSnapshot.forEach(doc => {
        quests.push({ id: doc.id, ...doc.data(), type: 'worker' });
      });
      
      setMyQuests(quests);
      
      // Load active quests
      const activeQuestQuery = query(
        collection(db, 'quests'),
        where('status', '==', 'open'),
        where('paymentStatus', '==', 'paid'),
        limit(20)
      );
      
      const activeSnapshot = await getDocs(activeQuestQuery);
      const activeQuestsList = [];
      activeSnapshot.forEach(doc => {
        activeQuestsList.push({ id: doc.id, ...doc.data() });
      });
      
      setActiveQuests(activeQuestsList);
    } catch (error) {
      console.error('Error loading quests:', error);
    }
  };

  const createQuest = async (questData) => {
    try {
      const result = await createQuest(questData);
      
      if (result.success) {
        // Generate WhatsApp link for worker
        const whatsappLink = generateWhatsAppLink(
          questData.workerPhone,
          `Halo, saya tertarik dengan quest "${questData.title}"`
        );
        
        // Store WhatsApp link
        await updateDoc(doc(db, 'quests', result.questId), {
          workerWhatsappLink: whatsappLink
        });
        
        return { success: true, questId: result.questId, whatsappLink };
      }
    } catch (error) {
      console.error('Error creating quest:', error);
      throw error;
    }
  };

  const takeQuest = async (questId) => {
    if (!currentUser || !userProfile) return;
    
    try {
      await updateQuestStatus(questId, 'taken', currentUser.uid);
      
      // Get quest details
      const questDoc = await getDoc(doc(db, 'quests', questId));
      const quest = questDoc.data();
      
      // Generate WhatsApp link for employer
      const whatsappLink = generateWhatsAppLink(
        quest.employerPhone,
        `Halo, saya telah mengambil quest "${quest.title}"`
      );
      
      // Store WhatsApp link
      await updateDoc(doc(db, 'quests', questId), {
        employerWhatsappLink: whatsappLink,
        workerPhone: userProfile.phone
      });
      
      return { success: true, whatsappLink };
    } catch (error) {
      console.error('Error taking quest:', error);
      throw error;
    }
  };

  const generateWhatsAppLink = (phoneNumber, message) => {
    if (!phoneNumber) return '#';
    
    // Ensure phone number starts with country code
    let formattedPhone = phoneNumber;
    if (!formattedPhone.startsWith('62')) {
      formattedPhone = '62' + formattedPhone.replace(/^0+/, '');
    }
    
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  };

  const completeQuest = async (questId, proof) => {
    try {
      const questRef = doc(db, 'quests', questId);
      
      await updateDoc(questRef, {
        status: 'completed',
        completedAt: serverTimestamp(),
        proof: proof,
        updatedAt: serverTimestamp()
      });
      
      // Update worker stats
      if (userProfile) {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          'stats.completedQuests': increment(1),
          updatedAt: serverTimestamp()
        });
      }
      
      // Process payment
      await processQuestPayment(questId);
    } catch (error) {
      console.error('Error completing quest:', error);
      throw error;
    }
  };

  const processQuestPayment = async (questId) => {
    try {
      const questDoc = await getDoc(doc(db, 'quests', questId));
      const quest = questDoc.data();
      
      if (!quest) throw new Error('Quest not found');
      
      // Transfer payment to worker
      const workerRef = doc(db, 'users', quest.workerId);
      const workerDoc = await getDoc(workerRef);
      const worker = workerDoc.data();
      
      const newBalance = (worker.balance || 0) + quest.budget;
      
      await updateDoc(workerRef, {
        balance: newBalance,
        updatedAt: serverTimestamp()
      });
      
      // Record transaction
      const transactionId = `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await setDoc(doc(db, 'transactions', transactionId), {
        id: transactionId,
        type: 'quest_payment',
        questId: questId,
        fromUserId: quest.employerId,
        toUserId: quest.workerId,
        amount: quest.budget,
        status: 'completed',
        createdAt: serverTimestamp()
      });
      
      // Send notifications
      await sendNotificationToUser(
        quest.workerId,
        'Payment Received',
        `You've received Rp ${quest.budget.toLocaleString('id-ID')} for completing "${quest.title}"`,
        'success'
      );
      
      await sendNotificationToUser(
        quest.employerId,
        'Quest Completed',
        `Your quest "${quest.title}" has been completed`,
        'info'
      );
    } catch (error) {
      console.error('Error processing quest payment:', error);
      throw error;
    }
  };

  // =============================================
  // 🗺️ MAP & MARKER SYSTEM
  // =============================================
  useEffect(() => {
    if (mapRef.current && !map) {
      initializeMap();
    }
  }, [mapRef.current, userLocation]);

  const initializeMap = () => {
    if (!mapRef.current) return;
    
    try {
      let center = [-6.200000, 106.816666]; // Default to Jakarta
      if (userLocation) {
        center = [userLocation.lat, userLocation.lng];
      }
      
      const newMap = initMap(mapRef.current, center, 13);
      setMap(newMap);
      
      // Add click event for adding markers
      newMap.on('click', (e) => {
        handleMapClick(e);
      });
      
      // Add current location marker
      if (userLocation) {
        addMarkerToMap(
          newMap,
          [userLocation.lat, userLocation.lng],
          'My Location',
          'current',
          { draggable: false }
        );
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const loadMapMarkers = async () => {
    try {
      const markersList = await getMarkersByCategory('all');
      setMarkers(markersList);
      
      // Add markers to map
      if (map) {
        markersList.forEach(marker => {
          addMarkerToMap(
            map,
            [marker.lat, marker.lng],
            marker.title,
            marker.category,
            {
              draggable: false,
              onClick: () => handleMarkerClick(marker)
            }
          );
        });
      }
    } catch (error) {
      console.error('Error loading markers:', error);
    }
  };

  const handleMapClick = (e) => {
    if (!currentUser) {
      alert('Please login to add markers');
      return;
    }
    
    setNewMarker(prev => ({
      ...prev,
      lat: e.latlng.lat,
      lng: e.latlng.lng
    }));
    
    // Show marker form
    setActiveTab('add-marker');
  };

  const handleMarkerClick = (marker) => {
    setSelectedPost(marker);
  };

  const submitMarker = async () => {
    if (!newMarker.title.trim() || !newMarker.lat || !newMarker.lng) {
      alert('Please fill all required fields');
      return;
    }
    
    try {
      const markerId = `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Upload media if exists
      let photoURL = null;
      let videoURL = null;
      
      if (newMarker.photo) {
        photoURL = await uploadMedia(newMarker.photo, 'marker_photos');
      }
      
      if (newMarker.video) {
        videoURL = await uploadMedia(newMarker.video, 'marker_videos');
      }
      
      // Get address from coordinates
      const address = await reverseGeocode(newMarker.lat, newMarker.lng);
      
      // Generate Google Maps and Waze links
      const googleMapsLink = `https://www.google.com/maps?q=${newMarker.lat},${newMarker.lng}`;
      const wazeLink = `https://waze.com/ul?ll=${newMarker.lat},${newMarker.lng}&navigate=yes`;
      
      const markerData = {
        id: markerId,
        title: newMarker.title,
        description: newMarker.description,
        category: newMarker.category,
        lat: newMarker.lat,
        lng: newMarker.lng,
        userId: currentUser.uid,
        userName: userProfile?.name || 'Anonymous',
        userPhoto: userProfile?.photoURL || '',
        photoURL: photoURL,
        videoURL: videoURL,
        address: address,
        googleMapsLink: googleMapsLink,
        wazeLink: wazeLink,
        upvotes: [],
        downvotes: [],
        comments: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await saveMarker(markerData);
      
      // Reset form
      setNewMarker({
        title: '',
        description: '',
        category: 'traffic',
        photo: null,
        video: null,
        lat: null,
        lng: null
      });
      
      // Reload markers
      loadMapMarkers();
      
      // Show success message
      alert('Marker added successfully!');
    } catch (error) {
      console.error('Error submitting marker:', error);
      alert('Error adding marker: ' + error.message);
    }
  };

  const uploadMedia = async (file, path) => {
    try {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  };

  const voteMarker = async (markerId, type) => {
    if (!currentUser) return;
    
    try {
      const markerRef = doc(db, 'markers', markerId);
      const field = type === 'up' ? 'upvotes' : 'downvotes';
      const oppositeField = type === 'up' ? 'downvotes' : 'upvotes';
      
      await updateDoc(markerRef, {
        [field]: arrayUnion(currentUser.uid),
        [oppositeField]: arrayRemove(currentUser.uid),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error voting marker:', error);
    }
  };

  // =============================================
  // 👤 PROFILE SYSTEM (MLBB STYLE)
  // =============================================
  const loadProfileBackgrounds = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'profile_backgrounds'));
      const backgrounds = [];
      querySnapshot.forEach(doc => {
        backgrounds.push({ id: doc.id, ...doc.data() });
      });
      
      backgrounds.sort((a, b) => a.price - b.price);
      setProfileBackgrounds(backgrounds);
      
      // Set user's current background
      if (userProfile?.backgroundId) {
        const currentBg = backgrounds.find(bg => bg.id === userProfile.backgroundId);
        setSelectedBackground(currentBg);
      }
    } catch (error) {
      console.error('Error loading profile backgrounds:', error);
    }
  };

  const updateProfile = async (updates) => {
    if (!currentUser) return;
    
    try {
      await updateUserProfile(currentUser.uid, updates);
      
      // Update local state
      setUserProfile(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const purchaseBackground = async (background) => {
    if (!currentUser || !userProfile) return;
    
    try {
      // Check if user already owns this background
      if (userProfile.ownedBackgrounds?.includes(background.id)) {
        // Switch to this background
        await updateProfile({ backgroundId: background.id });
        setSelectedBackground(background);
        return;
      }
      
      // Check balance
      if (userProfile.balance < background.price) {
        alert('Insufficient balance');
        return;
      }
      
      // Generate QRIS payment
      const payment = await generateAutoQris(
        background.price,
        `Purchase: ${background.name}`
      );
      
      if (payment.success) {
        // Store transaction
        const transactionId = `bg_purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        await setDoc(doc(db, 'transactions', transactionId), {
          id: transactionId,
          type: 'background_purchase',
          userId: currentUser.uid,
          backgroundId: background.id,
          backgroundName: background.name,
          amount: background.price,
          paymentId: payment.paymentId,
          status: 'pending',
          createdAt: serverTimestamp()
        });
        
        // Listen for payment status
        const unsubscribe = listenPaymentStatus(payment.paymentId, async (paymentData) => {
          if (paymentData.status === 'paid') {
            // Update transaction
            await updateDoc(doc(db, 'transactions', transactionId), {
              status: 'completed',
              completedAt: serverTimestamp()
            });
            
            // Add background to user's owned backgrounds
            const ownedBackgrounds = userProfile.ownedBackgrounds || [];
            if (!ownedBackgrounds.includes(background.id)) {
              await updateProfile({
                ownedBackgrounds: [...ownedBackgrounds, background.id],
                backgroundId: background.id,
                balance: userProfile.balance - background.price
              });
              
              setSelectedBackground(background);
            }
            
            unsubscribe();
          }
        });
        
        // Show payment QR
        showPaymentQR(payment.qrisUrl);
      }
    } catch (error) {
      console.error('Error purchasing background:', error);
      alert('Error purchasing background: ' + error.message);
    }
  };

  const showPaymentQR = (qrisUrl) => {
    // Show QR modal
    alert('Please scan the QR code to complete payment');
    window.open(qrisUrl, '_blank');
  };

  const changeActiveBadge = async (badgeId) => {
    if (!currentUser) return;
    
    try {
      const eligible = await checkBadgeEligibility(currentUser.uid, badgeId);
      
      if (!eligible.eligible) {
        alert(`Cannot activate badge: ${eligible.reason}`);
        return;
      }
      
      // Check if user has the badge
      const badges = await getUserBadges(currentUser.uid);
      const hasBadge = badges.some(badge => badge.name === BADGES[badgeId]?.name);
      
      if (!hasBadge) {
        alert('You do not have this badge');
        return;
      }
      
      // Update active badge
      await updateProfile({ activeBadge: badgeId });
      setActiveBadge(BADGES[badgeId]);
    } catch (error) {
      console.error('Error changing badge:', error);
      alert('Error changing badge: ' + error.message);
    }
  };

  const uploadProfileVideo = async (videoFile) => {
    if (!currentUser) return;
    
    try {
      const result = await uploadProfileVideo(currentUser.uid, videoFile);
      
      if (result.success) {
        await updateProfile({ profileVideoURL: result.url });
      }
    } catch (error) {
      console.error('Error uploading profile video:', error);
      alert('Error uploading video: ' + error.message);
    }
  };

  // =============================================
  // 🎖️ BADGE SYSTEM
  // =============================================
  const purchaseBadge = async (badgeId) => {
    if (!currentUser || !userProfile) return;
    
    const badge = BADGES[badgeId];
    if (!badge) {
      alert('Invalid badge');
      return;
    }
    
    try {
      // Check if user already has badge
      const userBadges = await getUserBadges(currentUser.uid);
      const hasBadge = userBadges.some(b => b.name === badge.name);
      
      if (hasBadge) {
        alert('You already have this badge');
        return;
      }
      
      if (badge.price <= 0) {
        // Free badge - assign directly
        await assignBadgeToUser(currentUser.uid, badgeId);
        alert(`Badge ${badge.name} assigned successfully!`);
        return;
      }
      
      // Paid badge - process payment
      const payment = await generateAutoQris(
        badge.price,
        `Badge Purchase: ${badge.name}`
      );
      
      if (payment.success) {
        // Store transaction
        const transactionId = `badge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        await setDoc(doc(db, 'transactions', transactionId), {
          id: transactionId,
          type: 'badge_purchase',
          userId: currentUser.uid,
          badgeId: badgeId,
          badgeName: badge.name,
          amount: badge.price,
          paymentId: payment.paymentId,
          status: 'pending',
          createdAt: serverTimestamp()
        });
        
        // Listen for payment
        const unsubscribe = listenPaymentStatus(payment.paymentId, async (paymentData) => {
          if (paymentData.status === 'paid') {
            // Assign badge
            await assignBadgeToUser(currentUser.uid, badgeId, 'system');
            
            // Update transaction
            await updateDoc(doc(db, 'transactions', transactionId), {
              status: 'completed',
              completedAt: serverTimestamp()
            });
            
            // Update user balance
            const newBalance = userProfile.balance - badge.price;
            await updateProfile({ balance: newBalance });
            
            alert(`Badge ${badge.name} purchased and activated successfully!`);
            
            unsubscribe();
          }
        });
        
        showPaymentQR(payment.qrisUrl);
      }
    } catch (error) {
      console.error('Error purchasing badge:', error);
      alert('Error purchasing badge: ' + error.message);
    }
  };

  // =============================================
  // 🔔 NOTIFICATION SYSTEM
  // =============================================
  const loadNotifications = async (userId) => {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let count = 0;
        const notifications = [];
        
        snapshot.forEach(doc => {
          notifications.push({ id: doc.id, ...doc.data() });
          count++;
        });
        
        setNotificationCount(count);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        readAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // =============================================
  // 👑 ADMIN FUNCTIONS
  // =============================================
  const addProfileBackground = async (backgroundData) => {
    if (!isAdmin && !isOwner) {
      alert('Admin access required');
      return;
    }
    
    try {
      const bgId = `bg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await setDoc(doc(db, 'profile_backgrounds', bgId), {
        id: bgId,
        ...backgroundData,
        createdAt: serverTimestamp(),
        createdBy: currentUser.uid
      });
      
      // Reload backgrounds
      loadProfileBackgrounds();
      
      return { success: true, backgroundId: bgId };
    } catch (error) {
      console.error('Error adding background:', error);
      throw error;
    }
  };

  const updateBackgroundPrice = async (backgroundId, newPrice) => {
    if (!isAdmin && !isOwner) {
      alert('Admin access required');
      return;
    }
    
    try {
      await updateDoc(doc(db, 'profile_backgrounds', backgroundId), {
        price: newPrice,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.uid
      });
      
      loadProfileBackgrounds();
    } catch (error) {
      console.error('Error updating background price:', error);
      throw error;
    }
  };

  const exportData = async (dataType) => {
    if (!isAdmin && !isOwner && !isKasir) {
      alert('Admin access required');
      return;
    }
    
    try {
      const csv = await exportDataToCSV(dataType);
      
      if (csv) {
        // Download CSV
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dataType}_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data: ' + error.message);
    }
  };

  const resetData = async (period, keepGraphData) => {
    if (!isOwner) {
      alert('Owner access required');
      return;
    }
    
    if (!confirm(`Reset data for ${period} period? This action cannot be undone!`)) {
      return;
    }
    
    try {
      const result = await resetSystemData(period, keepGraphData);
      alert(result.message);
    } catch (error) {
      console.error('Error resetting data:', error);
      alert('Error resetting data: ' + error.message);
    }
  };

  // =============================================
  // 🔐 AUTHENTICATION UI
  // =============================================
  const handleLogin = async (email, password) => {
    try {
      await loginWithEmailPassword(email, password);
      setShowLogin(false);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleRegister = async (userData) => {
    try {
      await registerWithEmailPassword(userData);
      setShowLogin(false);
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      setShowLogin(false);
    } catch (error) {
      alert('Google login failed: ' + error.message);
    }
  };

  const handleResetPassword = async (email) => {
    try {
      await resetPassword(email);
      alert('Password reset email sent. Please check your inbox.');
    } catch (error) {
      alert('Password reset failed: ' + error.message);
    }
  };

  // =============================================
  // 🎨 MODERN UI COMPONENTS
  // =============================================
  const renderLoginModal = () => {
    if (!showLogin) return null;
    
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {loginType === 'login' ? 'Login' : 'Register'}
          </h2>
          
          {loginType === 'login' ? (
            <div>
              <input 
                type="email"
                placeholder="Email"
                className="w-full p-3 mb-4 bg-gray-800 rounded-lg"
                id="loginEmail"
              />
              <input 
                type="password"
                placeholder="Password"
                className="w-full p-3 mb-4 bg-gray-800 rounded-lg"
                id="loginPassword"
              />
              <button 
                onClick={() => handleLogin(
                  document.getElementById('loginEmail').value,
                  document.getElementById('loginPassword').value
                )}
                className="w-full p-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                Login
              </button>
              
              <div className="text-center mt-4">
                <button 
                  onClick={() => setLoginType('register')}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Don't have an account? Register
                </button>
                <button 
                  onClick={() => {
                    const email = prompt('Enter your email for password reset:');
                    if (email) handleResetPassword(email);
                  }}
                  className="block text-sm text-gray-400 hover:text-gray-300 mt-2"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          ) : (
            <div>
              <input 
                type="text"
                placeholder="Full Name"
                className="w-full p-3 mb-4 bg-gray-800 rounded-lg"
                id="regName"
              />
              <input 
                type="email"
                placeholder="Email"
                className="w-full p-3 mb-4 bg-gray-800 rounded-lg"
                id="regEmail"
              />
              <input 
                type="password"
                placeholder="Password"
                className="w-full p-3 mb-4 bg-gray-800 rounded-lg"
                id="regPassword"
              />
              <input 
                type="text"
                placeholder="WhatsApp Number (628...)"
                className="w-full p-3 mb-4 bg-gray-800 rounded-lg"
                id="regPhone"
              />
              <select 
                className="w-full p-3 mb-4 bg-gray-800 rounded-lg"
                id="regRole"
              >
                <option value="">Select Role</option>
                <option value="worker">Worker</option>
                <option value="employer">Employer</option>
                <option value="both">Both</option>
              </select>
              
              <button 
                onClick={() => {
                  const userData = {
                    email: document.getElementById('regEmail').value,
                    password: document.getElementById('regPassword').value,
                    name: document.getElementById('regName').value,
                    phone: document.getElementById('regPhone').value,
                    role: document.getElementById('regRole').value
                  };
                  handleRegister(userData);
                }}
                className="w-full p-3 bg-green-600 rounded-lg font-bold hover:bg-green-700 transition"
              >
                Register
              </button>
              
              <div className="text-center mt-4">
                <button 
                  onClick={() => setLoginType('login')}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Already have an account? Login
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <button 
              onClick={handleGoogleLogin}
              className="w-full p-3 bg-red-600 rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <i className="fab fa-google"></i>
              Continue with Google
            </button>
          </div>
          
          <button 
            onClick={() => setShowLogin(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  const renderNavigation = () => {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40">
        <div className="flex justify-around p-3">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`p-3 rounded-lg ${activeTab === 'feed' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
          >
            <i className="fas fa-newspaper"></i>
          </button>
          
          <button 
            onClick={() => setActiveTab('academic')}
            className={`p-3 rounded-lg ${activeTab === 'academic' ? 'bg-green-600' : 'hover:bg-gray-800'}`}
          >
            <i className="fas fa-graduation-cap"></i>
          </button>
          
          <button 
            onClick={() => setActiveTab('quests')}
            className={`p-3 rounded-lg ${activeTab === 'quests' ? 'bg-yellow-600' : 'hover:bg-gray-800'}`}
          >
            <i className="fas fa-tasks"></i>
          </button>
          
          <button 
            onClick={() => setActiveTab('map')}
            className={`p-3 rounded-lg ${activeTab === 'map' ? 'bg-red-600' : 'hover:bg-gray-800'}`}
          >
            <i className="fas fa-map-marked-alt"></i>
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`p-3 rounded-lg ${activeTab === 'profile' ? 'bg-purple-600' : 'hover:bg-gray-800'}`}
          >
            <i className="fas fa-user"></i>
          </button>
        </div>
      </nav>
    );
  };

  const renderFeedTab = () => {
    return (
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Feed Hiper</h2>
          
          <div className="bg-gray-800 rounded-xl p-4 mb-4">
            <textarea 
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full bg-transparent resize-none focus:outline-none"
              rows="3"
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-700 rounded-lg">
                  <i className="fas fa-image"></i>
                </button>
                <button className="p-2 hover:bg-gray-700 rounded-lg">
                  <i className="fas fa-video"></i>
                </button>
              </div>
              <button 
                onClick={createPost}
                disabled={!newPostContent.trim()}
                className="px-4 py-2 bg-blue-600 rounded-lg font-bold disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {feedPosts.map(post => (
            <div 
              key={post.id}
              className={`bg-gray-800 rounded-xl p-4 ${post.isHoax ? 'border-2 border-red-500' : ''}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src={post.userPhoto || '/default-avatar.png'} 
                  alt={post.userName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-bold">{post.userName}</h4>
                  <p className="text-sm text-gray-400">
                    {post.createdAt?.toDate().toLocaleString()}
                  </p>
                </div>
              </div>
              
              <p className="mb-4">{post.content}</p>
              
              <div className="flex justify-between text-gray-400">
                <button 
                  onClick={() => upvotePost(post.id)}
                  className={`flex items-center gap-1 ${post.upvotes?.includes(currentUser?.uid) ? 'text-green-500' : ''}`}
                >
                  <i className="fas fa-arrow-up"></i>
                  {post.upvotes?.length || 0}
                </button>
                
                <button 
                  onClick={() => downvotePost(post.id)}
                  className={`flex items-center gap-1 ${post.downvotes?.includes(currentUser?.uid) ? 'text-red-500' : ''}`}
                >
                  <i className="fas fa-arrow-down"></i>
                  {post.downvotes?.length || 0}
                </button>
                
                <button className="flex items-center gap-1">
                  <i className="fas fa-comment"></i>
                  {post.comments?.length || 0}
                </button>
                
                <button 
                  onClick={() => reportHoax(post.id)}
                  className={`flex items-center gap-1 ${post.hoaxReports?.includes(currentUser?.uid) ? 'text-yellow-500' : ''}`}
                >
                  <i className="fas fa-flag"></i>
                  Report
                </button>
              </div>
              
              {post.comments?.length > 0 && (
                <div className="mt-4 border-t border-gray-700 pt-4">
                  {post.comments.slice(0, 3).map(comment => (
                    <div key={comment.id} className="text-sm mb-2">
                      <span className="font-bold">{comment.userName}: </span>
                      <span>{comment.content}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAcademicTab = () => {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Pojok Mahasiswa</h2>
        
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search journals, papers, articles..."
              className="flex-1 p-3 bg-gray-800 rounded-lg"
            />
            <button 
              onClick={searchAcademic}
              className="px-6 py-3 bg-green-600 rounded-lg font-bold"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button className="px-4 py-2 bg-gray-700 rounded-lg">
              Scopus
            </button>
            <button className="px-4 py-2 bg-gray-700 rounded-lg">
              Google Scholar
            </button>
            <button className="px-4 py-2 bg-gray-700 rounded-lg">
              Plagiarism Check
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {searchResults.map((result, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-4">
              <h4 className="font-bold text-lg mb-2">{result.title}</h4>
              <p className="text-gray-400 text-sm mb-2">
                {result.authors?.join(', ')} • {result.journal} • {result.year}
              </p>
              <p className="mb-3">{result.abstract || 'No abstract available'}</p>
              <div className="flex justify-between items-center">
                <span className="text-yellow-500">
                  <i className="fas fa-star"></i> {result.citations || 0} citations
                </span>
                <a 
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 rounded-lg"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {(isAdmin || isOwner) && (
          <div className="mt-8 p-4 bg-gray-900 rounded-xl">
            <h3 className="font-bold mb-3">Admin: Manage APIs</h3>
            <button 
              onClick={() => addAcademicAPI({
                name: 'New Academic API',
                endpoint: 'https://api.example.com/search',
                apiKey: 'YOUR_API_KEY'
              })}
              className="px-4 py-2 bg-green-700 rounded-lg"
            >
              Add New API
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderQuestsTab = () => {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Worker ↔ Employer</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-bold mb-3">Active Quests</h3>
            <div className="space-y-3">
              {activeQuests.slice(0, 5).map(quest => (
                <div key={quest.id} className="p-3 bg-gray-900 rounded-lg">
                  <h4 className="font-bold">{quest.title}</h4>
                  <p className="text-sm text-gray-400 mb-2">Rp {quest.budget?.toLocaleString('id-ID')}</p>
                  <button 
                    onClick={() => takeQuest(quest.id)}
                    className="w-full py-2 bg-yellow-600 rounded-lg font-bold"
                  >
                    Take Quest
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-bold mb-3">My Quests</h3>
            <div className="space-y-3">
              {myQuests.slice(0, 5).map(quest => (
                <div key={quest.id} className="p-3 bg-gray-900 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">{quest.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${quest.status === 'completed' ? 'bg-green-700' : 'bg-yellow-700'}`}>
                      {quest.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    {quest.type === 'employer' ? 'You posted' : 'You are working on'}
                  </p>
                  <button className="w-full py-2 bg-blue-600 rounded-lg font-bold">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <h3 className="font-bold mb-3">Create New Quest</h3>
          <div className="space-y-3">
            <input 
              type="text"
              placeholder="Quest Title"
              className="w-full p-3 bg-gray-900 rounded-lg"
            />
            <textarea 
              placeholder="Description"
              className="w-full p-3 bg-gray-900 rounded-lg"
              rows="3"
            />
            <input 
              type="number"
              placeholder="Budget (Rp)"
              className="w-full p-3 bg-gray-900 rounded-lg"
            />
            <button className="w-full py-3 bg-green-600 rounded-lg font-bold">
              Create Quest
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Top Workers</h3>
          <div className="space-y-2">
            {workers.slice(0, 5).map(worker => (
              <div key={worker.uid} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <img 
                    src={worker.photoURL || '/default-avatar.png'} 
                    alt={worker.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold">{worker.name}</h4>
                    <p className="text-sm text-gray-400">
                      <i className="fas fa-star text-yellow-500"></i> {worker.rating?.toFixed(1) || '0.0'}
                    </p>
                  </div>
                </div>
                <a 
                  href={generateWhatsAppLink(worker.phone, `Hi ${worker.name}, I have a job for you`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 rounded-lg"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMapTab = () => {
    return (
      <div className="h-screen">
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-900/90 backdrop-blur rounded-xl p-3">
              <input 
                type="text"
                placeholder="Search location..."
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
            <button className="p-3 bg-blue-600 rounded-xl">
              <i className="fas fa-filter"></i>
            </button>
          </div>
        </div>
        
        <div ref={mapRef} className="h-full w-full z-0"></div>
        
        {activeTab === 'add-marker' && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur rounded-t-2xl p-4">
            <h3 className="font-bold text-lg mb-4">Add Marker</h3>
            <div className="space-y-3">
              <input 
                type="text"
                placeholder="Title"
                value={newMarker.title}
                onChange={(e) => setNewMarker({...newMarker, title: e.target.value})}
                className="w-full p-3 bg-gray-800 rounded-lg"
              />
              <textarea 
                placeholder="Description"
                value={newMarker.description}
                onChange={(e) => setNewMarker({...newMarker, description: e.target.value})}
                className="w-full p-3 bg-gray-800 rounded-lg"
                rows="2"
              />
              <select 
                value={newMarker.category}
                onChange={(e) => setNewMarker({...newMarker, category: e.target.value})}
                className="w-full p-3 bg-gray-800 rounded-lg"
              >
                <option value="traffic">Traffic</option>
                <option value="accident">Accident</option>
                <option value="shop">Shop</option>
                <option value="service">Service</option>
                <option value="event">Event</option>
              </select>
              
              <div className="flex gap-2">
                <label className="flex-1 p-3 bg-gray-800 rounded-lg text-center cursor-pointer">
                  <i className="fas fa-camera"></i> Photo
                  <input 
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setNewMarker({...newMarker, photo: e.target.files[0]})}
                  />
                </label>
                <label className="flex-1 p-3 bg-gray-800 rounded-lg text-center cursor-pointer">
                  <i className="fas fa-video"></i> Video
                  <input 
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => setNewMarker({...newMarker, video: e.target.files[0]})}
                  />
                </label>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTab('map')}
                  className="flex-1 py-3 bg-gray-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitMarker}
                  className="flex-1 py-3 bg-blue-600 rounded-lg font-bold"
                >
                  Add Marker
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-20 right-4 flex flex-col gap-2">
          <button 
            onClick={() => {
              if (map && userLocation) {
                map.setView([userLocation.lat, userLocation.lng], 13);
              }
            }}
            className="p-4 bg-gray-900/90 backdrop-blur rounded-full"
          >
            <i className="fas fa-location-crosshairs"></i>
          </button>
          <button 
            onClick={() => setActiveTab('add-marker')}
            className="p-4 bg-blue-600 rounded-full"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
        
        {selectedPost && (
          <div className="absolute top-20 left-4 right-4 bg-gray-900/95 backdrop-blur rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">{selectedPost.title}</h3>
              <button 
                onClick={() => setSelectedPost(null)}
                className="text-gray-400"
              >
                ✕
              </button>
            </div>
            <p className="mb-3">{selectedPost.description}</p>
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                {selectedPost.category}
              </span>
            </div>
            <div className="flex justify-between">
              <a 
                href={selectedPost.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-red-600 rounded-lg"
              >
                <i className="fab fa-google"></i> Maps
              </a>
              <a 
                href={selectedPost.wazeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 rounded-lg"
              >
                <i className="fas fa-car"></i> Waze
              </a>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProfileTab = () => {
    if (!currentUser) {
      return (
        <div className="p-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p className="mb-6">Please login to view your profile</p>
          <button 
            onClick={() => setShowLogin(true)}
            className="px-6 py-3 bg-blue-600 rounded-lg font-bold"
          >
            Login
          </button>
        </div>
      );
    }
    
    return (
      <div className="relative">
        {/* Background Video */}
        {selectedBackground?.videoURL && (
          <div className="absolute inset-0 z-0">
            <video 
              ref={videoRef}
              src={selectedBackground.videoURL}
              autoPlay
              loop
              muted
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
        )}
        
        <div className="relative z-10 p-4">
          {/* Profile Header */}
          <div className="flex items-end gap-4 mb-6">
            <div className="relative">
              <img 
                src={userProfile?.photoURL || '/default-avatar.png'} 
                alt={userProfile?.name}
                className="w-24 h-24 rounded-2xl border-4 border-white/20"
              />
              {activeBadge && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <i className={activeBadge.icon}></i>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{userProfile?.name}</h2>
              <p className="text-gray-300">{userProfile?.bio || 'No bio yet'}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-600/50 rounded-full text-sm">
                  {userProfile?.role}
                </span>
                <span className="px-3 py-1 bg-green-600/50 rounded-full text-sm">
                  Rp {userProfile?.balance?.toLocaleString('id-ID') || '0'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Badges Section */}
          <div className="bg-gray-800/80 backdrop-blur rounded-2xl p-4 mb-4">
            <h3 className="font-bold mb-3">Badges</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Object.entries(BADGES).map(([id, badge]) => {
                const userBadges = userProfile?.badges || [];
                const hasBadge = userBadges.includes(id);
                
                return (
                  <button
                    key={id}
                    onClick={() => hasBadge ? changeActiveBadge(id) : purchaseBadge(id)}
                    className={`flex flex-col items-center p-3 rounded-xl min-w-[80px] ${hasBadge ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gray-900/50'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${hasBadge ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-700'}`}>
                      <i className={badge.icon}></i>
                    </div>
                    <span className="text-xs font-bold">{badge.name}</span>
                    {!hasBadge && badge.price > 0 && (
                      <span className="text-xs text-yellow-500 mt-1">
                        Rp {badge.price.toLocaleString('id-ID')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Backgrounds Section */}
          <div className="bg-gray-800/80 backdrop-blur rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Backgrounds</h3>
              <span className="text-sm text-gray-400">
                {userProfile?.ownedBackgrounds?.length || 0} owned
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {profileBackgrounds.slice(0, 4).map(bg => {
                const isOwned = userProfile?.ownedBackgrounds?.includes(bg.id);
                const isActive = selectedBackground?.id === bg.id;
                
                return (
                  <div 
                    key={bg.id}
                    className={`relative rounded-xl overflow-hidden ${isActive ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    {bg.videoURL ? (
                      <video 
                        src={bg.videoURL}
                        className="w-full h-32 object-cover"
                        muted
                      />
                    ) : (
                      <div 
                        className="w-full h-32"
                        style={{ background: bg.color || '#000' }}
                      ></div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">{bg.name}</span>
                        <button 
                          onClick={() => isOwned ? 
                            setSelectedBackground(bg) : 
                            purchaseBackground(bg)
                          }
                          className={`px-3 py-1 rounded-lg text-xs ${isOwned ? 'bg-blue-600' : 'bg-green-600'}`}
                        >
                          {isOwned ? (isActive ? 'Active' : 'Use') : `Rp ${bg.price.toLocaleString('id-ID')}`}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button className="w-full mt-3 py-3 bg-gray-700 rounded-lg font-bold">
              View All Backgrounds
            </button>
          </div>
          
          {/* Stats Section */}
          <div className="bg-gray-800/80 backdrop-blur rounded-2xl p-4">
            <h3 className="font-bold mb-3">Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900/50 rounded-xl p-3">
                <p className="text-sm text-gray-400">Quests Posted</p>
                <p className="text-2xl font-bold">
                  {userProfile?.stats?.totalQuests || 0}
                </p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-3">                <p className="text-sm text-gray-400">Quests Completed</p>
                <p className="text-2xl font-bold">
                  {userProfile?.stats?.completedQuests || 0}
                </p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-3">
                <p className="text-sm text-gray-400">Rating</p>
                <p className="text-2xl font-bold">
                  {userProfile?.rating?.toFixed(1) || '0.0'}
                </p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-3">
                <p className="text-sm text-gray-400">Markers</p>
                <p className="text-2xl font-bold">
                  {markers.filter(m => m.userId === currentUser.uid).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminPanel = () => {
    if (!isAdmin && !isOwner && !isKasir) return null;
    
    return (
      <div className="fixed top-4 right-4 z-30">
        <div className="relative group">
          <button className="p-3 bg-gradient-to-br from-red-600 to-pink-600 rounded-full">
            <i className="fas fa-user-shield"></i>
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full text-xs flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          
          <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 rounded-xl p-4 shadow-xl hidden group-hover:block">
            <h4 className="font-bold mb-3">Admin Panel</h4>
            <div className="space-y-2">
              <button className="w-full p-3 bg-gray-800 rounded-lg text-left hover:bg-gray-700">
                <i className="fas fa-users mr-2"></i>
                Manage Users
              </button>
              <button 
                onClick={() => exportData('users')}
                className="w-full p-3 bg-gray-800 rounded-lg text-left hover:bg-gray-700"
              >
                <i className="fas fa-download mr-2"></i>
                Export Data
              </button>
              {isOwner && (
                <button 
                  onClick={() => resetData('7days', true)}
                  className="w-full p-3 bg-red-800 rounded-lg text-left hover:bg-red-700"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Reset Data
                </button>
              )}
              <button className="w-full p-3 bg-gray-800 rounded-lg text-left hover:bg-gray-700">
                <i className="fas fa-cog mr-2"></i>
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =============================================
  // 🎯 MAIN RENDER
  // =============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur z-30 p-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-satellite-dish"></i>
            </div>
            <h1 className="text-xl font-bold">SIMPLE BISNIS</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {!currentUser ? (
              <button 
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold"
              >
                Login
              </button>
            ) : (
              <button 
                onClick={() => {
                  auth.signOut();
                  setCurrentUser(null);
                  setUserProfile(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg font-bold"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="pt-20 pb-24">
        {activeTab === 'feed' && renderFeedTab()}
        {activeTab === 'academic' && renderAcademicTab()}
        {activeTab === 'quests' && renderQuestsTab()}
        {activeTab === 'map' && renderMapTab()}
        {activeTab === 'profile' && renderProfileTab()}
      </main>
      
      {/* Navigation */}
      {renderNavigation()}
      
      {/* Admin Panel */}
      {renderAdminPanel()}
      
      {/* Login Modal */}
      {renderLoginModal()}
      
      {/* Global Notifications */}
      <div className="fixed top-20 right-4 z-40 space-y-2">
        {/* Notification alerts would appear here */}
      </div>
    </div>
  );
};

export default Sec;
