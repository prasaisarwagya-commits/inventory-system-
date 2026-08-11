/* Shared navbar behaviour: mobile hamburger toggle, username display, logout */
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  const usernameEl = document.getElementById('navUsername');
  if (usernameEl) {
    usernameEl.textContent = getUsername();
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearSession();
      window.location.href = pathToLogin();
    });
  }
});
