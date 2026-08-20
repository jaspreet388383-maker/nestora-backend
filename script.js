// ================= FILTER: STAYS & LOCATION =================
document.addEventListener("DOMContentLoaded", () => {
  const stayFilter = document.getElementById("stayFilter");
  const saleFilter = document.getElementById("saleFilter");

  if (stayFilter) {
    stayFilter.addEventListener("change", () => {
      const value = stayFilter.value;
      const cards = document.querySelectorAll(".properties-grid.stays .property-card");

      cards.forEach((card) => {
        if (value === "all" || card.dataset.type === value) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  if (saleFilter) {
    saleFilter.addEventListener("change", () => {
      const value = saleFilter.value;
      const cards = document.querySelectorAll(".properties-grid.sale .property-card");

      cards.forEach((card) => {
        if (value === "all" || card.dataset.city === value) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
});

// ================= TOGGLE: HOME STAYS / BUY HOUSE =================
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtns = document.querySelectorAll(".toggle-btn");
  const staysSection = document.querySelector(".properties-grid.stays");
  const saleSection = document.querySelector(".properties-grid.sale");
  const staysFilter = document.querySelector(".stays-filter");
  const saleFilter = document.querySelector(".sale-filter");

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.innerText.trim() === "Home Stays") {
        staysSection.style.display = "grid";
        saleSection.style.display = "none";
        staysFilter.style.display = "flex";
        saleFilter.style.display = "none";
      } else {
        staysSection.style.display = "none";
        saleSection.style.display = "grid";
        staysFilter.style.display = "none";
        saleFilter.style.display = "flex";
      }
    });
  });
});

// ================= WISHLIST & CART =================
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".property-card");

  cards.forEach((card, index) => {
    const img = card.querySelector("img");
    const title = card.querySelector("h3").innerText;
    const priceSpan = card.querySelector(".property-bottom span");
    const price = priceSpan ? priceSpan.innerText : "";
    const id = "prop-" + index + "-" + title.replace(/\s+/g, "");

    card.dataset.id = id;

    // ---- Wishlist Heart ----
    const heart = document.createElement("span");
    heart.classList.add("wishlist-heart");
    heart.innerHTML = "♡";
    card.appendChild(heart);

    if (isInWishlist(id)) {
      heart.classList.add("active");
      heart.innerHTML = "♥";
    }

    heart.addEventListener("click", () => {
      toggleWishlist({ id, title, price, img: img.src });
      heart.classList.toggle("active");
      heart.innerHTML = heart.classList.contains("active") ? "♥" : "♡";
    });

    // ---- Add to Cart Button ----
    const bottom = card.querySelector(".property-bottom");
    const cartBtn = document.createElement("button");
    cartBtn.classList.add("cart-btn");
    cartBtn.innerText = "Add to Cart";
    bottom.appendChild(cartBtn);

    cartBtn.addEventListener("click", () => {
      addToCart({ id, title, price, img: img.src });
      cartBtn.innerText = "Added ✔";
      setTimeout(() => (cartBtn.innerText = "Add to Cart"), 1500);
    });
  });

  updateHeaderCounts();
});

// ---------- LocalStorage helpers ----------
function getWishlist() {
  return JSON.parse(localStorage.getItem("nestora_wishlist")) || [];
}
function isInWishlist(id) {
  return getWishlist().some((item) => item.id === id);
}
function toggleWishlist(item) {
  let list = getWishlist();
  if (isInWishlist(item.id)) {
    list = list.filter((p) => p.id !== item.id);
  } else {
    list.push(item);
  }
  localStorage.setItem("nestora_wishlist", JSON.stringify(list));
  updateHeaderCounts();
}
function getCart() {
  return JSON.parse(localStorage.getItem("nestora_cart")) || [];
}
function addToCart(item) {
  let cart = getCart();
  cart.push(item);
  localStorage.setItem("nestora_cart", JSON.stringify(cart));
  updateHeaderCounts();
}
function updateHeaderCounts() {
  const wishCount = document.getElementById("wishlistCount");
  const cartCount = document.getElementById("cartCount");
  if (wishCount) wishCount.innerText = getWishlist().length;
  if (cartCount) cartCount.innerText = getCart().length;
}