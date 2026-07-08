// =========================================
// GAME CONTROLLER & SVG ASSET GENERATOR
// =========================================

const GameController = {
    // Menyimpan state outfit karakter yang sedang dipakai saat ini
    currentOutfit: {
        hair: 'hair1',
        clothes: 'clothes1',
        face: 'face1',
        bg: 'bg1'
    },

    initCharacter: function() {
        this.renderCharacterSVG();
        // Set tab pertama ke 'hair' saat karakter diload
        this.renderItems('hair');
        
        // Cek Daily Gift (Mekanisme Offline menggunakan Tanggal HP)
        this.checkDailyGift();
    },

    // 1. SISTEM DAILY GIFT OFFLINE
    checkDailyGift: function() {
        const today = new Date().toDateString(); // Contoh: "Thu Jul 09 2026"
        if (GameState.lastDailyGift !== today) {
            GameState.coins += 100;
            GameState.lastDailyGift = today;
            Storage.save('coins', GameState.coins);
            Storage.save('lastDailyGift', GameState.lastDailyGift);
            
            App.updateUI();
            
            // Notifikasi Daily Gift menggunakan sistem popup bawaan browser untuk kemudahan
            setTimeout(() => {
                alert("✨ Hore! Kamu mendapat 100 Koin Daily Gift! ✨");
            }, 1000);
        }
    },

    // 2. RENDERING KARAKTER SVG
    renderCharacterSVG: function() {
        const canvas = document.getElementById('doll-svg');
        const isMale = GameState.gender === 'male';
        
        // Pilihan Warna Dasar (Skintone)
        const skinTone = '#FFE0BD'; 
        const strokeColor = '#333333';

        // Base Body SVG Path
        let bodySVG = `
            <path d="M200 250 C 200 150, 300 150, 300 250 C 300 350, 250 370, 250 370 C 250 370, 200 350, 200 250 Z" fill="${skinTone}" stroke="${strokeColor}" stroke-width="4"/>
            <path d="M235 365 L 265 365 L 265 400 L 235 400 Z" fill="${skinTone}" stroke="${strokeColor}" stroke-width="4"/>
            <path d="${isMale ? 'M200 400 Q 250 390 300 400 L 320 600 L 180 600 Z' : 'M210 400 Q 250 390 290 400 Q 320 500 290 600 L 210 600 Q 180 500 210 400 Z'}" fill="${skinTone}" stroke="${strokeColor}" stroke-width="4"/>
            <path d="M200 400 Q 150 450 160 550" fill="none" stroke="${skinTone}" stroke-width="25" stroke-linecap="round"/>
            <path d="M200 400 Q 150 450 160 550" fill="none" stroke="${strokeColor}" stroke-width="33" stroke-linecap="round" z-index="-1"/>
            <path d="M300 400 Q 350 450 340 550" fill="none" stroke="${skinTone}" stroke-width="25" stroke-linecap="round"/>
            <path d="M300 400 Q 350 450 340 550" fill="none" stroke="${strokeColor}" stroke-width="33" stroke-linecap="round" z-index="-1"/>
        `;

        // Susun urutan Layer SVG (Background -> Badan -> Pakaian -> Wajah -> Rambut)
        canvas.innerHTML = `
            <g id="layer-bg">${this.getAssetSVG('bg', this.currentOutfit.bg)}</g>
            <g id="layer-body">${bodySVG}</g>
            <g id="layer-clothes">${this.getAssetSVG('clothes', this.currentOutfit.clothes)}</g>
            <g id="layer-face">${this.getAssetSVG('face', this.currentOutfit.face)}</g>
            <g id="layer-hair">${this.getAssetSVG('hair', this.currentOutfit.hair)}</g>
        `;
    },

    // 3. DATABASE ASSET & HARGA (Local Memory)
    assets: {
        hair: [
            { id: 'hair1', name: 'Bob Cut', price: 0, svg: '<path d="M190 250 Q 250 120 310 250 Q 310 320 280 320 Q 250 200 220 320 Q 190 320 190 250 Z" fill="#8B4513"/>' },
            { id: 'hair2', name: 'Long Wavy', price: 50, svg: '<path d="M190 250 Q 250 100 310 250 Q 330 400 290 450 Q 250 250 210 450 Q 170 400 190 250 Z" fill="#FFD700"/>' },
            { id: 'hair3', name: 'Messy Boy', price: 50, svg: '<path d="M195 240 Q 250 130 305 240 Q 320 200 280 180 Q 250 220 220 180 Q 180 200 195 240 Z" fill="#2F4F4F"/>' }
        ],
        face: [
            { id: 'face1', name: 'Cute Smile', price: 0, svg: '<circle cx="230" cy="240" r="12" fill="#333"/><circle cx="233" cy="237" r="4" fill="#fff"/><circle cx="270" cy="240" r="12" fill="#333"/><circle cx="273" cy="237" r="4" fill="#fff"/><path d="M240 280 Q 250 295 260 280" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/>' },
            { id: 'face2', name: 'Wink Love', price: 30, svg: '<path d="M220 240 Q 230 230 240 240" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/><circle cx="270" cy="240" r="12" fill="#333"/><circle cx="273" cy="237" r="4" fill="#fff"/><path d="M240 280 Q 250 300 260 280 Z" fill="#FFB6C1" stroke="#333" stroke-width="2"/>' }
        ],
        clothes: [
            { id: 'clothes1', name: 'Casual T-Shirt', price: 0, svg: '<path d="M200 400 L 300 400 L 320 520 L 180 520 Z" fill="#FFF" stroke="#333" stroke-width="4"/><path d="M200 400 L 160 480 L 180 490 L 210 430 Z" fill="#FFF" stroke="#333" stroke-width="4"/><path d="M300 400 L 340 480 L 320 490 L 290 430 Z" fill="#FFF" stroke="#333" stroke-width="4"/>' },
            { id: 'clothes2', name: 'Pink Hoodie', price: 100, svg: '<path d="M190 390 L 310 390 L 330 550 L 170 550 Z" fill="#FFB6C1" stroke="#333" stroke-width="4"/><path d="M240 400 L 240 450 M 260 400 L 260 450" fill="none" stroke="#fff" stroke-width="3"/><path d="M180 500 L 320 500 L 320 550 L 180 550 Z" fill="#FFC0CB" stroke="#333" stroke-width="4"/>' }
        ],
        bg: [
            { id: 'bg1', name: 'Soft Room', price: 0, svg: '<rect width="500" height="800" fill="#FFE4E1"/>' },
            { id: 'bg2', name: 'Night Sky', price: 150, svg: '<rect width="500" height="800" fill="#191970"/><circle cx="100" cy="150" r="40" fill="#FFFDD0"/><circle cx="50" cy="50" r="2" fill="#FFF"/><circle cx="450" cy="250" r="3" fill="#FFF"/>' }
        ]
    },

    // 4. MENGAMBIL STRING SVG
    getAssetSVG: function(category, id) {
        const item = this.assets[category].find(i => i.id === id);
        return item ? item.svg : '';
    },

    // 5. MERENDER ITEM DI BOTTOM SHEET (Lemari)
    renderItems: function(category) {
        const container = document.getElementById('items-container');
        container.innerHTML = ''; // Bersihkan kontainer

        if (!this.assets[category]) return;

        this.assets[category].forEach(item => {
            const isEquipped = this.currentOutfit[category] === item.id;
            const isOwned = item.price === 0 || GameState.inventory.includes(item.id);

            const card = document.createElement('div');
            card.className = `item-card ${isEquipped ? 'equipped' : ''}`;
            
            // Tampilan Miniatur Item
            card.innerHTML = `
                <svg viewBox="150 100 200 200" width="80%" height="80%">
                    ${item.svg}
                </svg>
                ${!isOwned ? `<div style="position:absolute; bottom:5px; background:rgba(255,255,255,0.8); border-radius:10px; padding:2px 8px; font-size:0.8rem; font-weight:bold;">🪙 ${item.price}</div>` : ''}
            `;

            // Logika Klik: Pakai baju ATAU Beli baju
            card.addEventListener('click', () => {
                if (isOwned) {
                    this.equipItem(category, item.id);
                } else {
                    this.buyItem(item);
                }
            });

            container.appendChild(card);
        });
    },

    // 6. LOGIKA MEMAKAI ITEM
    equipItem: function(category, id) {
        this.currentOutfit[category] = id;
        this.renderCharacterSVG(); // Render ulang karakter
        this.renderItems(category); // Refresh border hijau di lemari
    },

    // 7. LOGIKA MEMBELI ITEM (Shop System)
    buyItem: function(item) {
        if (GameState.coins >= item.price) {
            // Kurangi koin
            GameState.coins -= item.price;
            // Masukkan ke inventory
            GameState.inventory.push(item.id);
            
            // Simpan ke HP
            Storage.save('coins', GameState.coins);
            Storage.save('inventory', GameState.inventory);
            
            // Update UI Koin
            App.updateUI();
            
            // Langsung pakaikan item yang baru dibeli
            // Untuk mendapatkan kategori dari item ID (karena ID diawali nama kategori, misal 'hair2')
            const categoryMatch = Object.keys(this.assets).find(cat => item.id.startsWith(cat));
            if(categoryMatch) this.equipItem(categoryMatch, item.id);
            
            // Putar suara khusus pembelian jika ada, sementara pakai klik
            if(typeof AudioEngine !== 'undefined') AudioEngine.playClick();
            
            // Efek Sparkle saat berhasil beli
            if(typeof UIManager !== 'undefined') UIManager.createParticles('sparkle', 10);
            
        } else {
            alert('Koin tidak cukup! Mainkan Skincare Mini Game untuk mendapat koin.');
        }
    },

    // 8. FITUR RANDOM LOOK (Sesuai Permintaan)
    randomizeLook: function() {
        // Ambil kategori yang ada
        const categories = Object.keys(this.assets);
        
        categories.forEach(cat => {
            // Filter hanya item yang dimiliki (gratis atau sudah dibeli)
            const ownedItems = this.assets[cat].filter(item => item.price === 0 || GameState.inventory.includes(item.id));
            
            if (ownedItems.length > 0) {
                // Pilih acak
                const randomItem = ownedItems[Math.floor(Math.random() * ownedItems.length)];
                this.currentOutfit[cat] = randomItem.id;
            }
        });
        
        this.renderCharacterSVG();
        
        // Refresh UI tab yang sedang aktif
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            this.renderItems(activeTab.getAttribute('data-target'));
        }
        
        // Efek visual pergantian cepat
        if(typeof UIManager !== 'undefined') UIManager.createParticles('sparkle', 20);
    }
};
