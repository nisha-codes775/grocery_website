// --- INITIAL STATE STORES CONFIG ---
let cart = JSON.parse(localStorage.getItem("KB_CART")) || [];
const WHATSAPP_NUMBER = "9319719877"; // Replace with the owner's WhatsApp number

// LIVE BACKEND API ROUTE ENGINE LINK (FIXED)
const BACKEND_URL = "https://grocery-website-mjzd.onrender.com/api";

// Yeh arrays database (MySQL) se dynamic load honge
let products = [];
let categories = [];

document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    
    // Website load hote hi database se active offers aur categories load karega
    loadLiveCampaignOffers();

    // 🏠 HOMEPAGE MATRIX CHECK
    if (document.getElementById("homepageCategoriesContainer")) {
        loadCategoriesForHomepage();
    }

    // 🍎 PRODUCTS PAGE MATRIX CHECK
    if (document.getElementById("categoryFiltersContainer")) {
        loadCategoriesFromBackend();
    }

    if (document.getElementById("cartContainer")) {
        renderCartPage();
        setupCheckout();
    }

    // Sticky Scroll Watcher Matrix
    const navbar = document.querySelector("nav");
    if (navbar && !navbar.classList.contains("inner-nav")) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 40) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }
});

// =========================================================================
// 🌐 DATABASE CONNECTIVITY LOGIC (FETCH CHANNELS)
// =========================================================================

