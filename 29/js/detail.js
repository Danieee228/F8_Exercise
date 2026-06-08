const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get("id");

async function getProductDetail(url) {
  const detailContainer = document.querySelector("#productDetail");
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Sản phẩm không tồn tại trên hệ thống!");
    }
    const product = await response.json();
    detailContainer.innerHTML = "";
    // Gallery
    const detailGallery = document.createElement("div");
    detailGallery.classList.add("detail-gallery");
    // Img
    const detailImg = document.createElement("img");
    detailImg.src = product.thumbnail;
    detailImg.alt = product.title;

    detailGallery.append(detailImg);
    // Info
    const detailInfo = document.createElement("div");
    detailInfo.classList.add("detail-info");

    const detailTitle = document.createElement("h2");
    detailTitle.textContent = product.title;

    const detailPrice = document.createElement("p");
    detailPrice.classList.add("detail-price");
    detailPrice.textContent = `Giá: $${product.price}`;

    const detailBrand = document.createElement("p");
    detailBrand.textContent = `Thương hiệu: ${product.brand || "Đang cập nhật"}`;

    const detailDesc = document.createElement("p");
    detailDesc.classList.add("detail-desc");
    detailDesc.textContent = product.description;

    detailInfo.append(detailTitle, detailPrice, detailBrand, detailDesc);

    detailContainer.append(detailGallery, detailInfo);
  } catch (error) {
    detailContainer.textContent =
      "Không thể tải thông tin chi tiết. Vui lòng thử lại sau.";
  }
}

if (productId) {
  const apiUrl = `https://dummyjson.com/products/${productId}`;
  getProductDetail(apiUrl);
} else {
  const detailContainer = document.querySelector("#productDetail");
  if (detailContainer) {
    detailContainer.textContent =
      "Sản phẩm không tồn tại hoặc đường dẫn không hợp lệ.";
  }
}
