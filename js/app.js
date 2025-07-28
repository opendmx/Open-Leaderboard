/**
 * Main Application Entry Point
 * Initializes the MVVM components and starts the application
 */

// Application configuration
const AppConfig = {
    version: '1.0.0',
    name: 'Gaming Leaderboard',
    debug: false
};

/**
 * Application class - Manages the overall application lifecycle
 */
class App {
    constructor() {
        this.viewModel = null;
        this.view = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     */
    async initialize() {
        try {
            this.log('Initializing Gaming Leaderboard...');

            // Check if DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                await this.start();
            }

        } catch (error) {
            this.handleError('Failed to initialize application', error);
        }
    }

    /**
     * Start the application
     */
    async start() {
        try {
            this.log('Starting application...');

            // Initialize language system
            this.initializeLanguageSystem();

            // Initialize ViewModel
            this.viewModel = new LeaderboardViewModel();
            
            // Initialize View
            this.view = new LeaderboardView(this.viewModel);
            this.view.initialize();

            // Load initial data
            await this.viewModel.loadLeaderboard();

            this.isInitialized = true;
            this.log('Application started successfully');

            // Set up global error handling
            this.setupErrorHandling();

            // Set up performance monitoring
            this.setupPerformanceMonitoring();

        } catch (error) {
            this.handleError('Failed to start application', error);
        }
    }

    /**
     * Initialize language system
     */
    initializeLanguageSystem() {
        if (typeof i18n !== 'undefined') {
            // Apply initial language to page
            document.documentElement.lang = i18n.getCurrentLanguage();
            document.title = i18n.t('app.title');
            
            // Update all translatable elements
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (key) {
                    element.textContent = i18n.t(key);
                }
            });
        }
    }

    /**
     * Set up global error handling
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            this.handleError('Uncaught error', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError('Unhandled promise rejection', event.reason);
        });
    }

    /**
     * Set up performance monitoring
     */
    setupPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        this.log(`Page load time: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
                    }
                }, 0);
            });
        }
    }

    /**
     * Handle application errors
     * @param {string} message - Error message
     * @param {Error} error - Error object
     */
    handleError(message, error) {
        console.error(`[${AppConfig.name}] ${message}:`, error);
        
        // Show user-friendly error message
        if (this.viewModel) {
            const errorMsg = typeof i18n !== 'undefined' ? 
                i18n.t('app.error.general') : 
                'Something went wrong. Please try refreshing the page.';
            this.viewModel.setError(errorMsg);
        }

        // In a production environment, you might want to send error reports
        // to a logging service here
    }

    /**
     * Log messages (only in debug mode)
     * @param {string} message - Message to log
     */
    log(message) {
        if (AppConfig.debug) {
            console.log(`[${AppConfig.name}] ${message}`);
        }
    }

    /**
     * Get application status
     * @returns {object} Application status information
     */
    getStatus() {
        return {
            version: AppConfig.version,
            isInitialized: this.isInitialized,
            hasData: this.viewModel ? this.viewModel.hasData() : false,
            playerCount: this.viewModel ? this.viewModel.getPlayers().length : 0
        };
    }

    /**
     * Refresh the application data
     */
    async refresh() {
        if (this.viewModel) {
            await this.viewModel.refreshLeaderboard();
        }
    }

    /**
     * Get reference to ViewModel (for debugging or extensions)
     * @returns {LeaderboardViewModel} ViewModel instance
     */
    getViewModel() {
        return this.viewModel;
    }

    /**
     * Get reference to View (for debugging or extensions)
     * @returns {LeaderboardView} View instance
     */
    getView() {
        return this.view;
    }
}

// Global application instance
let app;

/**
 * Initialize and start the application
 */
function initializeApp() {
    app = new App();
    app.initialize();
}

// Auto-start the application
initializeApp();

// Expose app globally for debugging
if (typeof window !== 'undefined') {
    window.LeaderboardApp = {
        app: () => app,
        config: AppConfig,
        refresh: () => app ? app.refresh() : null,
        status: () => app ? app.getStatus() : null
    };
}

// Export for module systems (if needed in the future)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, AppConfig };
}