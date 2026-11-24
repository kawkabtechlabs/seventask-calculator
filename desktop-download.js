(() => {
  const buttons = document.querySelectorAll('[data-desktop-download]');
  const status = document.querySelector('[data-desktop-download-status]');
  if (!buttons.length || !status) return;

  // A verified Windows installer is not currently part of this release.
  // Disable the action so the static-site fallback cannot be downloaded as an EXE.
  buttons.forEach(button => {
    button.setAttribute('aria-disabled', 'true');
    button.setAttribute('tabindex', '-1');
    button.addEventListener('click', event => event.preventDefault());
  });
  status.textContent = 'The verified Windows installer is temporarily unavailable. Use the web app or Android app for now.';
})();
