async function loadProducts() {
    try {
        const response = await fetch('./products.json');
        if (!response.ok) {
            throw new Error('Failed to load products.json');
        }
        const data = await response.json();

        const productsContainer = document.getElementById('products');
        productsContainer.innerHTML = ''; // Clear any existing content

        data.forEach((product) => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.nom}" loading="lazy" onerror="this.style.display='none';">
                <h3>${product.nom}</h3>
                <p class="price">${product.prix} €</p>
            `;
            productsContainer.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products').innerHTML = '<p>Erreur de chargement des produits.</p>';
    }
}

// Load products on page load
loadProducts();

document.getElementById('env-type').textContent = /Mobile|Android|iP(hone|od|ad)/.test(navigator.userAgent) ? 'Mobile' : 'Desktop';

// Prevent page scroll when scrolling over products, allow products scroll if possible
document.getElementById('products').addEventListener('wheel', function(e) {
    const products = this;
    const scrollTop = products.scrollTop;
    const scrollHeight = products.scrollHeight;
    const clientHeight = products.clientHeight;

    if ((e.deltaY > 0 && scrollTop + clientHeight < scrollHeight) || (e.deltaY < 0 && scrollTop > 0)) {
        // Can scroll products, let it happen
    } else {
        // Cannot scroll products further, prevent page scroll
        e.preventDefault();
    }
}, { passive: false });