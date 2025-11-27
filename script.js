// Mobile menu toggle + heart wishlist toggle
document.addEventListener('DOMContentLoaded', () => {
  // Mobile hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');

  // If nav doesn't exist (very small screens) create simple toggle behavior:
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      // toggle a simple class; CSS hides .main-nav on small screens
      mainNav.classList.toggle('open');
      // animate hamburger
      hamburger.classList.toggle('open');
    });
  }

  // Heart (wishlist) toggle
  const heartButtons = document.querySelectorAll('.heart-btn');
  heartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      // toggle icon style (regular <-> solid) and an active class for color/scale
      const icon = btn.querySelector('i');
      if (!icon) return;
      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');
      btn.classList.toggle('active');
      // Optional: show subtle feedback
      btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 180 });
    });
  });

  // Accessibility: close mobile nav when clicking outside
  document.addEventListener('click', (ev) => {
    if (!mainNav) return;
    if (!mainNav.contains(ev.target) && !hamburger.contains(ev.target)) {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
});
/* -------------------------
   LOGIN SYSTEM (POPUP)
--------------------------*/

let currentUser = localStorage.getItem("furnitureUser") || null;

const loginPopup = document.getElementById("loginPopup");
const loginBtn = document.getElementById("loginBtn");
const closeLogin = document.getElementById("closeLogin");

// Open Login Popup
function openLoginForm() {
    loginPopup.style.display = "flex";
}

// Close Popup
closeLogin.addEventListener("click", () => {
    loginPopup.style.display = "none";
});

// Perform Login
loginBtn.addEventListener("click", () => {
    let email = document.getElementById("loginEmail").value.trim();
    let pass = document.getElementById("loginPass").value.trim();

    if (email === "" || pass === "") {
        alert("Please fill all fields.");
        return;
    }

    // Save User
    localStorage.setItem("furnitureUser", email);
    currentUser = email;

    loginPopup.style.display = "none";
    showUserName();
});

// Show logged-in user in navbar
function showUserName() {
    const userBtn = document.querySelector("[aria-label='Account']");
    if (currentUser) {
        userBtn.innerHTML = `<i class="fa fa-user"></i> ${currentUser.split("@")[0]}`;
    } else {
        userBtn.innerHTML = `<i class="fa fa-user"></i>`;
    }
}

showUserName();

// Logout
function logout() {
    localStorage.removeItem("furnitureUser");
    currentUser = null;
    showUserName();
}

/* -------------------------
   WISHLIST SYSTEM
--------------------------*/

let wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];

function toggleWishlist(product, heartIcon) {
    let exists = wishlist.find(item => item.name === product.name);

    if (exists) {
        wishlist = wishlist.filter(item => item.name !== product.name);
        heartIcon.classList.remove("liked");
    } else {
        wishlist.push(product);
        heartIcon.classList.add("liked");
    }

    localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
}

/* Activate heart color from saved wishlist */
function loadWishlistState() {
    document.querySelectorAll(".card").forEach(card => {
        let name = card.querySelector("h3").innerText;
        let heart = card.querySelector(".fa-heart");

        let exists = wishlist.find(item => item.name === name);
        if (exists) heart.classList.add("liked");
    });
}

/* -------------------------
   EVENT HANDLERS
--------------------------*/

document.addEventListener("DOMContentLoaded", () => {

    // Heart Button Click (Wishlist)
    document.querySelectorAll(".fa-heart").forEach(heart => {
        heart.addEventListener("click", function (e) {
            e.stopPropagation();

            let card = this.closest(".card");
            let name = card.querySelector("h3").innerText;
            let price = card.querySelector(".current").innerText;

            toggleWishlist({ name, price }, this);
        });
    });

    // Account Button (Login / Logout)
    document.querySelector("[aria-label='Account']").addEventListener("click", () => {
        if (!currentUser) openLoginForm();
        else logout();
    });

    loadWishlistState();
});
