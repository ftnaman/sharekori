(() => {
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') root.setAttribute('data-theme', 'dark');

  function updateButtonText(btn) {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (btn) btn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    updateButtonText(btn);
    btn?.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
      updateButtonText(btn);
    });
  });
})();



