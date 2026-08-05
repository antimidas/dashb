// ===============================================
// CORE JAVASCRIPT LOGIC FOR DASHBOARD INTERACTION (API INTEGRATED)
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    const modalTemplate = document.getElementById('modal-template');
    if (!modalTemplate) {
        console.error("Modal template not found in the DOM.");
        return;
    }

    // --- 1. Modal Element Setup ---
    let activeModal = document.getElementById('dynamic-modal') || document.createElement('div');
    if (!document.body.contains(activeModal)) {
         document.body.appendChild(activeModal);
    }
    
    // Re-initialize modal structure if it was missing or needs cleanup
    activeModal.innerHTML = `
        <button class="close-btn" aria-label="Close">&times;</button>
        <iframe id="modal-iframe" src="about:blank"></iframe>
    `;
    const iframe = document.getElementById('modal-iframe');
    
    // Close button listener for the dynamically created modal
    const closeBtn = activeModal.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => { 
            activeModal.style.display = 'none';
            iframe.src = 'about:blank'; // Clear content on close
        });
    }

    // Global click listener to close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === activeModal) { 
            activeModal.style.display = 'none';
            iframe.src = 'about:blank';
        }
    });

    // --- 2. Widget/Button Interactivity ---
    const iframeButtons = document.querySelectorAll('.iframe-button, .widget-btn');
    iframeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); 
            let urlToLoad = null;
            let isApiCall = false;

            // Check if the button implies an API call (e.g., System Status)
            if (this.classList.contains('widget-btn') && this.getAttribute('href').includes('/api/')) {
                const endpoint = this.getAttribute('href');
                urlToLoad = endpoint;
                isApiCall = true;
            } else if (this.hasAttribute('data-url')) {
                 // Fallback for direct iframe links
                urlToLoad = this.getAttribute('data-url');
            }

            if (urlToLoad) {
                if (isApiCall) {
                    fetchAndDisplayWidget(urlToLoad, this.textContent.trim());
                } else {
                    openContentInModal(urlToLoad);
                }
            }
        });
    }

    // --- 3. API Fetching Logic ---
    async function fetchAndDisplayWidget(endpoint, title) {
        console.log(`Attempting to fetch data from: ${endpoint}`);
        
        // Display a loading state in the modal immediately
        activeModal.style.display = 'block';
        const iframe = document.getElementById('modal-iframe');
        iframe.src = 'about:blank'; // Clear previous content
        
        try {
            // NOTE: In a real setup, you must proxy this call through your backend API to avoid CORS issues.
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            
            // For status widgets, we don't load an iframe; we populate the modal content directly.
            displayWidgetData(data, title);

        } catch (error) {
            console.error("Failed to fetch widget data:", error);
            document.getElementById('modal-iframe').src = 'about:blank'; // Clear iframe
            alert(`Could not load ${title}. Is the backend API running at this endpoint? Error: ${error.message}`);
        }
    }

    // Function to populate modal with structured data (instead of an iframe)
    function displayWidgetData(data, title) {
        const iframe = document.getElementById('modal-iframe');
        let contentHTML = `
            <div style="padding: 20px;">
                <h2>${title} Status</h2>
                <p><em>Data loaded successfully from API endpoint.</em></p>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
        // Since we are showing structured data, we temporarily override the iframe with a content div for demonstration.
        iframe.outerHTML = `<div id="modal-content-body" class="modal-content">${contentHTML}</div>`;
    }

    // --- 4. Standard iFrame Loading Logic ---
    function openContentInModal(url) {
        if (!url || url === 'about:blank') {
            console.warn("No valid URL provided for the modal.");
            return;
        }
        
        // Display the modal and load content
        activeModal.style.display = 'block';
        const iframe = document.getElementById('modal-iframe');
        
        setTimeout(() => {
            iframe.src = url;
        }, 50);
    }
});