// Global variable for the current language
let currentLanguage = localStorage.getItem('language') || 'en'; // Default to English or last selected

/**
 * Loads translations from a JSON file and updates the UI.
 * @param {string} lang - The language code (e.g., 'en', 'es').
 */
async function loadLanguage(lang) {
    try {
        const response = await fetch(`i18n/${lang}.json`);
        if (!response.ok) {
            console.error(`❌ Error loading translation file for ${lang}: ${response.statusText}`);
            return;
        }
        const translations = await response.json();

        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const key = element.getAttribute("data-i18n");
            const translation = translations[key];

            if (translation) {
                // Avoid translating elements with complex inner HTML, log them instead.
                if (element.children.length > 0 && element.textContent.trim() !== translation.trim()) {
                    // Heuristic: if the element has children and the text content is not just the translation key
                    // it might have mixed content. Developers should handle these manually.
                    // However, if the translation itself contains HTML, we might need a more sophisticated approach
                    // or ensure translations are plain text. For now, let's assume translations are mostly text.
                    // A simple check: if translation includes '<' and '>', it might be HTML.
                    if (translation.includes('<') && translation.includes('>')) {
                         element.innerHTML = translation; // Allow HTML in translations
                    } else {
                        // If the element has children but the translation is plain text,
                        // we might want to set the text content of the first child or a specific child.
                        // This needs a more robust strategy. For now, we set textContent.
                        element.textContent = translation;
                    }
                } else {
                    element.textContent = translation;
                }
            } else {
                console.warn(`⚠️ Translation not found for key: ${key} in ${lang}.json`);
            }
        });

        // Update the lang attribute of the HTML tag
        document.documentElement.lang = lang === 'en' ? 'en-US' : 'es-PE';

        // Update the text of the language switcher button(s)
        document.querySelectorAll(".languageSwitcher").forEach(button => {
            button.textContent = lang === "en" ? "Español" : "English";
        });
        localStorage.setItem('language', lang); // Save selected language
    } catch (error) {
        console.error("❌ Error loading translation:", error);
    }
}

/**
 * Toggles the language between English and Spanish.
 */
function toggleLanguage() {
    currentLanguage = currentLanguage === "en" ? "es" : "en";
    loadLanguage(currentLanguage);
}

// Add event listeners to all language switcher buttons
document.addEventListener("DOMContentLoaded", () => {
    // Load the initial language
    loadLanguage(currentLanguage);

    // Setup listeners for all switcher buttons
    document.querySelectorAll(".languageSwitcher").forEach(button => {
        button.addEventListener("click", toggleLanguage);
    });
});
