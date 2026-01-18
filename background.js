// Background Service Worker (Manifest V3)
// Runs in the background independent of tabs

console.log('Background service worker loaded');

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'processData') {
    // Process data and send response
    sendResponse({ result: 'Data processed' });
  }
});
