const statusTime = document.getElementById('status-time');
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

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

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️ 라이트 모드' : '🌙 다크 모드';
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme || (prefersDark.matches ? 'dark' : 'light');
  setTheme(initialTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

const menuLinks = Array.from(document.querySelectorAll('.menu-link'));
const panels = Array.from(document.querySelectorAll('.panel'));

function activateSection(targetId) {
  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === targetId);
  });

  menuLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.target === targetId);
  });
}

menuLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.dataset.target;
    if (targetId) {
      activateSection(targetId);
    }
  });
});

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
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
  if (typeof L === 'undefined') return;

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
    {
      title: '대피소 A',
      description: '은평구청 야외광장 - 임시 대피소',
      coords: [37.6028, 126.9207],
    },
    {
      title: '대피소 B',
      description: '은평문화예술회관 체육관 - 식수 및 침구 제공',
      coords: [37.5995, 126.9303],
    },
    {
      title: '대피소 C',
      description: '연신내역 공영주차장 인근 - 구조 지원 거점',
      coords: [37.6102, 126.9229],
    },
  ];

  shelters.forEach((shelter) => {
    L.marker(shelter.coords)
      .addTo(map)
      .bindPopup(`<strong>${shelter.title}</strong><br>${shelter.description}`);
  });
}

updateCurrentTime();
setInterval(updateCurrentTime, 1000);
initTheme();
initEvacuationMap();
