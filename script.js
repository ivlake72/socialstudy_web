const statusTime = document.getElementById('status-time');
const themeToggle = document.getElementById('theme-toggle');

function updateCurrentTime() {
  const now = new Date();
  const formatted = now.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  if (statusTime) {
    statusTime.textContent = formatted;
  }
}

function setTheme() {
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');
  if (themeToggle) {
    themeToggle.remove();
  }
}

function initTheme() {
  setTheme();
}

function activateNav() {
  const currentPage = document.body.dataset.page || 'home';
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const target = href.replace('.html', '');
    const isActive = (currentPage === 'home' && target === 'index') || target === currentPage;
    link.classList.toggle('active', isActive);
  });
}

const slideDeck = document.querySelector('.slide-deck');
const slidePrev = document.querySelector('.slide-btn.prev');
const slideNext = document.querySelector('.slide-btn.next');
const slideCards = Array.from(document.querySelectorAll('.slide-card'));
let currentSlideIndex = 0;

function scrollToSlide(index) {
  if (!slideDeck || slideCards.length === 0) return;
  const targetCard = slideCards[index];
  if (targetCard) {
    slideDeck.scrollTo({ left: targetCard.offsetLeft - 16, behavior: 'smooth' });
  }
}

function goToPreviousSlide() {
  currentSlideIndex = Math.max(0, currentSlideIndex - 1);
  scrollToSlide(currentSlideIndex);
}

function goToNextSlide() {
  currentSlideIndex = Math.min(slideCards.length - 1, currentSlideIndex + 1);
  scrollToSlide(currentSlideIndex);
}

if (slidePrev) {
  slidePrev.addEventListener('click', goToPreviousSlide);
}

if (slideNext) {
  slideNext.addEventListener('click', goToNextSlide);
}

function initEvacuationMap() {
  const mapEl = document.getElementById('evacuation-map');
  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map('evacuation-map', {
    center: [37.6021, 126.9220],
    zoom: 13,
    zoomControl: false,
    dragging: true,
    scrollWheelZoom: false,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  const shelters = [
    { title: '대피소 A', description: '은평구청 야외광장 - 임시 대피소', coords: [37.6028, 126.9207] },
    { title: '대피소 B', description: '은평문화예술회관 체육관 - 식수 및 침구 제공', coords: [37.5995, 126.9303] },
    { title: '대피소 C', description: '연신내역 공영주차장 인근 - 구조 지원 거점', coords: [37.6102, 126.9229] },
  ];

  shelters.forEach((shelter) => {
    L.marker(shelter.coords)
      .addTo(map)
      .bindPopup(`<strong>${shelter.title}</strong><br>${shelter.description}`);
  });
}

function openModal(modal) {
  if (!modal) return;
  modal.hidden = false;
  modal.style.display = 'grid';
  document.body.classList.add('modal-open');
}

function closeModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  modal.style.display = 'none';
  if (checkoutModal?.hidden && successModal?.hidden) {
    document.body.classList.remove('modal-open');
  }
}

const checkoutModal = document.getElementById('checkout-modal');
const successModal = document.getElementById('success-modal');
const checkoutProduct = document.getElementById('checkout-product');
const checkoutPrice = document.getElementById('checkout-price');
const successProduct = document.getElementById('success-product');
const checkoutForm = document.getElementById('checkout-form');

function bindModalEvents() {
  document.querySelectorAll('.buy-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const selectedProduct = {
        name: button.dataset.product || '비상용품',
        price: Number(button.dataset.price || 0),
      };

      if (checkoutProduct) {
        checkoutProduct.textContent = selectedProduct.name;
      }

      if (checkoutPrice) {
        checkoutPrice.textContent = `₩${selectedProduct.price.toLocaleString()}`;
      }

      if (successProduct) {
        successProduct.textContent = selectedProduct.name;
      }

      openModal(checkoutModal);
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const target = button.getAttribute('data-close-modal');
      if (target === 'checkout') {
        closeModal(checkoutModal);
      } else if (target === 'success') {
        closeModal(successModal);
      }
    });
  });

  [checkoutModal, successModal].forEach((modal) => {
    modal?.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal(checkoutModal);
      closeModal(successModal);
    }
  });

  checkoutForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    closeModal(checkoutModal);
    openModal(successModal);
    checkoutForm.reset();
  });
}

bindModalEvents();
updateCurrentTime();
setInterval(updateCurrentTime, 1000);
initTheme();
activateNav();
initEvacuationMap();
