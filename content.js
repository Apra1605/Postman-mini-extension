// Content script - runs on every webpage
// This script has access to the DOM of the webpage

console.log('Content script loaded');

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getData') {
    const pageTitle = document.title;
    const pageURL = window.location.href;
    
    sendResponse({
      message: `Page: ${pageTitle}\nURL: ${pageURL}`
    });
  }
  
  return true;
});

console.log('Content script ready');

// Example: Modify page on load
window.addEventListener('load', () => {
  console.log('Page loaded');
  // Add your page manipulation code here
});
