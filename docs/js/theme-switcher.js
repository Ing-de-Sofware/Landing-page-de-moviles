document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButtons = document.querySelectorAll('.theme-toggle'); // Selects both desktop and mobile buttons

    function applyTheme(theme) {
        const enableDark = theme === 'dark';
        document.documentElement.classList.toggle('dark-mode-active', enableDark);

        // Update accessible labels for all toggle buttons
        themeToggleButtons.forEach(btn => {
            btn.setAttribute('aria-label', enableDark ? 'Switch to light mode' : 'Switch to dark mode');
        });
        // Icon visibility is handled by CSS based on .dark-mode-active
    }

    function toggleTheme() {
        let currentTheme = document.documentElement.classList.contains('dark-mode-active') ? 'dark' : 'light';
        let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    themeToggleButtons.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
        // Ensure correct icon is shown on load based on theme
        // This is primarily handled by CSS, but a JS check can be a fallback
        // if CSS fails for some reason or for explicit state setting on dynamic buttons.
    });

    // Initial theme setup
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme;

    if (savedTheme) {
        currentTheme = savedTheme;
    } else {
        currentTheme = systemPrefersDark ? 'dark' : 'light';
    }
    applyTheme(currentTheme);


    // Optional: Listen to system preference changes if no user preference is set
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) { // Only if the user hasn't manually set a theme
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Initialize Materialize Sidenav (if not already done per page)
    // This is a good place for global initializations if this script is loaded on all pages
    var sidenavElems = document.querySelectorAll('.sidenav');
    if (typeof M !== 'undefined' && M.Sidenav) {
        M.Sidenav.init(sidenavElems);
    }
});
