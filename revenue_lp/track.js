(async () => {
  try {
    await fetch("https://openclaw-fortune-order.openclaw-fortune.workers.dev/revenue-track", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        path: location.pathname,
        referrer: document.referrer,
        ua: navigator.userAgent
      })
    });
  } catch(e) {}
})();
