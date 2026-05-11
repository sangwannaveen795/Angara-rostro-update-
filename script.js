/**
 * @typedef {Object} CartItem
 * @property {string} name
 * @property {number} price
 */

/** @type {CartItem[]} */
let cart = [];

let currentCategory = 'all';
let currentType = 'all';

// Initialize Page
function initializePage() {
    applyFilters();
    populateMenuDescriptions();
}

initializePage();

/**
 * Add descriptions to image-style menu cards
 */
function populateMenuDescriptions() {
    const descriptionMap = {
        'Green Salad': 'Fresh greens tossed with simple seasoning for a light start. 🥗',
        'Plain Maggie': 'A simple and tasty classic Maggi prepared with flavorful masala and fresh ingredients. 🍜',
        'Masala Maggie': 'Spicy masala Maggi with crunchy veggies for a flavorful bite. 🍜',
        'Vegetable Maggie': 'Loaded with vegetables, this Maggi is hearty and comforting. 🍜',
        'Pea Nut Chat Masala': 'Crunchy peanuts, spices, and chutney make this chaat tangy and delicious. 🌶️',
        'Crispy Corn': 'Golden corn kernels tossed in spicy seasoning with a crunchy finish. 🌽',
        'Chilly Paneer': 'Soft paneer cubes in a tangy chili sauce for a spicy treat. 🔥',
        'Plain Papad': 'Crispy roasted papad served warm with a touch of seasoning. 🥣',
        'Masala Papad': 'Spiced papad topped with onions, tomatoes, and chaat masala. 🌶️',
        'Boil Egg (2pc)': 'Simple boiled eggs served with salt and pepper. 🥚',
        'Egg Bhujji (2pc)': 'Scrambled eggs cooked with onions and spices for a tasty snack. 🍳',
        'Egg Fry (2pc)': 'Crispy fried eggs seasoned with masala for extra flavor. 🍳',
        'Chilly Chicken': 'Tender chicken cooked in spicy chili sauce for bold taste. 🍗',
        'Fish Fry (3pc)': 'Crispy fried fish seasoned with aromatic spices. 🐟',
        'Plain Tawa Roti': 'Warm tawa-roasted rotis made fresh and soft. 🍞',
        'Butter Tawa Roti': 'Buttery rotis with a golden crust and rich flavor. 🧈',
        'Bejad Roti': 'Wholesome roti with a rustic texture and fragrant aroma. 🌾',
        'Plain Rice': 'Steamed rice cooked fluffy and light. 🍚',
        'Zeera Rice': 'Aromatic cumin rice tempered with ghee and spices. 🌾',
        'Fried Rice': 'Vegetable fried rice with classic seasoning and aroma. 🍛',
        'Plain Curd': 'Fresh curd that is smooth and cooling. 🥛',
        'Plain Raita': 'Lightly seasoned curd to refresh the palate. 🥄',
        'Veg Raita': 'Creamy curd mixed with fresh vegetables and spices. 🥗',
        'Boondi Raita': 'Crunchy boondi added to curd for texture and tang. 🧆',
        'Plain Chaach': 'Refreshing salted buttermilk chilled for a cool drink. 🥛',
        'Masala Chaach': 'Spiced chaach with roasted cumin and mint for extra flavor. 🌿',
        'Water Bottle': 'Chilled bottled water to keep you refreshed. 💧',
        'Soda': 'Fizzing soda perfect to pair with your meal. 🥤',
        'Lemon Soda Water': 'Zesty lemon soda with a refreshing fizz. 🍋'
    };

    document.querySelectorAll('.menu-card-img .item-info').forEach(info => {
        const titleEl = info.querySelector('h4');
        if (!titleEl || info.querySelector('.item-desc')) return;
        const itemName = titleEl.textContent.trim();
        const descText = descriptionMap[itemName] || `A delicious ${itemName} served fresh and flavorful. 🍽️`;
        const descEl = document.createElement('p');
        descEl.className = 'item-desc';
        descEl.textContent = descText;
        titleEl.insertAdjacentElement('afterend', descEl);
    });
}

