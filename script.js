const sheetId = '1-Oy-P5b5Sw3sWVqnAR_Z9L8wMmz4WKGoCjaXHF3ZaTs'; // Your Google Sheet ID

const apiUrl = `https://opensheet.elk.sh/${sheetId}/Sheet1`; // Assuming sheet name is 'Sheet1'

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