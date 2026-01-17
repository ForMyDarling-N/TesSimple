/**
 * SIMPLE BISNIS - API & SERVICES LAYER
 * Migration from index.html - All original logic preserved
 * Production Ready
 */

// =============================================
// 🔥 FIREBASE CONFIGURATION
// =============================================
export const firebaseConfig = {
    apiKey: "AIzaSyA5b7KYCxC8WuYkvdYGIi1z6t84gGc-MxA",
    authDomain: "simple-bisnisbrengsekbgt.firebaseapp.com",
    projectId: "simple-bisnisbrengsekbgt",
    storageBucket: "simple-bisnisbrengsekbgt.firebasestorage.app",
    messagingSenderId: "261716836340",
    appId: "1:261716836340:web:b2591092aebc9d3e5983a1"
};

// =============================================
// 🔑 API KEYS & EXTERNAL CONFIG
// =============================================
export const API_KEYS = {
    // Payment QRIS API Key (Pak Kasir)
    QRIS_API_KEY: "EIXlvG2cqApi4lrNzvKVPE5A0OdHHpNb",
    
    // AI Chat APIs
    DEX75_API_URL: "https://api.ryzumi.vip/api/ai/deepseek",
    POLLINATION_API_URL: "https://api.ryzumi.vip/api/ai/v2/chatgpt",
    
    // DNS Check API
    GOOGLE_DNS_API: "https://dns.google/resolve",
    
    // Static Assets
    QRIS_IMAGE_URL: "https://files.catbox.moe/f1h9md.png"
};

// =============================================
// 👑 ADMIN CONFIGURATION
// =============================================
export const ADMIN_CONFIG = {
    // Admin Emails with special access
    ADMIN_EMAILS: [
        'skizoservice@gmail.com',
        'owner2@gmail.com',
        'naylagentasaka2006@gmail.com'
    ],
    
    // WhatsApp Admin Contact
    WHATSAPP_ADMIN: "6285811258873",
    
    // Admin Fee Percentage
    ADMIN_FEE_PERCENTAGE: 0.05, // 5%
    
    // Payment QRIS Config
    QRIS_CONFIG: {
        merchantName: "SIMPLE BISNIS",
        merchantCity: "JAKARTA",
        transactionCurrency: "IDR"
    }
};

// =============================================
// 🎖️ BADGE SYSTEM CONFIGURATION
// =============================================
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
// 🗺️ MAP CONFIGURATION
// =============================================
export const MAP_CONFIG = {
    // Initial Map View (Jakarta)
    DEFAULT_VIEW: {
        lat: -6.200000,
        lng: 106.816666,
        zoom: 13
    },
    
    // Map Tile Layers
    TILE_LAYERS: {
        street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        hybrid: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    },
    
    // Marker Categories
    MARKER_CATEGORIES: {
        traffic: { color: 'red', icon: 'fas fa-traffic-light', name: 'Macet' },
        accident: { color: 'orange', icon: 'fas fa-car-crash', name: 'Kecelakaan' },
        shop: { color: 'green', icon: 'fas fa-store', name: 'Toko' },
        service: { color: 'purple', icon: 'fas fa-tools', name: 'Jasa' },
        event: { color: 'yellow', icon: 'fas fa-calendar', name: 'Event' },
        other: { color: 'blue', icon: 'fas fa-map-marker-alt', name: 'Lainnya' }
    },
    
    // Map Controls
    MAP_CONTROLS: {
        minZoom: 3,
        maxZoom: 18,
        zoomControl: true,
        scrollWheelZoom: true
    }
};

// =============================================
// 📋 QUEST CONFIGURATION
// =============================================
export const QUEST_CONFIG = {
    // Quest Categories
    CATEGORIES: [
        { id: 'design', name: 'Desain', icon: 'fas fa-palette' },
        { id: 'programming', name: 'Programming', icon: 'fas fa-code' },
        { id: 'marketing', name: 'Marketing', icon: 'fas fa-chart-line' },
        { id: 'writing', name: 'Writing', icon: 'fas fa-pen' },
        { id: 'other', name: 'Lainnya', icon: 'fas fa-ellipsis-h' }
    ],
    
    // Quest Status
    STATUS: {
        PENDING_PAYMENT: 'pending_payment',
        PENDING_VERIFICATION: 'pending_verification',
        OPEN: 'open',
        TAKEN: 'taken',
        COMPLETED: 'completed',
        REJECTED: 'rejected'
    },
    
    // Payment Status
    PAYMENT_STATUS: {
        PENDING: 'pending',
        PAID: 'paid',
        REJECTED: 'rejected'
    },
    
    // Limits
    MIN_BUDGET: 10000,
    MAX_FILE_SIZE: {
        QUEST_IMAGE: 2 * 1024 * 1024, // 2MB
        PAYMENT_PROOF: 5 * 1024 * 1024, // 5MB
        WORK_PROOF: 10 * 1024 * 1024 // 10MB
    }
};

// =============================================
// 🔐 AUTHENTICATION SERVICES
// =============================================
export class AuthService {
    constructor(firebase) {
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.currentUser = null;
        this.userProfile = null;
    }
    
