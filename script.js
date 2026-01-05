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
                <div class="stock ${stockClass}" data-stock="${stock}">${stockText} (${stock})</div>
                <div class="management">
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

// Load products on page load
loadProducts();