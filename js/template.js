// Function to load a component
async function loadComponent(componentId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(componentId).innerHTML = html;

        // Initialize necessary events and elements after loading components
        if (componentId === 'header-placeholder') {
            // Toggle sidebar
            const toggleSidebar = document.querySelector('.toggle-sidebar-btn');
            if (toggleSidebar) {
                toggleSidebar.addEventListener('click', function () {
                    document.querySelector('body').classList.toggle('toggle-sidebar');
                });
            }
        }

        // Initialize specific sidebar menu based on current page
        if (componentId === 'sidebar-placeholder') {
            setActiveMenu();
        }

        // Initialize dropdowns after each component is loaded
        initDropdowns();
    } catch (error) {
        console.error(`Error loading component ${componentId}:`, error);
    }
}

// Function to load head content
function loadHead() {
    fetch('components/head.html')
        .then(response => response.text())
        .then(data => {
            // Create a temporary container
            const temp = document.createElement('div');
            temp.innerHTML = data;

            // Process each element in the head
            const elements = temp.querySelectorAll('*');
            elements.forEach(element => {
                // Handle different types of elements
                if (element.tagName === 'TITLE') {
                    document.title = element.textContent;
                } else if (element.tagName === 'META') {
                    // Create a new meta element
                    const meta = document.createElement('meta');
                    for (let i = 0; i < element.attributes.length; i++) {
                        const attr = element.attributes[i];
                        meta.setAttribute(attr.name, attr.value);
                    }
                    document.head.appendChild(meta);
                } else if (element.tagName === 'LINK') {
                    // Create a new link element
                    const link = document.createElement('link');
                    for (let i = 0; i < element.attributes.length; i++) {
                        const attr = element.attributes[i];
                        link.setAttribute(attr.name, attr.value);
                    }
                    document.head.appendChild(link);
                }
            });
        })
        .catch(error => console.error('Error loading head:', error));
}

// Function to load scripts
function loadScripts() {
    fetch('components/scripts.html')
        .then(response => response.text())
        .then(data => {
            // Create a temporary container
            const temp = document.createElement('div');
            temp.innerHTML = data;

            // Process each script element
            const scripts = temp.querySelectorAll('script');
            let loadedScripts = 0;
            const totalScripts = scripts.length;

            scripts.forEach(script => {
                const newScript = document.createElement('script');

                // Copy all attributes
                for (let i = 0; i < script.attributes.length; i++) {
                    const attr = script.attributes[i];
                    newScript.setAttribute(attr.name, attr.value);
                }

                // Set proper MIME type for JavaScript files
                newScript.type = 'text/javascript';

                // Handle script loading
                newScript.onload = () => {
                    loadedScripts++;
                    if (loadedScripts === totalScripts) {
                        // All scripts loaded, initialize dropdowns
                        initDropdowns();
                    }
                };

                // Copy content
                newScript.textContent = script.textContent;

                // Append to body
                document.body.appendChild(newScript);
            });
        })
        .catch(error => console.error('Error loading scripts:', error));
}

// Function to load page-specific scripts
function loadPageScripts() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageScripts = {
        'index.html': 'js/pages/dashboard.js', // Remove the ../ since we're already in the root
        // Add more page-specific scripts here
    };

    if (pageScripts[currentPage]) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = pageScripts[currentPage];
        document.body.appendChild(script);
    }
}

// Set active menu item based on current page
function setActiveMenu() {
    // Get current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Reset all menu items
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.classList.add('collapsed');
    });

    document.querySelectorAll('.nav-content').forEach(content => {
        content.classList.remove('show');
    });

    // Set active menu item
    const activeLink = document.querySelector(`a[href="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.classList.remove('collapsed');

        // If it's in a submenu, also activate the parent
        const parentCollapseElement = activeLink.closest('.nav-content');
        if (parentCollapseElement) {
            parentCollapseElement.classList.add('show');
            const parentNavItem = document.querySelector(`[data-bs-target="#${parentCollapseElement.id}"]`);
            if (parentNavItem) {
                parentNavItem.classList.remove('collapsed');
            }
        }
    } else {
        // Default to Dashboard
        const dashboardLink = document.querySelector('a[href="index.html"]');
        if (currentPage === 'index.html' && dashboardLink) {
            dashboardLink.classList.add('active');
            dashboardLink.classList.remove('collapsed');
        }
    }
}

// Initialize Bootstrap dropdowns
function initDropdowns() {
    console.log('Initializing dropdowns...');

    try {
        // Check if bootstrap is available
        if (typeof bootstrap !== 'undefined') {
            // Initialize all dropdowns
            const dropdownElementList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'));
            dropdownElementList.forEach(function (dropdownToggleEl) {
                try {
                    // Try to create a new dropdown directly
                    new bootstrap.Dropdown(dropdownToggleEl);
                } catch (e) {
                    console.error('Error initializing dropdown:', e);
                }
            });
            console.log('Dropdowns initialized successfully');
        } else {
            console.warn('Bootstrap is not loaded yet. Will retry initialization.');
            setTimeout(initDropdowns, 500); // Retry after 500ms
        }
    } catch (error) {
        console.error('Error in initDropdowns:', error);
    }
}

// Add click event handler for dropdown toggles
function addDropdownClickHandlers() {
    document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(function (element) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Find dropdown menu (it's always the next sibling)
            const dropdownMenu = this.nextElementSibling;
            if (!dropdownMenu || !dropdownMenu.classList.contains('dropdown-menu')) return;

            // Toggle dropdown menu
            if (dropdownMenu.classList.contains('show')) {
                dropdownMenu.classList.remove('show');
            } else {
                // Hide all other dropdowns first
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    menu.classList.remove('show');
                });
                dropdownMenu.classList.add('show');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

// Load components when the DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load components first
        await loadComponent('header-placeholder', 'components/header.html');
        await loadComponent('sidebar-placeholder', 'components/sidebar.html');
        await loadComponent('footer-placeholder', 'components/footer.html');

        // Initialize dropdowns after components are loaded
        initDropdowns();

        // Add fallback click handlers for dropdowns
        addDropdownClickHandlers();

        // Load page-specific scripts
        loadPageScripts();

        // Final initialization after a delay to ensure everything is loaded
        setTimeout(function () {
            initDropdowns();
        }, 1000);
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}); 