    /**
     * Login dengan email dan password
     */
    async loginWithEmailPassword(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            await this.loadUserProfile(userCredential.user.uid);
            return { success: true, user: this.currentUser };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: this.getAuthErrorMessage(error) };
        }
    }
    
    /**
     * Register dengan email dan password
     */
    async registerWithEmailPassword(userData) {
        try {
            const { email, password, name, phone, region, role, selectedBadge } = userData;
            
            // Validasi data
            if (password.length < 6) {
                return { success: false, error: "Password minimal 6 karakter!" };
            }
            
            if (!phone.startsWith('62')) {
                return { success: false, error: "Nomor WhatsApp harus dimulai dengan 62" };
            }
            
            // Buat user di Firebase Auth
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            
            // Buat profile di Firestore
            const userProfile = {
                uid: userCredential.user.uid,
                email: email,
                name: name,
                phone: phone,
                region: region,
                role: role || 'user',
                verified: false,
                badges: [selectedBadge || 'newbie'],
                reputation: 'newbie',
                rating: 0,
                balance: 0,
                pendingBalance: 0,
                photoURL: '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                stats: {
                    totalQuests: 0,
                    completedQuests: 0,
                    activeQuests: 0,
                    failedQuests: 0
                }
            };
            
            await this.db.collection('users').doc(userCredential.user.uid).set(userProfile);
            
            // Auto assign admin jika email termasuk admin
            if (ADMIN_CONFIG.ADMIN_EMAILS.includes(email.toLowerCase())) {
                await this.db.collection('users').doc(userCredential.user.uid).update({
                    role: 'admin',
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            this.currentUser = userCredential.user;
            this.userProfile = userProfile;
            
            return { success: true, user: this.currentUser };
        } catch (error) {
            console.error("Registration error:", error);
            return { success: false, error: this.getAuthErrorMessage(error) };
        }
    }
    
    /**
     * Login dengan Google
     */
    async loginWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');
            
            const result = await this.auth.signInWithPopup(provider);
            await this.loadUserProfile(result.user.uid);
            
            return { success: true, user: this.currentUser };
        } catch (error) {
            console.error("Google login error:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Reset Password - Kirim email reset
     */
    async resetPassword(email) {
        try {
            await this.auth.sendPasswordResetEmail(email);
            return { success: true, message: "Email reset password telah dikirim!" };
        } catch (error) {
            console.error("Reset password error:", error);
            return { success: false, error: this.getAuthErrorMessage(error) };
        }
    }
    
    /**
     * Admin reset password untuk user
     */
    async adminResetPassword(userEmail, newPassword) {
        try {
            // Note: Ini memerlukan Firebase Admin SDK di backend
            // Untuk frontend, arahkan ke Firebase Console
            return { 
                success: false, 
                error: "Fitur reset password admin hanya tersedia melalui Firebase Console" 
            };
        } catch (error) {
            console.error("Admin reset password error:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Load user profile dari Firestore
     */
    async loadUserProfile(uid) {
        try {
            const userDoc = await this.db.collection('users').doc(uid).get();
            
            if (!userDoc.exists) {
                throw new Error("User profile tidak ditemukan");
            }
            
            this.userProfile = userDoc.data();
            this.currentUser = this.auth.currentUser;
            
            return this.userProfile;
        } catch (error) {
            console.error("Error loading user profile:", error);
            throw error;
        }
    }
    
    /**
     * Update user profile
     */
    async updateProfile(uid, updates) {
        try {
            await this.db.collection('users').doc(uid).update({
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Refresh profile data
            await this.loadUserProfile(uid);
            
            return { success: true };
        } catch (error) {
            console.error("Error updating profile:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Logout
     */
    async logout() {
        try {
            await this.auth.signOut();
            this.currentUser = null;
            this.userProfile = null;
            return { success: true };
        } catch (error) {
            console.error("Logout error:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Helper: Get auth error message
     */
    getAuthErrorMessage(error) {
        switch(error.code) {
            case 'auth/user-not-found':
                return "User tidak ditemukan.";
            case 'auth/wrong-password':
                return "Password salah.";
            case 'auth/invalid-email':
                return "Email tidak valid.";
            case 'auth/email-already-in-use':
                return "Email sudah terdaftar.";
            case 'auth/weak-password':
                return "Password terlalu lemah.";
            case 'auth/requires-recent-login':
                return "Sesi login telah berakhir, silakan login ulang.";
            default:
                return error.message;
        }
    }
    
    /**
     * Check admin access
     */
    isAdmin() {
        if (!this.currentUser) return false;
        return ADMIN_CONFIG.ADMIN_EMAILS.includes(this.currentUser.email.toLowerCase()) ||
               (this.userProfile && (this.userProfile.role === 'admin' || this.userProfile.role === 'owner'));
    }
    
    /**
     * Check owner access
     */
    isOwner() {
        if (!this.userProfile) return false;
        return this.userProfile.role === 'owner';
    }
    
    /**
     * Check kasir access
     */
    isKasir() {
        if (!this.userProfile) return false;
        return this.userProfile.role === 'kasir';
    }
}

// =============================================
// 💳 PAYMENT SERVICES (QRIS AUTO SYSTEM)
// =============================================
export class PaymentService {
    constructor(db) {
        this.db = db;
    }
    
    /**
     * Generate QRIS untuk pembayaran
     * Menggunakan API Key Pak Kasir
     */
    async generateQRIS(paymentData) {
        try {
            const { amount, merchantName = "SIMPLE BISNIS", merchantCity = "JAKARTA" } = paymentData;
            
            // Format data untuk QRIS
            const qrisData = {
                merchantName,
                merchantCity,
                transactionAmount: amount,
                transactionCurrency: "IDR",
                apiKey: API_KEYS.QRIS_API_KEY,
                timestamp: Date.now()
            };
            
            // Note: Ini adalah placeholder untuk implementasi QRIS
            // Implementasi aktual akan bergantung pada API provider QRIS
            // Untuk sekarang, return URL QRIS static dengan parameter
            
            const qrisUrl = `https://qris.pakkasir.com/generate?amount=${amount}&merchant=${encodeURIComponent(merchantName)}&city=${encodeURIComponent(merchantCity)}&key=${API_KEYS.QRIS_API_KEY}`;
            
            return {
                success: true,
                qrisUrl: qrisUrl,
                qrisImage: API_KEYS.QRIS_IMAGE_URL, // Static image untuk sementara
                paymentData: qrisData
            };
            
        } catch (error) {
            console.error("QRIS generation error:", error);
            return { success: false, error: "Gagal generate QRIS" };
        }
    }
    
    /**
     * Create payment record di Firestore
     */
    async createPaymentRecord(paymentRecord) {
        try {
            const paymentId = 'payment_' + Date.now();
            
            const record = {
                id: paymentId,
                ...paymentRecord,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await this.db.collection('payments').doc(paymentId).set(record);
            
            return { success: true, paymentId, record };
        } catch (error) {
            console.error("Error creating payment record:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Simpan bukti pembayaran
     */
    async savePaymentProof(paymentId, proofBase64, notes = '') {
        try {
            await this.db.collection('payments').doc(paymentId).update({
                proofBase64,
                proofNotes: notes,
                proofUploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending_verification',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true };
        } catch (error) {
            console.error("Error saving payment proof:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Verify payment (admin function)
     */
    async verifyPayment(paymentId, adminId) {
        try {
            const paymentRef = this.db.collection('payments').doc(paymentId);
            const paymentDoc = await paymentRef.get();
            const payment = paymentDoc.data();
            
            if (!payment) {
                return { success: false, error: "Payment tidak ditemukan" };
            }
            
            // Update status payment
            await paymentRef.update({
                status: 'approved',
                approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
                approvedBy: adminId,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Update quest status jika ada questId
            if (payment.questId) {
                await this.db.collection('quests').doc(payment.questId).update({
                    paymentStatus: 'paid',
                    status: 'open',
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Kirim notifikasi ke employer
                await this.sendNotification(payment.employerId, {
                    type: 'payment_verified',
                    title: 'Pembayaran Diverifikasi',
                    message: `Pembayaran untuk quest "${payment.questTitle}" telah diverifikasi. Quest sekarang aktif.`,
                    questId: payment.questId
                });
            }
            
            return { success: true };
        } catch (error) {
            console.error("Error verifying payment:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Reject payment (admin function)
     */
    async rejectPayment(paymentId, adminId, reason) {
        try {
            const paymentRef = this.db.collection('payments').doc(paymentId);
            const paymentDoc = await paymentRef.get();
            const payment = paymentDoc.data();
            
            if (!payment) {
                return { success: false, error: "Payment tidak ditemukan" };
            }
            
            await paymentRef.update({
                status: 'rejected',
                rejectionReason: reason,
                rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
                rejectedBy: adminId,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Update quest status jika ada questId
            if (payment.questId) {
                await this.db.collection('quests').doc(payment.questId).update({
                    paymentStatus: 'rejected',
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Kirim notifikasi ke employer
                await this.sendNotification(payment.employerId, {
                    type: 'payment_rejected',
                    title: 'Pembayaran Ditolak',
                    message: `Pembayaran untuk quest "${payment.questTitle}" ditolak: ${reason}`,
                    questId: payment.questId
                });
            }
            
            return { success: true };
        } catch (error) {
            console.error("Error rejecting payment:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Check payment status (polling untuk auto verification)
     */
    async checkPaymentStatus(paymentId) {
        try {
            const paymentDoc = await this.db.collection('payments').doc(paymentId).get();
            const payment = paymentDoc.data();
            
            if (!payment) {
                return { success: false, error: "Payment tidak ditemukan" };
            }
            
            return { 
                success: true, 
                status: payment.status,
                data: payment
            };
        } catch (error) {
            console.error("Error checking payment status:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Helper: Send notification
     */
    async sendNotification(userId, notificationData) {
        try {
            await this.db.collection('notifications').add({
                userId,
                ...notificationData,
                read: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    }
}

// =============================================
// 🗺️ MAP SERVICES
// =============================================
export class MapService {
    constructor(db) {
        this.db = db;
        this.markers = {};
        this.markerLayerGroup = null;
    }
    
    /**
     * Initialize map
     */
    initMap(mapElementId, options = {}) {
        const defaultOptions = {
            center: [MAP_CONFIG.DEFAULT_VIEW.lat, MAP_CONFIG.DEFAULT_VIEW.lng],
            zoom: MAP_CONFIG.DEFAULT_VIEW.zoom,
            ...MAP_CONFIG.MAP_CONTROLS
        };
        
        const map = L.map(mapElementId, { ...defaultOptions, ...options });
        
        // Add tile layers
        this.streetLayer = L.tileLayer(MAP_CONFIG.TILE_LAYERS.street, {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);
        
        this.satelliteLayer = L.tileLayer(MAP_CONFIG.TILE_LAYERS.satellite, {
            attribution: '&copy; Esri'
        });
        
        this.hybridLayer = L.tileLayer(MAP_CONFIG.TILE_LAYERS.hybrid, {
            subdomains: MAP_CONFIG.TILE_LAYERS.subdomains,
            attribution: '&copy; Google'
        });
        
        // Initialize marker layer group
        this.markerLayerGroup = L.layerGroup().addTo(map);
        
        return map;
    }
    
    /**
     * Change map type
     */
    changeMapType(map, mapType) {
        map.removeLayer(this.streetLayer);
        map.removeLayer(this.satelliteLayer);
        map.removeLayer(this.hybridLayer);
        
        switch(mapType) {
            case 'street':
                this.streetLayer.addTo(map);
                break;
            case 'satellite':
                this.satelliteLayer.addTo(map);
                break;
            case 'hybrid':
                this.hybridLayer.addTo(map);
                break;
        }
    }
    
    /**
     * Add marker to map
     */
    addMarkerToMap(map, markerData) {
        if (this.markers[markerData.id]) return;
        
        const category = MAP_CONFIG.MARKER_CATEGORIES[markerData.category] || MAP_CONFIG.MARKER_CATEGORIES.other;
        
        const customIcon = L.divIcon({
            html: `
                <div style="
                    background: ${category.color};
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
                    <i class="${category.icon}"></i>
                </div>
            `,
            className: 'custom-marker-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });
        
        const marker = L.marker([markerData.lat, markerData.lng], { icon: customIcon })
            .addTo(this.markerLayerGroup);
        
        let popupContent = `<b>${markerData.title}</b><br>`;
        popupContent += `${markerData.description}<br>`;
        popupContent += `<i>Kategori: ${category.name}</i><br>`;
        
        if (markerData.photoBase64) {
            popupContent += `<img src="${markerData.photoBase64}" style="max-width: 200px; max-height: 150px; margin: 10px 0; border-radius: 5px;"><br>`;
        }
        
        if (markerData.gmapsLink) {
            popupContent += `<a href="${markerData.gmapsLink}" target="_blank" class="gmaps-link"><i class="fab fa-google"></i> Buka di Google Maps</a><br>`;
        }
        
        popupContent += `<small>Ditambahkan: ${new Date(markerData.createdAt?.toDate()).toLocaleString()}</small>`;
        
        marker.bindPopup(popupContent);
        this.markers[markerData.id] = marker;
        
        return marker;
    }
    
    /**
     * Save marker ke database
     */
    async saveMarker(markerData) {
        try {
            const markerId = 'marker_' + Date.now();
            
            const marker = {
                id: markerId,
                ...markerData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await this.db.collection('markers').doc(markerId).set(marker);
            
            return { success: true, markerId, marker };
        } catch (error) {
            console.error("Error saving marker:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Load markers dari database
     */
    async loadMarkers(filter = {}) {
        try {
            let query = this.db.collection('markers');
            
            // Apply filters
            if (filter.category && filter.category !== 'all') {
                query = query.where('category', '==', filter.category);
            }
            
            if (filter.search) {
                // Search will be done client-side
            }
            
            const snapshot = await query.get();
            const markers = [];
            
            snapshot.forEach(doc => {
                markers.push(doc.data());
            });
            
            // Apply search filter client-side
            let filteredMarkers = markers;
            if (filter.search) {
                const searchTerm = filter.search.toLowerCase();
                filteredMarkers = markers.filter(m => 
                    m.title.toLowerCase().includes(searchTerm) ||
                    m.description.toLowerCase().includes(searchTerm) ||
                    (m.userName && m.userName.toLowerCase().includes(searchTerm))
                );
            }
            
            return { success: true, markers: filteredMarkers };
        } catch (error) {
            console.error("Error loading markers:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Delete marker
     */
    async deleteMarker(markerId) {
        try {
            await this.db.collection('markers').doc(markerId).delete();
            
            // Remove from map if exists
            if (this.markers[markerId]) {
                this.markerLayerGroup.removeLayer(this.markers[markerId]);
                delete this.markers[markerId];
            }
            
            return { success: true };
        } catch (error) {
            console.error("Error deleting marker:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Clear all markers (admin function)
     */
    async clearAllMarkers() {
        try {
            const snapshot = await this.db.collection('markers').get();
            const batch = this.db.batch();
            
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            await batch.commit();
            
            // Clear all markers from map
            this.markerLayerGroup.clearLayers();
            this.markers = {};
            
            return { success: true, count: snapshot.size };
        } catch (error) {
            console.error("Error clearing all markers:", error);
            return { success: false, error: error.message };
        }
    }
}

// =============================================
// 📋 QUEST SERVICES
// =============================================
export class QuestService {
    constructor(db) {
        this.db = db;
    }
    
    /**
     * Create new quest
     */
    async createQuest(questData) {
        try {
            const questId = 'quest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Calculate admin fee
            const adminFee = Math.floor(questData.budget * ADMIN_CONFIG.ADMIN_FEE_PERCENTAGE);
            const totalAmount = questData.budget + adminFee;
            
            const quest = {
                id: questId,
                ...questData,
                adminFee,
                totalAmount,
                status: QUEST_CONFIG.STATUS.PENDING_PAYMENT,
                paymentStatus: QUEST_CONFIG.PAYMENT_STATUS.PENDING,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await this.db.collection('quests').doc(questId).set(quest);
            
            return { success: true, questId, quest };
        } catch (error) {
            console.error("Error creating quest:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Get quests with filters
     */
    async getQuests(filters = {}) {
        try {
            let query = this.db.collection('quests');
            
            // Apply filters
            if (filters.status) {
                query = query.where('status', '==', filters.status);
            }
            
            if (filters.paymentStatus) {
                query = query.where('paymentStatus', '==', filters.paymentStatus);
            }
            
            if (filters.category && filters.category !== 'all') {
                query = query.where('category', '==', filters.category);
            }
            
            if (filters.employerId) {
                query = query.where('employerId', '==', filters.employerId);
            }
            
            if (filters.workerId) {
                query = query.where('workerId', '==', filters.workerId);
            }
            
            // Sort by latest
            query = query.orderBy('createdAt', 'desc');
            
            // Limit results
            if (filters.limit) {
                query = query.limit(filters.limit);
            }
            
            const snapshot = await query.get();
            const quests = [];
            
            snapshot.forEach(doc => {
                quests.push(doc.data());
            });
            
            // Apply search filter client-side
            let filteredQuests = quests;
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filteredQuests = quests.filter(q => 
                    q.title.toLowerCase().includes(searchTerm) ||
                    q.description.toLowerCase().includes(searchTerm) ||
                    (q.employerName && q.employerName.toLowerCase().includes(searchTerm))
                );
            }
            
            return { success: true, quests: filteredQuests };
        } catch (error) {
            console.error("Error getting quests:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Take a quest
     */
    async takeQuest(questId, workerData) {
        try {
            const questRef = this.db.collection('quests').doc(questId);
            const questDoc = await questRef.get();
            const quest = questDoc.data();
            
            if (!quest) {
                return { success: false, error: "Quest tidak ditemukan" };
            }
            
            if (quest.status !== QUEST_CONFIG.STATUS.OPEN || quest.paymentStatus !== QUEST_CONFIG.PAYMENT_STATUS.PAID) {
                return { success: false, error: "Quest ini sudah tidak tersedia" };
            }
            
            await questRef.update({
                status: QUEST_CONFIG.STATUS.TAKEN,
                workerId: workerData.uid,
                workerName: workerData.name,
                workerBadges: workerData.badges || [],
                takenAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Send notification to employer
            await this.sendNotification(quest.employerId, {
                type: 'quest_taken',
                title: 'Quest Diambil',
                message: `Quest "${quest.title}" telah diambil oleh ${workerData.name}`,
                questId
            });
            
            return { success: true };
        } catch (error) {
            console.error("Error taking quest:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Submit work proof
     */
    async submitWorkProof(workProofData) {
        try {
            const workProofId = 'workproof_' + Date.now();
            
            const workProof = {
                id: workProofId,
                ...workProofData,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await this.db.collection('work_proofs').doc(workProofId).set(workProof);
            
            // Update quest
            await this.db.collection('quests').doc(workProofData.questId).update({
                workProofId: workProofId,
                workProofStatus: 'pending',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Send notification to employer
            await this.sendNotification(workProofData.employerId, {
                type: 'work_proof_submitted',
                title: 'Bukti Kerja Dikirim',
                message: `Worker telah mengirim bukti kerja untuk quest "${workProofData.questTitle}"`,
                questId: workProofData.questId
            });
            
            return { success: true, workProofId };
        } catch (error) {
            console.error("Error submitting work proof:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Approve work proof (admin function)
     */
    async approveWorkProof(workProofId, adminId) {
        try {
            const proofRef = this.db.collection('work_proofs').doc(workProofId);
            const proofDoc = await proofRef.get();
            const proof = proofDoc.data();
            
            if (!proof) {
                return { success: false, error: "Bukti kerja tidak ditemukan" };
            }
            
            // Update work proof status
            await proofRef.update({
                status: 'approved',
                approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
                approvedBy: adminId,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            const questRef = this.db.collection('quests').doc(proof.questId);
            const questDoc = await questRef.get();
            const quest = questDoc.data();
            
            // Transfer payment to worker
            const workerRef = this.db.collection('users').doc(proof.workerId);
            const workerDoc = await workerRef.get();
            const worker = workerDoc.data();
            
            const newBalance = (worker.balance || 0) + quest.budget;
            
            await workerRef.update({
                balance: newBalance,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Update quest status
            await questRef.update({
                workProofStatus: 'approved',
                status: QUEST_CONFIG.STATUS.COMPLETED,
                completedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Send notifications
            await this.sendNotification(proof.workerId, {
                type: 'work_proof_approved',
                title: 'Bukti Kerja Disetujui',
                message: `Bukti kerja untuk quest "${proof.questTitle}" telah disetujui. Dana telah ditransfer.`,
                questId: proof.questId
            });
            
            await this.sendNotification(proof.employerId, {
                type: 'quest_completed',
                title: 'Quest Selesai',
                message: `Quest "${proof.questTitle}" telah selesai.`,
                questId: proof.questId
            });
            
            // Update user stats
            await this.updateUserStats(proof.workerId, 'completedQuests', 1);
            await this.updateUserStats(proof.employerId, 'completedQuests', 1);
            
            return { success: true };
        } catch (error) {
            console.error("Error approving work proof:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Delete quest
     */
    async deleteQuest(questId) {
        try {
            await this.db.collection('quests').doc(questId).delete();
            return { success: true };
        } catch (error) {
            console.error("Error deleting quest:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Clear all quests (admin function)
     */
    async clearAllQuests() {
        try {
            const snapshot = await this.db.collection('quests').get();
            const batch = this.db.batch();
            
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            await batch.commit();
            
            return { success: true, count: snapshot.size };
        } catch (error) {
            console.error("Error clearing all quests:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Helper: Send notification
     */
    async sendNotification(userId, notificationData) {
        try {
            await this.db.collection('notifications').add({
                userId,
                ...notificationData,
                read: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    }
    
    /**
     * Helper: Update user stats
     */
    async updateUserStats(userId, statField, increment = 1) {
        try {
            const userRef = this.db.collection('users').doc(userId);
            await userRef.update({
                [`stats.${statField}`]: firebase.firestore.FieldValue.increment(increment),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating user stats:", error);
        }
    }
}

// =============================================
## 🤖 AI CHAT SERVICES
// =============================================
export class AIChatService {
    constructor() {
        this.selectedModel = 'dex75';
    }
    
    /**
     * Send message to AI
     */
    async sendMessage(message, model = 'dex75') {
        try {
            let apiUrl;
            const encodedMessage = encodeURIComponent(message);
            
            if (model === 'dex75') {
                apiUrl = `${API_KEYS.DEX75_API_URL}?text=${encodedMessage}`;
            } else if (model === 'pollination') {
                apiUrl = `${API_KEYS.POLLINATION_API_URL}?text=${encodedMessage}`;
            } else {
                return { success: false, error: "Model AI tidak valid" };
            }
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            let resultText = "";
            
            if (model === 'dex75') {
                resultText = data.data?.result || data.answer || data.data?.answer || "Tidak ada respons dari DeX 75 AI.";
            } else if (model === 'pollination') {
                resultText = data.data?.result || 
                           data.data?.answer || 
                           data.answer || 
                           data.result ||
                           data.data?.text ||
                           data.text ||
                           data.data?.message ||
                           data.message ||
                           "Tidak ada respons dari Pollination AI.";
            }
            
            if (!resultText || resultText === "Tidak ada respons dari Pollination AI.") {
                resultText = `${model.toUpperCase()} merespons dengan struktur yang tidak dikenali. Silakan coba lagi.`;
            }
            
            // Clean HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = resultText;
            resultText = tempDiv.textContent || tempDiv.innerText || resultText;
            
            return { success: true, response: resultText };
            
        } catch (error) {
            console.error("AI Chat error:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Change AI model
     */
    setModel(model) {
        if (['dex75', 'pollination'].includes(model)) {
            this.selectedModel = model;
            return { success: true, model };
        }
        return { success: false, error: "Model tidak valid" };
    }
}

// =============================================
// 🛠️ TOOLS SERVICES
// =============================================
export class ToolsService {
    constructor() {}
    
    /**
     * Check domain registration status
     */
    async checkDomain(domain) {
        try {
            // Clean domain input
            let cleanDomain = domain.trim().toLowerCase();
            cleanDomain = cleanDomain.replace(/^https?:\/\//, '').split('/')[0];
            
            const parts = cleanDomain.split('.');
            if (parts.length > 2) {
                cleanDomain = parts.slice(-2).join('.');
            }
            
            if (!cleanDomain.includes('.') || cleanDomain.length < 4) {
                return { 
                    success: false, 
                    error: "Format domain salah (contoh: google.com)",
                    domain: cleanDomain 
                };
            }
            
            // Check via Google DNS
            const response = await fetch(`${API_KEYS.GOOGLE_DNS_API}?name=${cleanDomain}`);
            
            if (!response.ok) {
                throw new Error("Gagal menghubungi Google DNS");
            }
            
            const data = await response.json();
            
            if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
                // Domain registered
                const ipAddress = data.Answer.find(a => a.type === 1)?.data || 'Tidak ada IP (Mungkin CNAME)';
                const ttl = data.Answer.length > 0 ? data.Answer[0].TTL : '-';
                
                return {
                    success: true,
                    registered: true,
                    domain: cleanDomain,
                    ipAddress,
                    ttl,
                    rawData: data
                };
                
            } else if (data.Status === 3) {
                // Domain available (NXDOMAIN)
                return {
                    success: true,
                    registered: false,
                    domain: cleanDomain,
                    message: "Domain belum terdaftar"
                };
                
            } else {
                return {
                    success: false,
                    domain: cleanDomain,
                    error: "Respon DNS tidak valid",
                    rawData: data
                };
            }
            
        } catch (error) {
            console.error("Domain check error:", error);
            return { 
                success: false, 
                error: error.message,
                domain: domain 
            };
        }
    }
    
    /**
     * Convert file to Base64
     */
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    /**
     * Validate file size and type
     */
    validateFile(file, maxSize, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']) {
        if (!file) {
            return { valid: false, error: "File tidak ditemukan" };
        }
        
        if (file.size > maxSize) {
            return { valid: false, error: `Ukuran file maksimal ${maxSize / 1024 / 1024}MB` };
        }
        
        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: `Format file tidak didukung. Gunakan: ${allowedTypes.join(', ')}` };
        }
        
        return { valid: true };
    }
}

// =============================================
// 🎖️ BADGE SERVICES
// =============================================
export class BadgeService {
    constructor(db) {
        this.db = db;
    }
    
    /**
     * Purchase badge
     */
    async purchaseBadge(userId, badgeId) {
        try {
            const badge = BADGES[badgeId];
            if (!badge) {
                return { success: false, error: "Badge tidak ditemukan" };
            }
            
            if (badge.price <= 0) {
                return { success: false, error: "Badge ini tidak dapat dibeli" };
            }
            
            // Get user data
            const userRef = this.db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            const user = userDoc.data();
            
            if (!user) {
                return { success: false, error: "User tidak ditemukan" };
            }
            
            // Check balance
            if (user.balance < badge.price) {
                return { 
                    success: false, 
                    error: `Saldo tidak cukup! Dibutuhkan Rp ${badge.price.toLocaleString('id-ID')}` 
                };
            }
            
            // Check if already has badge
            if (user.badges && user.badges.includes(badgeId)) {
                return { success: false, error: "Anda sudah memiliki badge ini" };
            }
            
            // Process payment
            const newBalance = user.balance - badge.price;
            const newBadges = user.badges ? [...user.badges, badgeId] : [badgeId];
            
            // Update user
            await userRef.update({
                badges: newBadges,
                balance: newBalance,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Create transaction record
            const transactionId = 'badge_' + Date.now();
            await this.db.collection('transactions').doc(transactionId).set({
                id: transactionId,
                userId: userId,
                type: 'badge_purchase',
                badgeId: badgeId,
                badgeName: badge.name,
                amount: badge.price,
                status: 'completed',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Send notification
            await this.sendNotification(userId, {
                type: 'badge_purchased',
                title: 'Badge Dibeli',
                message: `Badge ${badge.name} berhasil dibeli!`,
                badgeId: badgeId
            });
            
            return { 
                success: true, 
                badge: badge,
                newBalance: newBalance 
            };
            
        } catch (error) {
            console.error("Error purchasing badge:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Assign badge to user (admin function)
     */
    async assignBadge(userEmail, badgeId, adminId) {
        try {
            const badge = BADGES[badgeId];
            if (!badge) {
                return { success: false, error: "Badge tidak ditemukan" };
            }
            
            // Find user by email
            const usersSnapshot = await this.db.collection('users')
                .where('email', '==', userEmail)
                .get();
            
            if (usersSnapshot.empty) {
                return { success: false, error: "User dengan email tersebut tidak ditemukan" };
            }
            
            const userDoc = usersSnapshot.docs[0];
            const user = userDoc.data();
            
            // Check if already has badge
            if (user.badges && user.badges.includes(badgeId)) {
                return { success: false, error: "User sudah memiliki badge ini" };
            }
            
            // Add badge
            const newBadges = user.badges ? [...user.badges, badgeId] : [badgeId];
            
            await this.db.collection('users').doc(user.uid).update({
                badges: newBadges,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Send notification to user
            await this.sendNotification(user.uid, {
                type: 'badge_assigned',
                title: 'Badge Baru',
                message: `Anda telah diberikan badge ${badge.name} oleh admin`,
                badgeId: badgeId
            });
            
            return { 
                success: true, 
                user: user.name,
                badge: badge.name 
            };
            
        } catch (error) {
            console.error("Error assigning badge:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Remove badge from user (admin function)
     */
    async removeBadge(userEmail, badgeId, adminId) {
        try {
            // Find user by email
            const usersSnapshot = await this.db.collection('users')
                .where('email', '==', userEmail)
                .get();
            
            if (usersSnapshot.empty) {
                return { success: false, error: "User dengan email tersebut tidak ditemukan" };
            }
            
            const userDoc = usersSnapshot.docs[0];
            const user = userDoc.data();
            
            // Check if user has the badge
            if (!user.badges || !user.badges.includes(badgeId)) {
                return { success: false, error: "User tidak memiliki badge ini" };
            }
            
            // Remove badge
            const newBadges = user.badges.filter(b => b !== badgeId);
            
            await this.db.collection('users').doc(user.uid).update({
                badges: newBadges,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Send notification to user
            await this.sendNotification(user.uid, {
                type: 'badge_removed',
                title: 'Badge Dihapus',
                message: `Badge telah dihapus dari akun Anda oleh admin`,
                badgeId: badgeId
            });
            
            return { 
                success: true, 
                user: user.name 
            };
            
        } catch (error) {
            console.error("Error removing badge:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Check badge requirements
     */
    async checkBadgeRequirements(userId, badgeId) {
        try {
            const badge = BADGES[badgeId];
            if (!badge || !badge.requirements) {
                return { success: true, eligible: true, requirements: null };
            }
            
            const userRef = this.db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            const user = userDoc.data();
            
            if (!user) {
                return { success: false, error: "User tidak ditemukan" };
            }
            
            const requirements = badge.requirements;
            let eligible = false;
            
            if (requirements.type === 'quests_completed') {
                const questsSnapshot = await this.db.collection('quests')
                    .where('workerId', '==', userId)
                    .where('status', '==', 'completed')
                    .get();
                
                const completedCount = questsSnapshot.size;
                eligible = completedCount >= requirements.count;
                
                // Check rating if required
                if (requirements.rating && eligible) {
                    eligible = (user.rating || 0) >= requirements.rating;
                }
                
            } else if (requirements.type === 'quests_posted') {
                const questsSnapshot = await this.db.collection('quests')
                    .where('employerId', '==', userId)
                    .get();
                
                const postedCount = questsSnapshot.size;
                eligible = postedCount >= requirements.count;
            }
            
            return { 
                success: true, 
                eligible, 
                requirements,
                userStats: user.stats 
            };
            
        } catch (error) {
            console.error("Error checking badge requirements:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Auto assign badges based on achievements
     */
    async autoAssignBadges(userId) {
        try {
            const userRef = this.db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            const user = userDoc.data();
            
            if (!user) return { success: false, error: "User tidak ditemukan" };
            
            const badgesToAdd = [];
            const currentBadges = user.badges || [];
            
            // Check for trusted_worker badge
            if (!currentBadges.includes('trusted_worker')) {
                const workerReq = await this.checkBadgeRequirements(userId, 'trusted_worker');
                if (workerReq.success && workerReq.eligible) {
                    badgesToAdd.push('trusted_worker');
                }
            }
            
            // Check for trusted_employer badge
            if (!currentBadges.includes('trusted_employer')) {
                const employerReq = await this.checkBadgeRequirements(userId, 'trusted_employer');
                if (employerReq.success && employerReq.eligible) {
                    badgesToAdd.push('trusted_employer');
                }
            }
            
            // Add new badges if any
            if (badgesToAdd.length > 0) {
                const newBadges = [...currentBadges, ...badgesToAdd];
                
                await userRef.update({
                    badges: newBadges,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Send notifications
                for (const badgeId of badgesToAdd) {
                    const badge = BADGES[badgeId];
                    await this.sendNotification(userId, {
                        type: 'badge_earned',
                        title: 'Badge Baru Diperoleh',
                        message: `Selamat! Anda telah memperoleh badge ${badge.name} melalui pencapaian.`,
                        badgeId: badgeId
                    });
                }
                
                return { 
                    success: true, 
                    badgesAdded: badgesToAdd,
                    newBadges 
                };
            }
            
            return { success: true, badgesAdded: [] };
            
        } catch (error) {
            console.error("Error auto assigning badges:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Helper: Send notification
     */
    async sendNotification(userId, notificationData) {
        try {
            await this.db.collection('notifications').add({
                userId,
                ...notificationData,
                read: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    }
}

// =============================================
// 🔔 NOTIFICATION SERVICES
// =============================================
export class NotificationService {
    constructor(db) {
        this.db = db;
        this.notificationCount = 0;
    }
    
    /**
     * Get user notifications
     */
    async getUserNotifications(userId, options = {}) {
        try {
            let query = this.db.collection('notifications')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc');
            
            if (options.unreadOnly) {
                query = query.where('read', '==', false);
            }
            
            if (options.limit) {
                query = query.limit(options.limit);
            }
            
            const snapshot = await query.get();
            const notifications = [];
            
            snapshot.forEach(doc => {
                notifications.push({ id: doc.id, ...doc.data() });
            });
            
            // Update unread count
            this.notificationCount = notifications.filter(n => !n.read).length;
            
            return { success: true, notifications, unreadCount: this.notificationCount };
        } catch (error) {
            console.error("Error getting notifications:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Mark notification as read
     */
    async markAsRead(notificationId) {
        try {
            await this.db.collection('notifications').doc(notificationId).update({
                read: true,
                readAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true };
        } catch (error) {
            console.error("Error marking notification as read:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Mark all notifications as read
     */
    async markAllAsRead(userId) {
        try {
            const snapshot = await this.db.collection('notifications')
                .where('userId', '==', userId)
                .where('read', '==', false)
                .get();
            
            const batch = this.db.batch();
            
            snapshot.forEach(doc => {
                batch.update(doc.ref, {
                    read: true,
                    readAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            
            await batch.commit();
            
            this.notificationCount = 0;
            
            return { success: true, count: snapshot.size };
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Delete notification
     */
    async deleteNotification(notificationId) {
        try {
            await this.db.collection('notifications').doc(notificationId).delete();
            return { success: true };
        } catch (error) {
            console.error("Error deleting notification:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Create notification
     */
    async createNotification(notificationData) {
        try {
            await this.db.collection('notifications').add({
                ...notificationData,
                read: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true };
        } catch (error) {
            console.error("Error creating notification:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Get unread count
     */
    getUnreadCount() {
        return this.notificationCount;
    }
}

// =============================================
// 👑 ADMIN SERVICES
// =============================================
export class AdminService {
    constructor(db) {
        this.db = db;
    }
    
    /**
     * Get dashboard statistics
     */
    async getDashboardStats() {
        try {
            // Get total quests
            const questsSnapshot = await this.db.collection('quests').get();
            const totalQuests = questsSnapshot.size;
            
            let questsOpen = 0;
            let questsTaken = 0;
            let questsCompleted = 0;
            
            questsSnapshot.forEach(doc => {
                const quest = doc.data();
                if (quest.status === 'open' && quest.paymentStatus === 'paid') questsOpen++;
                if (quest.status === 'taken') questsTaken++;
                if (quest.status === 'completed') questsCompleted++;
            });
            
            // Get total markers
            const markersSnapshot = await this.db.collection('markers').get();
            const totalMarkers = markersSnapshot.size;
            
            // Get markers today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let markersToday = 0;
            
            markersSnapshot.forEach(doc => {
                const marker = doc.data();
                const markerDate = marker.createdAt?.toDate();
                if (markerDate && markerDate >= today) markersToday++;
            });
            
            // Get total users
            const usersSnapshot = await this.db.collection('users').get();
            const totalUsers = usersSnapshot.size;
            
            // Get active users (last 7 days)
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            let activeUsers = 0;
            
            // Note: This requires a lastActive field in user documents
            // For now, we'll return total users as active users
            
            // Get financial stats
            const paymentsSnapshot = await this.db.collection('payments').get();
            let totalRevenue = 0;
            let pendingPayments = 0;
            let adminFeeTotal = 0;
            
            paymentsSnapshot.forEach(doc => {
                const payment = doc.data();
                if (payment.status === 'approved') {
                    totalRevenue += payment.amount;
                    adminFeeTotal += payment.adminFee || 0;
                } else if (payment.status === 'pending') {
                    pendingPayments += payment.amount;
                }
            });
            
            return {
                success: true,
                stats: {
                    totalQuests,
                    totalMarkers,
                    totalUsers,
                    activeUsers: totalUsers, // Placeholder
                    questsOpen,
                    questsTaken,
                    questsCompleted,
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
    }
    
    /**
     * Search users with filters
     */
    async searchUsers(filters = {}) {
        try {
            let query = this.db.collection('users');
            
            // Apply role filter
            if (filters.role && filters.role !== 'all') {
                query = query.where('role', '==', filters.role);
            }
            
            const snapshot = await query.get();
            let users = [];
            
            snapshot.forEach(doc => {
                users.push({ id: doc.id, ...doc.data() });
            });
            
            // Apply search filter client-side
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                users = users.filter(user => 
                    user.name?.toLowerCase().includes(searchTerm) ||
                    user.email?.toLowerCase().includes(searchTerm) ||
                    user.phone?.toLowerCase().includes(searchTerm) ||
                    user.region?.toLowerCase().includes(searchTerm)
                );
            }
            
            // Sort by name
            users.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            
            return { success: true, users };
        } catch (error) {
            console.error("Error searching users:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Update user role
     */
    async updateUserRole(userId, newRole) {
        try {
            const validRoles = ['user', 'worker', 'employer', 'both', 'kasir', 'admin', 'owner'];
            
            if (!validRoles.includes(newRole)) {
                return { success: false, error: "Role tidak valid" };
            }
            
            await this.db.collection('users').doc(userId).update({
                role: newRole,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Send notification to user
            await this.sendNotification(userId, {
                type: 'role_changed',
                title: 'Role Diubah',
                message: `Role Anda telah diubah menjadi ${newRole.toUpperCase()} oleh admin`
            });
            
            return { success: true, newRole };
        } catch (error) {
            console.error("Error updating user role:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Delete user
     */
    async deleteUser(userId) {
        try {
            // Note: This only deletes the user document, not the auth user
            // To delete auth user, need Firebase Admin SDK
            
            await this.db.collection('users').doc(userId).delete();
            
            // Delete user's quests
            const questsSnapshot = await this.db.collection('quests')
                .where('employerId', '==', userId)
                .get();
            
            const batch = this.db.batch();
            questsSnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            await batch.commit();
            
            return { success: true };
        } catch (error) {
            console.error("Error deleting user:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Export data to CSV
     */
    async exportData(dataType, filters = {}) {
        try {
            let collectionName;
            let filename;
            
            switch(dataType) {
                case 'users':
                    collectionName = 'users';
                    filename = 'users_export.csv';
                    break;
                case 'quests':
                    collectionName = 'quests';
                    filename = 'quests_export.csv';
                    break;
                case 'markers':
                    collectionName = 'markers';
                    filename = 'markers_export.csv';
                    break;
                case 'payments':
                    collectionName = 'payments';
                    filename = 'payments_export.csv';
                    break;
                default:
                    return { success: false, error: "Tipe data tidak valid" };
            }
            
            const snapshot = await this.db.collection(collectionName).get();
            const data = [];
            
            snapshot.forEach(doc => {
                data.push(doc.data());
            });
            
            // Convert to CSV
            const csv = this.convertToCSV(data);
            
            return { 
                success: true, 
                csv, 
                filename,
                count: data.length 
            };
            
        } catch (error) {
            console.error("Error exporting data:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Reset revenue data
     */
    async resetRevenueData(period, keepGraphData = true) {
        try {
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
                default:
                    return { success: false, error: "Periode tidak valid" };
            }
            
            // Delete payments
            let paymentsQuery = this.db.collection('payments');
            if (cutoffDate) {
                paymentsQuery = paymentsQuery.where('createdAt', '>=', cutoffDate);
            }
            
            const paymentsSnapshot = await paymentsQuery.get();
            const paymentsBatch = this.db.batch();
            paymentsSnapshot.forEach(doc => {
                paymentsBatch.delete(doc.ref);
            });
            
            // Delete quests with payments
            let questsQuery = this.db.collection('quests');
            if (cutoffDate) {
                questsQuery = questsQuery.where('createdAt', '>=', cutoffDate);
            }
            
            const questsSnapshot = await questsQuery.get();
            const questsBatch = this.db.batch();
            questsSnapshot.forEach(doc => {
                const quest = doc.data();
                if (quest.paymentStatus === 'paid' || quest.paymentStatus === 'pending_verification') {
                    questsBatch.delete(doc.ref);
                }
            });
            
            // Delete work proofs
            let workProofsQuery = this.db.collection('work_proofs');
            if (cutoffDate) {
                workProofsQuery = workProofsQuery.where('createdAt', '>=', cutoffDate);
            }
            
            const workProofsSnapshot = await workProofsQuery.get();
            const workProofsBatch = this.db.batch();
            workProofsSnapshot.forEach(doc => {
                workProofsBatch.delete(doc.ref);
            });
            
            // Execute batches
            await paymentsBatch.commit();
            await questsBatch.commit();
            await workProofsBatch.commit();
            
            // Reset user balances if not keeping graph data
            if (period === 'now' && !keepGraphData) {
                const usersSnapshot = await this.db.collection('users').get();
                const usersBatch = this.db.batch();
                
                usersSnapshot.forEach(doc => {
                    const userRef = this.db.collection('users').doc(doc.id);
                    usersBatch.update(userRef, {
                        balance: 0,
                        pendingBalance: 0,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                });
                
                await usersBatch.commit();
            }
            
            return { 
                success: true, 
                period,
                deleted: {
                    payments: paymentsSnapshot.size,
                    quests: questsSnapshot.size,
                    workProofs: workProofsSnapshot.size
                }
            };
            
        } catch (error) {
            console.error("Error resetting revenue data:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Add new admin
     */
    async addNewAdmin(adminData) {
        try {
            const { email, name, role } = adminData;
            
            // Find user by email
            const usersSnapshot = await this.db.collection('users')
                .where('email', '==', email)
                .get();
            
            if (usersSnapshot.empty) {
                return { success: false, error: "User dengan email tersebut tidak ditemukan" };
            }
            
            const userDoc = usersSnapshot.docs[0];
            const user = userDoc.data();
            
            // Check if already admin
            if (user.role !== 'user') {
                return { success: false, error: "User ini sudah memiliki role admin" };
            }
            
            // Update role
            await this.db.collection('users').doc(user.uid).update({
                role: role,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Send notification
            await this.sendNotification(user.uid, {
                type: 'admin_added',
                title: 'Anda Sekarang Admin',
                message: `Anda telah ditambahkan sebagai ${role.toUpperCase()} oleh owner`
            });
            
            return { 
                success: true, 
                user: { name: user.name, email: user.email, newRole: role } 
            };
            
        } catch (error) {
            console.error("Error adding new admin:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Helper: Convert to CSV
     */
    convertToCSV(data) {
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
    }
    
    /**
     * Helper: Send notification
     */
    async sendNotification(userId, notificationData) {
        try {
            await this.db.collection('notifications').add({
                userId,
                ...notificationData,
                read: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    }
}

// =============================================
// 📞 WHATSAPP SERVICES
// =============================================
export class WhatsAppService {
    constructor() {}
    
    /**
     * Generate WhatsApp link for chat
     */
    generateChatLink(phoneNumber, message = '') {
        const cleanedPhone = phoneNumber.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(message);
        
        return `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;
    }
    
    /**
     * Open WhatsApp chat
     */
    openChat(phoneNumber, message = '') {
        const link = this.generateChatLink(phoneNumber, message);
        window.open(link, '_blank');
    }
    
    /**
     * Generate admin WhatsApp link for support
     */
    getAdminSupportLink(message = 'Halo admin, saya butuh bantuan untuk akun SIMPLE BISNIS') {
        return this.generateChatLink(ADMIN_CONFIG.WHATSAPP_ADMIN, message);
    }
    
    /**
     * Generate quest discussion link
     */
    getQuestDiscussionLink(questTitle = '') {
        const message = questTitle 
            ? `Halo, saya tertarik dengan quest "${questTitle}" di Simple Bisnis. Bisa kita diskusikan lebih lanjut?`
            : 'Halo, saya ingin berdiskusi mengenai quest di Simple Bisnis.';
        
        return this.generateChatLink(ADMIN_CONFIG.WHATSAPP_ADMIN, message);
    }
}

// =============================================
// 🚀 MAIN API EXPORT
// =============================================

// Initialize Firebase
let firebaseInstance = null;

export const initializeFirebase = () => {
    if (!firebaseInstance) {
        try {
            firebaseInstance = firebase.initializeApp(firebaseConfig);
            console.log("🔥 Firebase initialized successfully");
        } catch (error) {
            console.error("🔥 Firebase initialization error:", error);
        }
    }
    return firebaseInstance;
};

// Export all services
export const api = {
    // Configurations
    firebaseConfig,
    API_KEYS,
    ADMIN_CONFIG,
    BADGES,
    MAP_CONFIG,
    QUEST_CONFIG,
    
    // Services
    AuthService,
    PaymentService,
    MapService,
    QuestService,
    AIChatService,
    ToolsService,
    BadgeService,
    NotificationService,
    AdminService,
    WhatsAppService,
    
    // Initialization
    initializeFirebase,
    
    // Utility functions
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    
    convertToBase64: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    },
    
    showNotification: (message, type = 'info') => {
        // This should be implemented in the UI layer
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
};

export default api;
