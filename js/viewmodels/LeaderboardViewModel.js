/**
 * LeaderboardViewModel - Business logic and data management for leaderboard
 * Implements the ViewModel layer in MVVM pattern
 */
class LeaderboardViewModel {
    constructor(configUrl = null) {
        this.dataService = new DataService(configUrl);
        this.players = [];
        this.isLoading = false;
        this.error = null;
        this.stats = null;
        
        // Observable properties for view binding
        this.observers = {
            playersChanged: [],
            loadingChanged: [],
            errorChanged: [],
            statsChanged: []
        };
    }

    /**
     * Subscribe to property changes
     * @param {string} property - Property to observe
     * @param {function} callback - Callback function
     */
    subscribe(property, callback) {
        if (this.observers[property]) {
            this.observers[property].push(callback);
        }
    }

    /**
     * Notify observers of property changes
     * @param {string} property - Property that changed
     * @param {*} value - New value
     */
    notify(property, value) {
        if (this.observers[property]) {
            this.observers[property].forEach(callback => callback(value));
        }
    }

    /**
     * Load leaderboard data
     * @returns {Promise<void>}
     */
    async loadLeaderboard() {
        try {
            this.setLoading(true);
            this.setError(null);

            const players = await this.dataService.fetchLeaderboardData();
            this.setPlayers(players);
            
            // Calculate and set statistics
            const stats = this.dataService.getLeaderboardStats(players);
            this.setStats(stats);

        } catch (error) {
            console.error('Error in loadLeaderboard:', error);
            this.setError(error.message);
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Refresh leaderboard data (clear cache and reload)
     * @returns {Promise<void>}
     */
    async refreshLeaderboard() {
        this.dataService.clearCache();
        await this.loadLeaderboard();
    }

    /**
     * Get players by seniority level
     * @param {string} seniorityLevel - Seniority level to filter by
     * @returns {Array<Player>} Filtered players
     */
    getPlayersBySeniority(seniorityLevel) {
        return this.players.filter(player => 
            player.seniority.level === seniorityLevel
        );
    }

    /**
     * Get top N players
     * @param {number} count - Number of top players to return
     * @returns {Array<Player>} Top players
     */
    getTopPlayers(count = 10) {
        return this.players.slice(0, count);
    }

    /**
     * Search players by name
     * @param {string} searchTerm - Search term
     * @returns {Array<Player>} Matching players
     */
    searchPlayers(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            return this.players;
        }

        const term = searchTerm.toLowerCase().trim();
        return this.players.filter(player =>
            player.playerName.toLowerCase().includes(term)
        );
    }

    /**
     * Get player by ID
     * @param {number} playerId - Player ID
     * @returns {Player|null} Player object or null if not found
     */
    getPlayerById(playerId) {
        return this.players.find(player => player.id === playerId) || null;
    }

    /**
     * Get seniority level information
     * @returns {Array<object>} Array of seniority level definitions
     */
    getSeniorityLevels() {
        return [
            { level: 'Rookie', min: 0, max: 99, description: 'Just starting out' },
            { level: 'Beginner', min: 100, max: 299, description: 'Learning the basics' },
            { level: 'Apprentice', min: 300, max: 599, description: 'Getting the hang of it' },
            { level: 'Intermediate', min: 600, max: 999, description: 'Solid foundation' },
            { level: 'Advanced', min: 1000, max: 1499, description: 'Skilled player' },
            { level: 'Expert', min: 1500, max: 2199, description: 'Highly experienced' },
            { level: 'Master', min: 2200, max: 2999, description: 'Elite level' },
            { level: 'Champion', min: 3000, max: 3999, description: 'Competition winner' },
            { level: 'Legend', min: 4000, max: 4999, description: 'Legendary skills' },
            { level: 'Hero', min: 5000, max: Infinity, description: 'Ultimate achievement' }
        ];
    }

    // Property setters with notification
    setPlayers(players) {
        this.players = players || [];
        this.notify('playersChanged', this.players);
    }

    setLoading(isLoading) {
        this.isLoading = isLoading;
        this.notify('loadingChanged', this.isLoading);
    }

    setError(error) {
        this.error = error;
        this.notify('errorChanged', this.error);
    }

    setStats(stats) {
        this.stats = stats;
        this.notify('statsChanged', this.stats);
    }

    // Property getters
    getPlayers() {
        return this.players;
    }

    getIsLoading() {
        return this.isLoading;
    }

    getError() {
        return this.error;
    }

    getStats() {
        return this.stats;
    }

    /**
     * Get formatted statistics for display
     * @returns {object} Formatted statistics
     */
    getFormattedStats() {
        if (!this.stats) return null;

        return {
            ...this.stats,
            formattedTotalPoints: this.stats.totalPoints.toLocaleString(),
            formattedAveragePoints: this.stats.averagePoints.toLocaleString(),
            topPlayerName: this.stats.topPlayer ? this.stats.topPlayer.playerName : 'N/A'
        };
    }

    /**
     * Check if leaderboard has data
     * @returns {boolean} Whether leaderboard has players
     */
    hasData() {
        return this.players && this.players.length > 0;
    }

    /**
     * Get configuration for the view
     * @returns {object} Configuration object
     */
    getConfig() {
        return this.dataService.getConfig();
    }
}