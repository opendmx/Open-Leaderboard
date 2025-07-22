/**
 * Internationalization (i18n) system for Gaming Leaderboard
 * Provides multi-language support with fallback to English
 */
class I18n {
    constructor() {
        this.currentLanguage = 'en';
        this.fallbackLanguage = 'en';
        this.translations = {};
        this.observers = [];
        
        // Load saved language preference
        this.loadLanguagePreference();
    }

    /**
     * Load language preference from localStorage
     */
    loadLanguagePreference() {
        const saved = localStorage.getItem('leaderboard-language');
        if (saved && this.isLanguageSupported(saved)) {
            this.currentLanguage = saved;
        }
    }

    /**
     * Save language preference to localStorage
     */
    saveLanguagePreference() {
        localStorage.setItem('leaderboard-language', this.currentLanguage);
    }

    /**
     * Check if language is supported
     * @param {string} lang - Language code
     * @returns {boolean} Whether language is supported
     */
    isLanguageSupported(lang) {
        return ['en', 'es', 'de'].includes(lang);
    }

    /**
     * Load translation for a specific language
     * @param {string} lang - Language code
     * @param {object} translations - Translation object
     */
    loadTranslations(lang, translations) {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        Object.assign(this.translations[lang], translations);
    }

    /**
     * Set current language
     * @param {string} lang - Language code
     */
    setLanguage(lang) {
        if (this.isLanguageSupported(lang)) {
            this.currentLanguage = lang;
            this.saveLanguagePreference();
            this.notifyObservers();
        }
    }

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get available languages
     * @returns {Array} Array of language objects
     */
    getAvailableLanguages() {
        return [
            { code: 'en', name: 'English', nativeName: 'English' },
            { code: 'es', name: 'Spanish', nativeName: 'Español' },
            { code: 'de', name: 'German', nativeName: 'Deutsch' }
        ];
    }

    /**
     * Translate a key
     * @param {string} key - Translation key
     * @param {object} params - Parameters for interpolation
     * @returns {string} Translated text
     */
    t(key, params = {}) {
        const translation = this.getTranslation(key);
        return this.interpolate(translation, params);
    }

    /**
     * Get translation for a key
     * @param {string} key - Translation key
     * @returns {string} Translation or key if not found
     */
    getTranslation(key) {
        // Try current language
        if (this.translations[this.currentLanguage] && 
            this.translations[this.currentLanguage][key]) {
            return this.translations[this.currentLanguage][key];
        }

        // Fallback to English
        if (this.currentLanguage !== this.fallbackLanguage &&
            this.translations[this.fallbackLanguage] && 
            this.translations[this.fallbackLanguage][key]) {
            return this.translations[this.fallbackLanguage][key];
        }

        // Return key if translation not found
        console.warn(`Translation not found for key: ${key}`);
        return key;
    }

    /**
     * Interpolate parameters into translation
     * @param {string} text - Text with placeholders
     * @param {object} params - Parameters to interpolate
     * @returns {string} Interpolated text
     */
    interpolate(text, params) {
        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * Subscribe to language changes
     * @param {function} callback - Callback function
     */
    subscribe(callback) {
        this.observers.push(callback);
    }

    /**
     * Notify observers of language change
     */
    notifyObservers() {
        this.observers.forEach(callback => callback(this.currentLanguage));
    }
}

// Global instance
const i18n = new I18n();

// Expose globally for easy access
if (typeof window !== 'undefined') {
    window.i18n = i18n;
}