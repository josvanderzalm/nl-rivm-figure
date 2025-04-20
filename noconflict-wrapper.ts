let figureWrapperElement = null;

window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'options') {
    const options = event.data.data;
    addFigureWrapper(options);
  }
});

function sendHeightToParent() {
  console.log('Sending height to parent:', document.body.scrollHeight);
  window.parent.postMessage({ type: 'iframe-height', value: document.body.scrollHeight }, '*');
}

function addFigureWrapper(options) {
  figureWrapperElement = Object.assign(document.createElement("figure-wrapper"), { options });
  document.body.appendChild(figureWrapperElement);
}

// Observe changes to the figure-wrapper's shadow DOM
const observer = new MutationObserver(sendHeightToParent);

// Function to start observing (call after figure-wrapper is added)
function observeFigureWrapper() {
  if (figureWrapperElement && figureWrapperElement.shadowRoot) {
    observer.observe(figureWrapperElement.shadowRoot, {
      childList: true,
      subtree: true,
      attributes: true, // Observe attribute changes as well, if they affect layout
      characterData: true, // Observe text content changes
    });
    // Send initial height after observing starts
    sendHeightToParent();
  } else {
    // Try again after a short delay if shadowRoot is not yet available
    setTimeout(observeFigureWrapper, 50);
  }
}

// Use ResizeObserver to detect changes in document height
const resizeObserver = new ResizeObserver(() => {
  sendHeightToParent();
});

// Ensure the DOM is fully loaded before observing the body
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  resizeObserver.observe(document.body);
} else {
  window.addEventListener('DOMContentLoaded', () => {
    resizeObserver.observe(document.body);
  });
}

// Send initial height on load
window.addEventListener('load', sendInitialHeight);
function sendInitialHeight() {
  window.parent.postMessage({ type: 'iframe-height', value: document.body.scrollHeight }, '*');
}

// Start observing when the DOM is ready (or shortly after)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  observeFigureWrapper();
} else {
  window.addEventListener('DOMContentLoaded', observeFigureWrapper);
}