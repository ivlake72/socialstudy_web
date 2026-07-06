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

updateCurrentTime();
setInterval(updateCurrentTime, 1000);
initTheme();