function setCategory(category) {
    currentCategory = category;
    applyFilters();
}

function setType(type) {
    if (currentType === type) {
        currentType = 'all'; // toggle off
    } else {
        currentType = type;
    }
    applyFilters();
}

function applyFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    
    if (currentCategory === 'all') {
        document.getElementById('btn-all')?.classList.add('active');
    } else {
        document.getElementById(`btn-${currentCategory}`)?.classList.add('active');
    }
    
    if (currentType === 'veg') {
        document.getElementById('btn-veg')?.classList.add('active');
    } else if (currentType === 'non-veg') {
        document.getElementById('btn-nonveg')?.classList.add('active');
    }

    const sections = ['starters', 'maincourse', 'breads', 'drinks'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const showSection = (currentCategory === 'all' || currentCategory === sectionId);
        let hasVisibleItems = false;
        
        const items = section.querySelectorAll('[data-type]');
        items.forEach(item => {
            const itemType = item.getAttribute('data-type');
            let showItem = true;
            
            if (currentType !== 'all' && itemType !== currentType) {
                showItem = false;
            }
            
            // Empty string prevents breaking flexbox styling in cards
            item.style.display = showItem ? '' : 'none';
            if (showItem) hasVisibleItems = true;
        });
        
        if (showSection && hasVisibleItems) {
            section.style.display = 'grid';
            setTimeout(() => section.classList.add('active'), 10);
        } else {
            section.style.display = 'none';
            section.classList.remove('active');
        }
    });
}

// Sidebar Toggle
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) cartSidebar.classList.toggle('open');
}

/**
 * Add Standard Item
 * @param {string} itemName 
 * @param {number | string} itemPrice 
 */
function addToCart(itemName, itemPrice) {
    const price = typeof itemPrice === 'string' ? parseInt(itemPrice) : itemPrice;
    cart.push({ name: itemName, price: price });
    updateCartUI();
    
    if (window && window.event && window.event.currentTarget) {
        buttonFeedback(/** @type {HTMLElement} */ (window.event.currentTarget));
    }
}

/**
 * Add Dropdown Variant Item
 * @param {string} baseName 
 * @param {string} selectElementId 
 */
function addVariantToCart(baseName, selectElementId) {
    const selectEl = /** @type {HTMLSelectElement} */ (document.getElementById(selectElementId));
    if(!selectEl) return;
    
    const price = parseInt(selectEl.value);
    const variantOption = selectEl.options[selectEl.selectedIndex];
    
    const variantNameRaw = variantOption ? variantOption.getAttribute('data-name') : '';
    const variantClean = variantNameRaw ? variantNameRaw.replace('- ', '') : ''; 
    const fullName = `${baseName} ${variantClean}`.trim();
    
    cart.push({ name: fullName, price: price });
    updateCartUI();
    
    if (window && window.event && window.event.currentTarget) {
        buttonFeedback(/** @type {HTMLElement} */ (window.event.currentTarget));
    }
}

/**
 * Visual feedback for Add buttons
 * @param {HTMLElement} btn 
 */
function buttonFeedback(btn) {
    if (!btn) return;
    let originalText = btn.innerText;
    btn.innerText = "✓";
    btn.style.background = "#2E7D32";
    btn.style.color = "white";
    btn.style.borderColor = "#2E7D32";
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = ""; 
        btn.style.color = "";
        btn.style.borderColor = "";
    }, 800);
}

// Refresh Cart UI
function updateCartUI() {
    const cartList = document.getElementById('cartItemsList');
    const badgeTop = document.getElementById('cart-count-top');
    const badgeMobile = document.getElementById('cart-count-badge');
    const totalDisplay = document.getElementById('cartTotalValue');
    
    if (!cartList || !totalDisplay) return;
    
    cartList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartList.innerHTML = `
            <div class="empty-cart">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#ccc" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 10px;"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
                <p>Your cart is empty.</p>
            </div>`;
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            cartList.innerHTML += `
                <div class="cart-item-row">
                    <div class="cart-item-details">
                        <h5>${item.name}</h5>
                        <span>₹${item.price}</span>
                    </div>
                    <button class="delete-btn" onclick="removeFromCart(${index})">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF6B6B" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                </div>
            `;
        });
    }
    
    if(badgeTop) badgeTop.innerText = cart.length.toString();
    if(badgeMobile) badgeMobile.innerText = cart.length.toString();
    totalDisplay.innerText = `₹${total}`;
}

