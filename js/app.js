// =========================================
// 1. LOCAL STORAGE MANAGER (No Database/Server)
// =========================================
const Storage = {
    // Fungsi untuk menyimpan data ke memori HP
    save: (key, data) => localStorage.setItem(`lovely_doll_${key}`, JSON.stringify(data)),
    
    // Fungsi untuk memanggil data dari memori HP
    load: (key, defaultData) => {
        const data = localStorage.getItem(`lovely_doll_${key}`);
        return data ? JSON.parse(data) : defaultData;
    }
};

// =========================================
// 2. GLOBAL GAME STATE
// =========================================
// Semua data permainan pemain disimpan di sini secara real-time
const GameState = {
    coins: Storage.load('coins', 0),
    gender: 'female', // Default pilihan karakter
    inventory: Storage.load('inventory', []), // Item yang sudah dibeli/dimiliki
    achievements: Storage.load('achievements', []),
    favorites: Storage.load('favorites', []), // Menyimpan outfit favorit
    lastDailyGift: Storage.load('lastDailyGift', null) // Berdasarkan tanggal HP
};

// =========================================
// 3. AUDIO ENGINE
// =========================================
const AudioEngine = {
    bgm: document.getElementById('bgm'),
    sfx: document.getElementById('sfx-click'),
    
    playBGM: function() {
        this.bgm.volume = 0.3; // Volume soft & cozy
        // Try/Catch untuk menangani kebijakan browser (Auto-play policy)
        this.bgm.play().catch(e => console.log("BGM menunggu interaksi pemain."));
    },
    
    playClick: function() {
        this.sfx.currentTime = 0; // Reset suara agar bisa ditekan berulang cepat
        this.sfx.volume = 0.6;
        this.sfx.play().catch(e => {});
    }
};

// =========================================
// 4. PWA & APP INITIALIZATION
// =========================================
const App = {
    init: function() {
        this.registerServiceWorker();
        this.simulateLoading();
        this.bindGlobalEvents();
        this.updateUI();
    },

    // Mendaftarkan PWA agar bisa di-install dan offline
    registerServiceWorker: function() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./service-worker.js')
                    .then(reg => console.log('PWA Service Worker Ready!', reg))
                    .catch(err => console.error('PWA Registration Failed', err));
            });
        }
    },

    // Animasi Loading Screen yang Aesthetic
    simulateLoading: function() {
        const loadingFill = document.querySelector('.loading-fill');
        let progress = 0;
        
        const interval = setInterval(() => {
            // Kecepatan loading acak agar terasa natural
            progress += Math.floor(Math.random() * 25) + 10;
            if (progress > 100) progress = 100;
            loadingFill.style.width = `${progress}%`;
            
            if (progress === 100) {
                clearInterval(interval);
                // Jeda sebentar sebelum masuk Main Menu agar transisi mulus
                setTimeout(() => this.showScreen('main-menu'), 600);
            }
        }, 300);
    },

    // Sistem Navigasi Layar
    showScreen: function(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });
        const target = document.getElementById(screenId);
        target.classList.remove('hidden');
        target.classList.add('active');
    },

    // Event Global untuk seluruh tombol dan interaksi pertama
    bindGlobalEvents: function() {
        // Tambahkan efek suara ke setiap tombol yang ada
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => AudioEngine.playClick());
        });

        // Mainkan musik latar saat pemain pertama kali menyentuh layar
        document.body.addEventListener('click', () => {
            if (AudioEngine.bgm.paused) AudioEngine.playBGM();
        }, { once: true });
    },

    // Update elemen UI dasar (seperti Koin)
    updateUI: function() {
        const coinCount = document.getElementById('coin-count');
        if (coinCount) coinCount.innerText = GameState.coins;
    }
};

// =========================================
// 5. RUN APPLICATION & GLOBAL FUNCTIONS
// =========================================

// Jalankan App saat seluruh dokumen HTML selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Fungsi yang dipanggil dari index.html saat memilih karakter
window.startGame = function(gender) {
    GameState.gender = gender;
    App.showScreen('game-screen');
    
    // Nanti akan memicu render karakter di file game.js
    if (typeof GameController !== 'undefined') {
        GameController.initCharacter();
    }
};
