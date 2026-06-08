async function getProducts(url) {
  const productsList = document.querySelector("#productList");
  const loadingText = document.querySelector(".loading-text");

  try {
    const response = await fetch(url);
    const products = await response.json();
    loadingText.textContent = "";
    productsList.innerHTML = "";
    products.products.forEach((product) => {
      // Card
      const productCard = document.createElement("a");
      productCard.classList.add("product-card");
      productCard.href = `detail.html?id=${product.id}`;
      // Thumb
      const productImg = document.createElement("img");
      productImg.classList.add("product-img");
      productImg.src = product.thumbnail;
      productImg.alt = product.title;
      //Body
      const productBody = document.createElement("div");
      productBody.classList.add("product-body");
      // Title
      const productTitle = document.createElement("h3");
      productTitle.classList.add("product-title");
      productTitle.textContent = product.title;
      // Price
      const productPrice = document.createElement("p");
      productPrice.classList.add("product-price");
      productPrice.textContent = `$${product.price}`;

      productBody.append(productTitle, productPrice);

      productCard.append(productImg, productBody);

      productsList.append(productCard);
    });
  } catch (error) {
    loadingText.textContent = "Tải dữ liệu thất bại";
  }
}

getProducts("https://dummyjson.com/products");