/**
 * Remove from Cart
 * @param {number} index 
 */
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// WhatsApp Checkout Logic
function sendWhatsAppOrder() {
    const customerInput = /** @type {HTMLInputElement} */ (document.getElementById('customerName'));
    const tableInput = /** @type {HTMLInputElement} */ (document.getElementById('tableNumber'));
    
    const customerName = customerInput ? customerInput.value : '';
    const tableNumber = tableInput ? tableInput.value : '';

    if (cart.length === 0) {
        alert("Please add items to your cart first.");
        return;
    }
    if (!tableNumber || tableNumber.trim() === "") {
        alert("Please enter your Table Number.");
        if (tableInput) tableInput.focus();
        return;
    }
    if (!customerName || customerName.trim() === "") {
        alert("Please enter your Name.");
        if (customerInput) customerInput.focus();
        return;
    }

    let message = "🔥 *Angara Restro Order* 🔥\n\n";
    message += `👤 *Name:* ${customerName}\n`;
    message += `📍 *Table No:* ${tableNumber}\n`;
    message += "---------------------------\n";
    
    let total = 0;
    cart.forEach(item => {
        message += `▪️ ${item.name} - ₹${item.price}\n`;
        total += item.price;
    });
    
    message += "---------------------------\n";
    message += `💰 *Total Bill: ₹${total}*\n`;
    message += "---------------------------\n";
    message += "✅ Thank you for the order!";

    alert("Thank you for the order! Redirecting to WhatsApp...");

    let encodedMessage = encodeURIComponent(message);
    let phoneNumber = "917690090066"; 
    let whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
}
// Filter logic has been consolidated above.

/**
 * Turns media display "On"
 * @param {HTMLElement} element 
 */
function toggleMedia(element) {
    const modal = document.getElementById("mediaLightbox");
    const lImg = /** @type {HTMLImageElement | null} */ (document.getElementById("lightboxImg"));
    const lVid = /** @type {HTMLVideoElement | null} */ (document.getElementById("lightboxVid"));
    const caption = document.getElementById("lightboxCaption");

    if (!modal || !lImg || !lVid || !caption) return;

    // Reset display
    lImg.style.display = "none";
    lVid.style.display = "none";
    lVid.pause();

    const img = element.querySelector("img");
    const vid = element.querySelector("video");

    if (img) {
        lImg.src = img.src;
        lImg.style.display = "block";
        caption.innerHTML = img.alt || "Angara Restro Highlights";
    } else if (vid) {
        lVid.src = vid.src;
        lVid.style.display = "block";
        lVid.play().catch(() => {});
        caption.innerHTML = element.querySelector(".exp-overlay")?.textContent || "Experience Angara Restro";
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
}

/**
 * Turns media display "Off"
 */
function closeMedia() {
    const modal = document.getElementById("mediaLightbox");
    const lVid = /** @type {HTMLVideoElement | null} */ (document.getElementById("lightboxVid"));
    
    if (modal) modal.classList.remove("open");
    if (lVid) lVid.pause();
    
    document.body.style.overflow = "auto";
}
/**
 * Toggles the entire Gallery section On/Off
 */
function toggleGalleryVisibility() {
    const toggle = /** @type {HTMLInputElement | null} */ (document.getElementById("galleryToggle"));
    const wrapper = document.getElementById("galleryWrapper");
    if (toggle && wrapper) {
        wrapper.style.display = toggle.checked ? "block" : "none";
        if (!toggle.checked) closeMedia();
    }
}