// 1. Backend se saari categories mapping load karna (For Products Page)
async function loadCategoriesFromBackend() {
    try {
        const response = await fetch(`${BACKEND_URL}/categories`);
        categories = await response.json();
        
        const filtersContainer = document.getElementById("categoryFiltersContainer");
        if (filtersContainer) {
            filtersContainer.innerHTML = ""; 

            // Default 'All' button
            const allBtn = document.createElement("button");
            allBtn.className = "filter-btn active";
            allBtn.dataset.category = "all";
            allBtn.textContent = "All Items";
            filtersContainer.appendChild(allBtn);

            // Database se aayi har ek category ka button
            categories.forEach(cat => {
                const btn = document.createElement("button");
                btn.className = "filter-btn";
                btn.dataset.category = cat.name.trim();
                btn.textContent = cat.name;
                filtersContainer.appendChild(btn);
            });
        }
        
        if (document.getElementById("catalogGrid")) {
            loadStoreProductsFromBackend();
        }
    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

// 2. Node.js server se live products load karne ka function
async function loadStoreProductsFromBackend() {
    try {
        const response = await fetch(`${BACKEND_URL}/products`);
        products = await response.json(); 
        
        setupFilters();

        const urlParams = new URLSearchParams(window.location.search);
        const targetCat = urlParams.get('cat');
        
        if (targetCat) {
            handleCategoryQuery(targetCat.trim());
        } else {
            renderCatalog("all", "");
        }
    } catch (error) {
        console.error("Error loading products from database:", error);
        const grid = document.getElementById("catalogGrid");
        if (grid) grid.innerHTML = `<p class="empty-msg" style="color:red;">Failed to connect with server catalog.</p>`;
    }
}

// 3. Homepage par dynamic categories BOX ke andar CIRCLE render karna (WITH VIEW ALL MATRIX)
async function loadCategoriesForHomepage() {
    try {
        const response = await fetch(`${BACKEND_URL}/categories`);
        const homeCategories = await response.json();
        
        const homeContainer = document.getElementById("homepageCategoriesContainer");
        if (!homeContainer) return;
        
        homeContainer.innerHTML = ""; 

        if (homeCategories.length === 0) {
            homeContainer.innerHTML = `<p style="color:gray; width:100%; padding-left:5px;">No categories found.</p>`;
            return;
        }

        // 🛠️ SYSTEM CONTROL: Homepage par max 5 categories dikhayenge taaki clean lage
        const displayLimit = 5;
        const slicedCategories = homeCategories.slice(0, displayLimit);

        slicedCategories.forEach(cat => {
            let catImg = cat.image_url || "https://placehold.co/150";

            const card = document.createElement("div");
            card.className = "category-card"; 
            
            card.style.cssText = `
                cursor: pointer;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 20px;
                width: 160px;
                text-align: center;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                transition: transform 0.2s, box-shadow 0.2s;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            `;
            
            card.onmouseenter = () => { card.style.transform = "translateY(-5px)"; card.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.1)"; };
            card.onmouseleave = () => { card.style.transform = "translateY(0)"; card.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.05)"; };

            card.onclick = () => {
                window.location.href = `products.html?cat=${encodeURIComponent(cat.name.trim())}`;
            };

            card.innerHTML = `
                <div class="category-img-wrapper" style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #f8fafc; border: 2px solid #f1f5f9; margin-bottom: 12px;">
                    <img src="${catImg}" alt="${cat.name}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #1e293b; font-family: 'Poppins', sans-serif;">${cat.name}</h3>
            `;
            homeContainer.appendChild(card);
        });

        // 🛠️ VIEW ALL CARD: Agar total categories limit se jyada hain ya barabar hain, toh 6th card "View All" ka banega
        if (homeCategories.length >= displayLimit) {
            const viewAllCard = document.createElement("div");
            viewAllCard.className = "category-card view-all-card";
            viewAllCard.style.cssText = `
                cursor: pointer;
                background: #f8fafc;
                border: 1px dashed #cbd5e1;
                border-radius: 12px;
                padding: 20px;
                width: 160px;
                text-align: center;
                transition: transform 0.2s, background-color 0.2s;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            `;

            viewAllCard.onmouseenter = () => { viewAllCard.style.transform = "translateY(-5px)"; viewAllCard.style.backgroundColor = "#f1f5f9"; };
            viewAllCard.onmouseleave = () => { viewAllCard.style.transform = "translateY(0)"; viewAllCard.style.backgroundColor = "#f8fafc"; };

            viewAllCard.onclick = () => {
                window.location.href = `products.html`;
            };

            viewAllCard.innerHTML = `
                <div class="category-img-wrapper" style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #e2e8f0; margin-bottom: 12px; font-size: 24px;">
                    ➔
                </div>
                <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #475569; font-family: 'Poppins', sans-serif;">View All (${homeCategories.length})</h3>
            `;
            homeContainer.appendChild(viewAllCard);
        }

    } catch (error) {
        console.error("Error rendering homepage dynamic category cards:", error);
    }
}

// 4. Active Offers Banner System
async function loadLiveCampaignOffers() {
    try {
        const response = await fetch(`${BACKEND_URL}/offers/active`);
        const activeOffers = await response.json();
        const offerContainer = document.getElementById("offerBannerContainer");
        if (!offerContainer) return;
        
        offerContainer.innerHTML = "";
        if (activeOffers.length === 0) {
            offerContainer.style.display = "none";
            return;
        }

        offerContainer.style.display = "block";
        activeOffers.forEach(o => {
            offerContainer.innerHTML += `
                <div class="live-promo-banner" style="background:#FEF3C7; color:#D97706; text-align:center; padding:12px; font-weight:600; font-size:14px; border-radius:8px; margin-bottom:15px; border:1px dashed #F59E0B;">
                    🎉 SPECIAL CAMPAIGN SCHEME: ${o.title} (${o.discount_percentage}% INSTANT SLASH DISCOUNT)
                </div>`;
        });
    } catch (err) {
        console.warn("Promotional automated timeline feed unreachable:", err);
    }
}

// =========================================================================
// --- CATALOG GENERATION AND MANIPULATION LOGIC (products.html) ---
// =========================================================================
function renderCatalog(filterCategoryName = "all", searchStr = "") {
    const grid = document.getElementById("catalogGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const searchStringClean = (searchStr || "").toLowerCase().trim();
    const expectedFilterName = filterCategoryName.toLowerCase().trim();

    let matchedItems = products.filter(p => {
        const mappedCatObj = categories.find(c => c.id === p.category_id);
        const actualCategoryName = mappedCatObj ? mappedCatObj.name.toLowerCase().trim() : "";

        const matchesCat = (expectedFilterName === "all" || actualCategoryName === expectedFilterName);
        const matchesSearch = p.name.toLowerCase().includes(searchStringClean);
        
        return matchesCat && matchesSearch;
    });

    if (matchedItems.length === 0) {
        grid.innerHTML = `<p class="empty-msg" style="width:100%; text-align:center; color:gray; padding:40px 0;">No products match your criteria. Try something else!</p>`;
        return;
    }

    matchedItems.forEach(product => {
        const cartItem = cart.find(item => item.id === product.id);
        let thumbnailImg = product.image_url || "https://placehold.co/300";
        
        const catObj = categories.find(c => c.id === product.category_id);
        const displayCatName = catObj ? catObj.name : "Store Item";
        
        let dynamicActionTargetHTML = "";
        if (product.is_available === 0 || product.is_available === false) {
            dynamicActionTargetHTML = `<button class="add-btn" disabled style="background:#D1D5DB; color:#9CA3AF; cursor:not-allowed; border:none;">OUT OF STOCK</button>`;
        } else {
            dynamicActionTargetHTML = cartItem ? renderQtyControls(product.id, cartItem.quantity) : `<button class="add-btn" onclick="addToCart(${product.id})">ADD</button>`;
        }

        const card = document.createElement("div");
        card.className = "product-card";
        
        if (product.is_available === 0 || product.is_available === false) {
            card.style.opacity = "0.75";
        }

        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${thumbnailImg}" alt="${product.name}" loading="lazy">
            </div>
            <span class="product-cat">${displayCatName}</span>
            <h4 class="product-name">${product.name}</h4>
            <div class="product-footer">
                <span class="product-price">₹${product.price}</span>
                <div class="action-target-${product.id}">
                    ${dynamicActionTargetHTML}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderQtyControls(productId, quantity) {
    return `
        <div class="quantity-control">
            <button onclick="changeQty(${productId}, -1)">-</button>
            <span>${quantity}</span>
            <button onclick="changeQty(${productId}, 1)">+</button>
        </div>
    `;
}

function setupFilters() {
    const tabs = document.querySelectorAll(".filter-btn");
    const searchBar = document.getElementById("searchBar");

    tabs.forEach(tab => {
        tab.onclick = null; 
        tab.addEventListener("click", (e) => {
            tabs.forEach(t => t.classList.remove("active"));
            const targetButton = e.target.closest('.filter-btn');
            targetButton.classList.add("active");
            
            const selectedCat = targetButton.dataset.category || "all";
            const searchVal = searchBar ? searchBar.value : "";
            
            renderCatalog(selectedCat, searchVal);
        });
    });

    if (searchBar) {
        searchBar.addEventListener("input", (e) => {
            const activeTab = document.querySelector(".filter-btn.active");
            const activeCat = activeTab ? activeTab.dataset.category : "all";
            renderCatalog(activeCat, e.target.value);
        });
    }
}

function handleCategoryQuery(targetCat) {
    if (!targetCat) return;

    const tabs = document.querySelectorAll(".filter-btn");
    let matchedTab = null;

    tabs.forEach(tab => {
        if (tab.dataset.category && tab.dataset.category.toLowerCase().trim() === targetCat.toLowerCase().trim()) {
            matchedTab = tab;
        }
    });

    if (matchedTab) {
        tabs.forEach(t => t.classList.remove("active"));
        matchedTab.classList.add("active");
        const searchBar = document.getElementById("searchBar");
        renderCatalog(matchedTab.dataset.category, searchBar ? searchBar.value : "");
    } else {
        renderCatalog("all", "");
    }
}

// --- OPERATIONS CORE LOGIC CONTROLS ---
window.addToCart = function(id) {
    const item = products.find(p => p.id === id);
    if (!item) return;

    cart.push({ ...item, quantity: 1 });
    updateCartBadge();
    refreshInterfaceTargets(id, 1);
};

window.changeQty = function(id, offset) {
    const index = cart.findIndex(item => item.id === id);
    if (index === -1) return;

    cart[index].quantity += offset;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
        refreshInterfaceTargets(id, 0);
    } else {
        refreshInterfaceTargets(id, cart[index].quantity);
    }
    
    updateCartBadge();
    if (document.getElementById("cartContainer")) renderCartPage();
};

function refreshInterfaceTargets(id, qty) {
    const targetContainers = document.querySelectorAll(`.action-target-${id}`);
    targetContainers.forEach(container => {
        if (qty > 0) {
            container.innerHTML = renderQtyControls(id, qty);
        } else {
            container.innerHTML = `<button class="add-btn" onclick="addToCart(${id})">ADD</button>`;
        }
    });
}

function updateCartBadge() {
    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.querySelectorAll(".cart-count").forEach(el => el.textContent = totalQty);
    localStorage.setItem("KB_CART", JSON.stringify(cart));
}

// --- CART PAGE RENDER ---
function renderCartPage() {
    const container = document.getElementById("cartContainer");
    if (!container) return;
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `<p class="empty-msg">Your basket is currently empty. <br><a href="products.html">Go add items!</a></p>`;
        calculateBill(0);
        return;
    }

    cart.forEach(item => {
        let thumbImg = item.image_url || "https://placehold.co/100";
        const row = document.createElement("div");
        row.className = "cart-item-row";
        row.innerHTML = `
            <img src="${thumbImg}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>₹${item.price} x ${item.quantity}</p>
            </div>
            <div class="quantity-control">
                <button onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        `;
        container.appendChild(row);
    });

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    calculateBill(subtotal);
}

function calculateBill(subtotal) {
    const shippingCost = (subtotal >= 2000 || subtotal === 0) ? 0 : 40;
    const grandTotal = subtotal + shippingCost;

    document.getElementById("subtotalVal").textContent = `₹${subtotal}`;
    document.getElementById("shippingVal").textContent = shippingCost === 0 ? "FREE" : `₹${shippingCost}`;
    document.getElementById("grandTotalVal").textContent = `₹${grandTotal}`;
}

// --- CHECKOUT OPERATIONS CHANNEL ---
function setupCheckout() {
    const checkoutBtn = document.getElementById("whatsappCheckoutBtn");
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) return;
        const name = document.getElementById("custName").value.trim();
        const address = document.getElementById("custAddress").value.trim();

        if (!name || !address) {
            alert("Please provide name and address.");
            return;
        }

        let msg = `🛒 *NEW ORDER - Maa Anaapoorna*\n👤 *Customer:* ${name}\n📍 *Address:* ${address}\n\n`;
        cart.forEach((item, idx) => { msg += `${idx+1}. ${item.name} x ${item.quantity}\n`; });
        
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        msg += `\n💰 *Total:* ₹${subtotal}`;

        window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(msg)}`, "_blank");
        cart = [];
        updateCartBadge();
    });
}
