// app.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sec from './sec.jsx';
import { 
  auth, 
  db, 
  onAuthStateChange,
  requestNotificationPermission,
  setupForegroundNotifications,
  sendNotificationToUser,
  getUserLocation,
  getPlatformStatistics
} from './api.jsx';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isKasir, setIsKasir] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [permissions, setPermissions] = useState({
    location: false,
    notification: false,
    camera: false
  });
  const [systemStats, setSystemStats] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        setCurrentUser(user);
        console.log("User logged in:", user.email);
        
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const profile = userDoc.data();
            setUserProfile(profile);
            
            setIsAdmin(profile.role === 'admin' || profile.role === 'owner');
            setIsOwner(profile.role === 'owner');
            setIsKasir(profile.role === 'kasir');
            
            // Check admin access via URL
            const urlParams = new URLSearchParams(window.location.search);
            const isAdminParam = urlParams.get('admin') === 'true';
            const isAdminHash = window.location.hash === '#admin';
            
            if ((isAdminParam || isAdminHash) && 
                (profile.role === 'admin' || profile.role === 'owner')) {
              console.log("Admin panel activated via URL");
            }
            
          } else {
            console.log("User document not found");
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setIsAdmin(false);
        setIsOwner(false);
        setIsKasir(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Request permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        // Request notification permission
        const notifResult = await requestNotificationPermission();
        setPermissions(prev => ({
          ...prev,
          notification: notifResult.success
        }));

        // Request location permission
        try {
          const location = await getUserLocation();
          setUserLocation(location);
          setPermissions(prev => ({
            ...prev,
            location: true
          }));
        } catch (locationError) {
          console.error("Location permission denied:", locationError);
        }

        // Setup foreground notifications
        setupForegroundNotifications();
      } catch (error) {
        console.error("Permission request error:", error);
      }
    };

    requestPermissions();
  }, []);

  // Load notifications for logged in user
  useEffect(() => {
    if (!currentUser) return;

    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const newNotifications = [];
      snapshot.forEach(doc => {
        newNotifications.push({ id: doc.id, ...doc.data() });
      });
      
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.length);
      
      // Show desktop notifications for new ones
      newNotifications.forEach(notif => {
        if (Notification.permission === 'granted' && !notif.shown) {
          new Notification(notif.title || 'New Notification', {
            body: notif.message,
            icon: '/icon.png',
            badge: '/badge.png'
          });
        }
      });
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Load system statistics
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getPlatformStatistics();
        setSystemStats(stats);
      } catch (error) {
        console.error("Error loading system stats:", error);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Connection status monitoring
  useEffect(() => {
    const updateConnectionStatus = () => {
      if (navigator.onLine) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    };

    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
    
    updateConnectionStatus();
    
    return () => {
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
    };
  }, []);

  // Background notification handler (works when tab is closed)
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (notificationId) => {
    try {
      const notifRef = doc(db, 'notifications', notificationId);
      await updateDoc(notifRef, {
        read: true,
        readAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  // Send notification
  const sendNotification = useCallback(async (userId, title, message, type = 'info') => {
    try {
      await sendNotificationToUser(userId, title, message, type);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }, []);

  // Check if user has permission for action
  const checkPermission = useCallback((permissionType, requiredRole = null) => {
    // Check role-based permission
    if (requiredRole) {
      if (requiredRole === 'admin' && !isAdmin && !isOwner) return false;
      if (requiredRole === 'owner' && !isOwner) return false;
      if (requiredRole === 'kasir' && !isKasir) return false;
    }

    // Check system permissions
    switch (permissionType) {
      case 'location':
        return permissions.location;
      case 'notification':
        return permissions.notification;
      case 'camera':
        return permissions.camera;
      case 'post':
        return currentUser !== null;
      case 'admin':
        return isAdmin || isOwner;
      case 'owner':
        return isOwner;
      case 'kasir':
        return isKasir;
      default:
        return true;
    }
  }, [permissions, currentUser, isAdmin, isOwner, isKasir]);

  // Auth guard wrapper component
  const AuthGuard = ({ children, requireAuth = false, requireAdmin = false, requireOwner = false }) => {
    const location = useLocation();

    if (requireOwner && !isOwner) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin && !isOwner) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (requireAuth && !currentUser) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
  };

  // Loading component
  const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
          <div className="absolute inset-4 rounded-full bg-gray-900 flex items-center justify-center">
            <i className="fas fa-satellite-dish text-3xl text-blue-400 animate-spin"></i>
          </div>
        </div>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            SIMPLE BISNIS
          </h1>
          <p className="text-gray-400">Cyber Network Platform</p>
        </div>
        
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
        
        <p className="text-gray-400 text-sm">Connecting to server...</p>
        
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );

  // Connection status indicator
  const ConnectionStatusIndicator = () => (
    <div className={`fixed bottom-4 right-4 px-3 py-2 rounded-lg text-xs font-bold z-50 ${
      connectionStatus === 'connected' 
        ? 'bg-green-500/20 text-green-400' 
        : connectionStatus === 'disconnected'
        ? 'bg-red-500/20 text-red-400 animate-pulse'
        : 'bg-yellow-500/20 text-yellow-400'
    }`}>
      <i className={`fas fa-${
        connectionStatus === 'connected' ? 'wifi' :
        connectionStatus === 'disconnected' ? 'exclamation-triangle' : 'sync-alt fa-spin'
      } mr-2`}></i>
      {connectionStatus.toUpperCase()}
    </div>
  );

  // Notification bell with badge
  const NotificationBell = () => {
    const [showNotifications, setShowNotifications] = useState(false);

    if (!currentUser) return null;

    return (
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 hover:bg-gray-800 rounded-lg transition"
        >
          <i className="fas fa-bell text-xl"></i>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowNotifications(false)}
            />
            <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h3 className="font-bold flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => {
                        notifications.forEach(notif => markNotificationAsRead(notif.id));
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Mark all as read
                    </button>
                  )}
                </h3>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <i className="fas fa-bell-slash text-3xl mb-3"></i>
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id}
                      className={`p-4 border-b border-gray-800 hover:bg-gray-800 cursor-pointer ${
                        notif.read ? 'opacity-70' : ''
                      }`}
                      onClick={() => markNotificationAsRead(notif.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          notif.type === 'success' ? 'bg-green-500/20 text-green-400' :
                          notif.type === 'error' ? 'bg-red-500/20 text-red-400' :
                          notif.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          <i className={`fas fa-${
                            notif.type === 'success' ? 'check-circle' :
                            notif.type === 'error' ? 'exclamation-circle' :
                            notif.type === 'warning' ? 'exclamation-triangle' :
                            'info-circle'
                          }`}></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm">{notif.title}</h4>
                          <p className="text-gray-400 text-xs mt-1">{notif.message}</p>
                          <p className="text-gray-500 text-xs mt-2">
                            {notif.createdAt?.toDate().toLocaleTimeString()}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Main app layout
  const MainLayout = ({ children }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <i className="fas fa-satellite-dish"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    SIMPLE BISNIS
                  </h1>
                  <p className="text-xs text-gray-400">Cyber Network Platform</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* System stats for admin */}
                {(isAdmin || isOwner) && systemStats && (
                  <div className="hidden md:flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-green-400 font-bold">{systemStats.totalUsers}</div>
                      <div className="text-gray-400 text-xs">Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">{systemStats.totalQuests}</div>
                      <div className="text-gray-400 text-xs">Quests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold">{systemStats.totalRevenue.toLocaleString('id-ID')}</div>
                      <div className="text-gray-400 text-xs">Revenue</div>
                    </div>
                  </div>
                )}

                <NotificationBell />

                {currentUser ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                        {userProfile?.photoURL ? (
                          <img 
                            src={userProfile.photoURL} 
                            alt={userProfile.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <i className="fas fa-user"></i>
                        )}
                      </div>
                      <div className="hidden md:block text-left">
                        <div className="font-bold text-sm">{userProfile?.name || 'User'}</div>
                        <div className="text-gray-400 text-xs">{userProfile?.role || 'user'}</div>
                      </div>
                      <i className={`fas fa-chevron-down text-gray-400 transition-transform ${
                        showUserMenu ? 'rotate-180' : ''
                      }`}></i>
                    </button>

                    {showUserMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-30"
                          onClick={() => setShowUserMenu(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-xl shadow-2xl z-40 overflow-hidden">
                          <div className="p-4 border-b border-gray-800">
                            <div className="font-bold">{userProfile?.name}</div>
                            <div className="text-gray-400 text-sm">{userProfile?.email}</div>
                            {userProfile?.badges?.map(badge => (
                              <span key={badge} className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded mr-1 mt-1">
                                {badge}
                              </span>
                            ))}
                          </div>
                          
                          <div className="py-2">
                            <a 
                              href="/profile" 
                              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition"
                            >
                              <i className="fas fa-user w-5"></i>
                              <span>Profile</span>
                            </a>
                            <a 
                              href="/settings" 
                              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition"
                            >
                              <i className="fas fa-cog w-5"></i>
                              <span>Settings</span>
                            </a>
                            {isAdmin && (
                              <a 
                                href="/admin" 
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition"
                              >
                                <i className="fas fa-shield-alt w-5"></i>
                                <span>Admin Panel</span>
                              </a>
                            )}
                          </div>
                          
                          <div className="p-4 border-t border-gray-800">
                            <button
                              onClick={() => {
                                auth.signOut();
                                setShowUserMenu(false);
                              }}
                              className="w-full py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition flex items-center justify-center gap-2"
                            >
                              <i className="fas fa-sign-out-alt"></i>
                              Logout
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold hover:opacity-90 transition"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="pt-20 pb-8">
          {children}
        </main>

        {/* Connection status */}
        <ConnectionStatusIndicator />

        {/* Permission warnings */}
        {!permissions.notification && (
          <div className="fixed bottom-20 left-4 right-4 bg-yellow-500/20 text-yellow-400 p-3 rounded-lg backdrop-blur-lg border border-yellow-500/30 z-50 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fas fa-exclamation-triangle"></i>
                <span className="text-sm">Enable notifications for better experience</span>
              </div>
              <button
                onClick={() => requestNotificationPermission()}
                className="px-3 py-1 bg-yellow-500/30 rounded text-xs hover:bg-yellow-500/40"
              >
                Enable
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Admin page component
  const AdminPage = () => {
    if (!isAdmin && !isOwner) {
      return <Navigate to="/" replace />;
    }

    return (
      <MainLayout>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          {/* Admin content here */}
        </div>
      </MainLayout>
    );
  };

  // Login page component
  const LoginPage = () => {
    if (currentUser) {
      return <Navigate to="/" replace />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-satellite-dish text-3xl"></i>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SIMPLE BISNIS
            </h1>
            <p className="text-gray-400 mt-2">Cyber Network Platform</p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
            
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-4 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <button className="w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold hover:opacity-90 transition">
                Login
              </button>
              
              <div className="text-center">
                <a href="/forgot-password" className="text-blue-400 hover:text-blue-300 text-sm">
                  Forgot password?
                </a>
              </div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900/50 text-gray-400">Or continue with</span>
                </div>
              </div>
              
              <button className="w-full p-4 bg-red-600 rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-3">
                <i className="fab fa-google"></i>
                Google
              </button>
              
              <div className="text-center text-sm text-gray-400 mt-6">
                Don't have an account?{' '}
                <a href="/register" className="text-blue-400 hover:text-blue-300 font-bold">
                  Sign up
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm mt-8">
            <p>Need help? Contact Admin:</p>
            <a 
              href="https://wa.me/6285811258873" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 inline-flex items-center gap-2 mt-2"
            >
              <i className="fab fa-whatsapp"></i>
              0858 1125 8873
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Main app router
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <AuthGuard requireAuth={false}>
            <LoginPage />
          </AuthGuard>
        } />
        
        <Route path="/admin" element={
          <AuthGuard requireAdmin={true}>
            <AdminPage />
          </AuthGuard>
        } />
        
        <Route path="/admin/:section" element={
          <AuthGuard requireAdmin={true}>
            <AdminPage />
          </AuthGuard>
        } />
        
        <Route path="*" element={
          <MainLayout>
            <Sec 
              currentUser={currentUser}
              userProfile={userProfile}
              isAdmin={isAdmin}
              isOwner={isOwner}
              isKasir={isKasir}
              permissions={permissions}
              userLocation={userLocation}
              notifications={notifications}
              onMarkNotificationAsRead={markNotificationAsRead}
              onSendNotification={sendNotification}
              checkPermission={checkPermission}
              systemStats={systemStats}
            />
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
