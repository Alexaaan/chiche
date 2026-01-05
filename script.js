const apiUrl = 'https://script.google.com/macros/s/AKfycbxzd0zTYuEYMIuDzQ5kF2IuizAT2WJPaZQLnK9bhDDuwFj-6geYgZJTd2U1-ZLphZtb/exec';

async function loadProducts() {
    try {
        console.log('Fetching from:', apiUrl);
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }
        const data = await response.json();
        console.log('Data received:', data);
        const productsContainer = document.getElementById('products');
        productsContainer.innerHTML = ''; // Clear any existing content

        data.forEach(product => {
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
                <img src="${product.image}" alt="${product.nom}" loading="lazy" onerror="console.log('Image failed to load:', this.src); this.style.display='none';">
                <h3>${product.nom}</h3>
                <div class="stock ${stockClass}">${stockText}</div>
            `;
            productsContainer.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products').innerHTML = '<p>Erreur de chargement des produits. Vérifiez la connexion ou l\'ID de la feuille.</p>';
    }
}

// Load products on page load
loadProducts();