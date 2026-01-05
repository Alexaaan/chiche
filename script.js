let showAvailable = false;

async function loadProducts() {
    try {
        let data = JSON.parse(localStorage.getItem('products'));
        if (!data) {
            const response = await fetch('./products.json');
            if (!response.ok) {
                throw new Error('Failed to load products.json');
            }
            data = await response.json();
            localStorage.setItem('products', JSON.stringify(data));
        }

        if (showAvailable) {
            data = data.filter(product => product.stock > 0);
        }

        const productsContainer = document.getElementById('products');
        productsContainer.innerHTML = ''; // Clear any existing content

        data.forEach((product, index) => {
            const stock = parseInt(product.stock);
            let stockText, stockClass;
            if (stock > 5) {
                stockText = '✅ En stock';
                stockClass = 'available';
            } else if (stock > 0) {
                stockText = '⚠️ Stock limité';
                stockClass = 'limited';
            } else {
                stockText = '❌ Rupture';
                stockClass = 'out';
            }

            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.nom}" loading="lazy" onerror="this.style.display='none';">
                <h3>${product.nom}</h3>
                <p class="price">${product.prix} €</p>
                <div class="stock ${stockClass}" data-stock="${stock}">${stockText} (${stock})</div>
                <div class="management">
                    <input type="number" class="stock-input" data-index="${index}" value="${stock}" min="0">
                    <button class="btn-small set-stock" data-index="${index}">Set</button>
                    <button class="btn-small decrease" data-index="${index}">-</button>
                    <button class="btn-small increase" data-index="${index}">+</button>
                </div>
            `;
            productsContainer.appendChild(productDiv);
        });

        // Add event listeners for management buttons
        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                updateStock(index, 1);
            });
        });
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                updateStock(index, -1);
            });
        });
        document.querySelectorAll('.set-stock').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                const input = document.querySelector(`.stock-input[data-index="${index}"]`);
                const newStock = parseInt(input.value);
                if (!isNaN(newStock) && newStock >= 0) {
                    setStock(index, newStock);
                }
            });
        });
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products').innerHTML = '<p>Erreur de chargement des produits.</p>';
    }
}

function updateStock(index, change) {
    let data = JSON.parse(localStorage.getItem('products'));
    if (data && data[index]) {
        data[index].stock = Math.max(0, parseInt(data[index].stock) + change);
        localStorage.setItem('products', JSON.stringify(data));
        loadProducts(); // Reload to update display
    }
}

function setStock(index, newStock) {
    let data = JSON.parse(localStorage.getItem('products'));
    if (data && data[index]) {
        data[index].stock = newStock;
        localStorage.setItem('products', JSON.stringify(data));
        loadProducts(); // Reload to update display
    }
}

// Load products on page load
loadProducts();

document.getElementById('filter-available').addEventListener('click', () => {
    showAvailable = !showAvailable;
    const btn = document.getElementById('filter-available');
    btn.textContent = showAvailable ? 'Afficher tous' : 'Afficher seulement disponibles';
    loadProducts();
});

document.getElementById('env-type').textContent = /Mobile|Android|iP(hone|od|ad)/.test(navigator.userAgent) ? 'Mobile' : 'Desktop';