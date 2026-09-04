if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = new URL('./service-worker.js', window.location.href).toString();

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
