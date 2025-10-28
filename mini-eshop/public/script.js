document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const list = document.getElementById('product-list');
  if (list) {
    fetch('/api/products')
      .then(r => r.json())
      .catch(() => [])
      .then(products => {
        if (!Array.isArray(products) || products.length === 0) {
          products = [
            { id: 1, name: 'Wireless Mouse', price: 19.99 },
            { id: 2, name: 'Mechanical Keyboard', price: 49.99 },
            { id: 3, name: 'USB-C Hub', price: 24.99 },
            { id: 4, name: 'Noise-Canceling Headphones', price: 89.99 }
          ];
        }
        list.innerHTML = products.map(p => (
          `<li><h3>${p.name}</h3><p>$${Number(p.price).toFixed(2)}</p><a class="btn" href="#">Add to Cart</a></li>`
        )).join('');
      });
  }
});


