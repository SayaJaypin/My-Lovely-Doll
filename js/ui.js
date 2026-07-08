// =========================================
// UI MANAGER: Menangani semua interaksi layar
// =========================================

const UIManager = {
    init: function() {
        this.bindBottomSheet();
        this.bindPhotoMode();
        this.bindSkincareGame();
        this.bindNavigation();
    },

    // 1. Logika Bottom Sheet (Lemari Pakaian)
    bindBottomSheet: function() {
        const tabs = document.querySelectorAll('.tab-btn');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                // Hapus state aktif dari semua tab
                tabs.forEach(t => t.classList.remove('active'));
                // Tambahkan state aktif ke tab yang ditekan
                e.currentTarget.classList.add('active');
                
                const targetCategory = e.currentTarget.getAttribute('data-target');
                
                // Minta GameController merender item sesuai kategori (akan dibuat di Tahap 5)
                if (typeof GameController !== 'undefined') {
                    GameController.renderItems(targetCategory);
                }
            });
        });
    },

    // 2. Logika Mode Foto (Simulasi Kamera Smartphone)
    bindPhotoMode: function() {
        const btnPhoto = document.getElementById('btn-photo');
        const photoUI = document.getElementById('photo-mode-ui');
        const btnCloseCam = document.querySelector('.btn-close-cam');
        const shutterBtn = document.querySelector('.shutter-btn');
        const lensBtns = document.querySelectorAll('.lens-btn');
        const dollCanvas = document.getElementById('doll-svg');

        // Buka Kamera
        btnPhoto.addEventListener('click', () => {
            photoUI.classList.remove('hidden');
            document.querySelector('.glass-ui-top').style.display = 'none';
            document.querySelector('.glass-ui-right').style.display = 'none';
            document.querySelector('.bottom-sheet').classList.add('closed');
        });

        // Tutup Kamera
        btnCloseCam.addEventListener('click', () => {
            photoUI.classList.add('hidden');
            document.querySelector('.glass-ui-top').style.display = 'flex';
            document.querySelector('.glass-ui-right').style.display = 'flex';
            document.querySelector('.bottom-sheet').classList.remove('closed');
            dollCanvas.style.transform = 'scale(1) perspective(none) rotateX(0)'; // Reset Lensa
            
            // Reset state tombol lensa ke 1x
            lensBtns.forEach(b => b.classList.remove('active'));
            lensBtns[1].classList.add('active');
        });

        // Ganti Lensa (Efek visual)
        lensBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                lensBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                if (e.target.innerText === '0.5x') {
                    // Memberikan ruang yang lebih luas dan sedikit distorsi perspektif
                    dollCanvas.style.transform = 'scale(0.8) perspective(800px) rotateX(4deg)';
                } else {
                    dollCanvas.style.transform = 'scale(1) perspective(none) rotateX(0)';
                }
            });
        });

        // Jepret Foto
        shutterBtn.addEventListener('click', () => {
            // Efek Flash Kamera
            const flash = document.createElement('div');
            flash.style.position = 'absolute';
            flash.style.inset = '0';
            flash.style.backgroundColor = 'white';
            flash.style.zIndex = '9999';
            flash.style.transition = 'opacity 0.4s ease-out';
            document.body.appendChild(flash);
            
            // Trigger Flash & SFX
            if(typeof AudioEngine !== 'undefined') AudioEngine.playClick();
            
            setTimeout(() => flash.style.opacity = '0', 50);
            setTimeout(() => flash.remove(), 450);

            // Simpan gambar
            this.takeScreenshot();
        });
    },

    // Merender SVG menjadi File PNG murni menggunakan Canvas API
    takeScreenshot: function() {
        const svgElement = document.getElementById('doll-svg');
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Resolusi tinggi
        canvas.width = 1000;
        canvas.height = 1600;
        
        const img = new Image();
        // Konversi SVG ke Base64
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        
        img.onload = function() {
            // Beri warna latar belakang fallback
            ctx.fillStyle = '#ffe4e1';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Download file
            const a = document.createElement('a');
            a.download = `Lovely_Doll_${new Date().getTime()}.png`;
            a.href = canvas.toDataURL('image/png');
            a.click();
        };
    },

    // 3. Logika Skincare Mini Game
    bindSkincareGame: function() {
        const btnSkincare = document.getElementById('btn-skincare');
        const steps = ['Cuci Muka 💧', 'Facial Foam 🧼', 'Toner 🌸', 'Serum 💧', 'Moisturizer 🧴', 'Sunscreen ☀️'];
        let currentStep = 0;

        btnSkincare.addEventListener('click', () => {
            if (currentStep < steps.length) {
                this.showFloatingText(steps[currentStep]);
                this.createParticles('bubble', 15);
                currentStep++;
                
                if (currentStep === steps.length) {
                    setTimeout(() => {
                        this.showFloatingText("GLOWING! ✨💖");
                        this.createParticles('sparkle', 30);
                        currentStep = 0; // Reset
                        
                        // Berikan Koin
                        if (typeof GameState !== 'undefined') {
                            GameState.coins += 50;
                            App.updateUI();
                        }
                    }, 1000);
                }
            }
        });
    },

    // Utilitas Animasi Teks Mengambang
    showFloatingText: function(text) {
        const el = document.createElement('div');
        el.innerText = text;
        el.style.position = 'absolute';
        el.style.top = '40%';
        el.style.left = '50%';
        el.style.transform = 'translate(-50%, -50%)';
        el.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        el.style.padding = '12px 24px';
        el.style.borderRadius = '30px';
        el.style.fontWeight = 'bold';
        el.style.fontSize = '1.2rem';
        el.style.color = '#ff7b89';
        el.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
        el.style.zIndex = '100';
        el.style.animation = 'floatUpFade 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards';
        
        document.getElementById('doll-canvas-container').appendChild(el);
        
        // Inject Keyframes secara dinamis untuk efisiensi
        if (!document.getElementById('anim-floatupfade')) {
            const style = document.createElement('style');
            style.id = 'anim-floatupfade';
            style.innerHTML = `
                @keyframes floatUpFade {
                    0% { opacity: 0; transform: translate(-50%, 20px) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                    30% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -70%); }
                    100% { opacity: 0; transform: translate(-50%, -100%); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => el.remove(), 1200);
    },

    // Utilitas Partikel (Gelembung & Bintang)
    createParticles: function(type, count) {
        const container = document.getElementById('particle-container');
        for(let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}`;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            if (type === 'bubble') {
                particle.style.width = particle.style.height = (Math.random() * 25 + 10) + 'px';
                particle.style.backgroundColor = 'rgba(255,255,255,0.7)';
                particle.style.boxShadow = 'inset 0 0 10px rgba(255,255,255,1)';
                particle.style.border = '1px solid rgba(255,255,255,0.9)';
            } else { // Sparkle
                particle.style.width = particle.style.height = (Math.random() * 15 + 8) + 'px';
                particle.style.backgroundColor = '#FFD700';
                particle.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            }
            
            particle.style.animation = `floatUpFade ${Math.random() * 1.5 + 1}s ease forwards`;
            container.appendChild(particle);
            
            // Bersihkan DOM
            setTimeout(() => particle.remove(), 2500);
        }
    },

    // 4. Tombol Navigasi Umum
    bindNavigation: function() {
        document.getElementById('btn-home').addEventListener('click', () => {
            if(typeof App !== 'undefined') App.showScreen('main-menu');
        });
        
        document.getElementById('btn-random').addEventListener('click', () => {
            if (typeof GameController !== 'undefined') GameController.randomizeLook();
        });
    }
};

// Inisialisasi UI Manager setelah DOM dimuat
document.addEventListener('DOMContentLoaded', () => {
    UIManager.init();
});
