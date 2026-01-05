const apiUrl = 'https://script.google.com/macros/s/AKfycbxzGQMjnn4TLxs0lFN6MVV6takVUXtMxTCyZXbJr-AIDZ4fI6eIqa8Apr9tfq04FY4/exec';

async function loadProducts() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
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
                <img src="${product.image}" alt="${product.nom}" loading="lazy">
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