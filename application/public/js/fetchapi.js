let eleCount = document.getElementById('item-count');
let count = 0;

function makeCard(product) {
    return `
<div id="product-${product.id}" class="product-card">
    <img class="product-img" src="${product.thumbnail}" alt="">
    <p class="product-title">${product.title}</p>
    <p class="product-price">${product.price}</p>
</div>
            `;
}

function fadeOut(e) {
    let ele = e.currentTarget;
    let opacity = 1;

    let timer = setInterval(() => {
        opacity -= 0.05;
        ele.style.opacity = opacity;

        if (opacity <= 0) {
            clearInterval(timer);
            ele.remove();
            count--;
            eleCount.textContent = `Number of results: ${count}`;
        }
    }, 50);
}

fetch('https://dummyjson.com/products?limit=150')
    .then(function (resp) {
        return resp.json();
    })
    .then(function (data) {
        let products = data.products;
        count = products.length;
        console.log(products);

        document.getElementById('item-count').textContent = `Number of results: ${products.length}`;
        let container = document.getElementById('container');
        var itemString = "";

        products.forEach(function (product) {
            itemString += makeCard(product);
        });
        
        container.innerHTML = itemString;
        [...document.getElementsByClassName('product-card')].forEach(e => {
            e.addEventListener('click', fadeOut);
        });
    })
    .catch(function (err) {
        console.log(err);
    });