/**
 * DataService - Handles data access and management
 * This class is designed to be easily extended for database integration
 */
class DataService {
    constructor(configUrl = null) {
        this.cache = null;
        this.cacheExpiry = null;
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes cache
        this.configUrl = configUrl;
        this.configCache = null;
    }

    /**
     * Fetch leaderboard data
     * Currently loads from static JSON file, but prepared for database integration
     * @returns {Promise<Array<Player>>} Array of Player objects
     */
    async fetchLeaderboardData() {
        // Check cache first
        if (this.cache && this.cacheExpiry && Date.now() < this.cacheExpiry) {
            return this.cache;
        }

        try {
            let response;
            
            // Load from external config URL or default file
            if (this.configUrl) {
                response = await this.loadFromExternalConfig();
            } else {
                response = await this.loadFromFile();
            }
            
            // Convert raw data to Player objects
            const players = response.map(playerData => 
                new Player(
                    playerData.id,
                    playerData.playerName,
                    playerData.points,
                    playerData.lastActive,
                    playerData // Pass entire playerData for flexible attributes
                )
            );

            // Sort by points (descending) and assign positions
            const sortedPlayers = this.sortAndAssignPositions(players);

            // Cache the result
            this.cache = sortedPlayers;
            this.cacheExpiry = Date.now() + this.cacheDuration;

            return sortedPlayers;
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
            throw new Error('Failed to load leaderboard data');
        }
    }

    /**
     * Load data from static JSON file
     * @returns {Promise<Array>} Raw player data
     */
    async loadFromFile() {
        const response = await fetch('data/leaderboard.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    /**
     * Load configuration from external URL
     * @returns {Promise<Array>} Raw player data from external config
     */
    async loadFromExternalConfig() {
        if (this.configCache) {
            return this.configCache.players || [];
        }

        const response = await fetch(this.configUrl);
        if (!response.ok) {
            throw new Error(`HTTP error loading external config! status: ${response.status}`);
        }
        
        const config = await response.json();
        this.configCache = config;

        // Load custom CSS if specified
        if (config.customCss) {
            await this.loadCustomCss(config.customCss);
        }

        return config.players || [];
    }

    /**
     * Load custom CSS file
     * @param {string} cssUrl - URL to custom CSS file
     */
    async loadCustomCss(cssUrl) {
        try {
            // Remove any existing custom CSS
            const existingLink = document.getElementById('custom-css');
            if (existingLink) {
                existingLink.remove();
            }

            // Add new custom CSS
            const link = document.createElement('link');
            link.id = 'custom-css';
            link.rel = 'stylesheet';
            link.href = cssUrl;
            document.head.appendChild(link);
        } catch (error) {
            console.warn('Failed to load custom CSS:', error);
        }
    }

    /**
     * Get configuration (for external configs)
     * @returns {object} Configuration object
     */
    getConfig() {
        return this.configCache || {};
    }

    /**
     * Future method for database integration
     * @returns {Promise<Array>} Raw player data from database
     */
    async loadFromDatabase() {
        // TODO: Implement database connection
        // This method will be implemented when database integration is required
        // Example structure:
        /*
        const connection = await this.getDatabaseConnection();
        const query = `
            SELECT id, player_name, points, last_active 
            FROM players 
            ORDER BY points DESC
        `;
        const result = await connection.query(query);
        return result.rows;
        */
        throw new Error('Database integration not yet implemented');
    }

    /**
     * Sort players by points and assign positions
     * @param {Array<Player>} players - Array of Player objects
     * @returns {Array<Player>} Sorted players with positions assigned
     */
    sortAndAssignPositions(players) {
        // Sort by points (descending), then by name (ascending) for ties
        const sorted = players.sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            }
            return a.playerName.localeCompare(b.playerName);
        });

        // Assign positions
        sorted.forEach((player, index) => {
            player.position = index + 1;
        });

        return sorted;
    }

    /**
     * Get leaderboard statistics
     * @param {Array<Player>} players - Array of Player objects
     * @returns {object} Statistics about the leaderboard
     */
    getLeaderboardStats(players) {
        if (!players || players.length === 0) {
            return {
                totalPlayers: 0,
                totalPoints: 0,
                averagePoints: 0,
                topPlayer: null,
                seniorityDistribution: {}
            };
        }

        const totalPoints = players.reduce((sum, player) => sum + player.points, 0);
        const seniorityDistribution = {};

        players.forEach(player => {
            const level = player.seniority.level;
            seniorityDistribution[level] = (seniorityDistribution[level] || 0) + 1;
        });

        return {
            totalPlayers: players.length,
            totalPoints,
            averagePoints: Math.round(totalPoints / players.length),
            topPlayer: players[0],
            seniorityDistribution
        };
    }

    /**
     * Clear cache - useful for testing or manual refresh
     */
    clearCache() {
        this.cache = null;
        this.cacheExpiry = null;
    }

    /**
     * Future method: Save player data (for database integration)
     * @param {Player} player - Player object to save
     * @returns {Promise<boolean>} Success status
     */
    async savePlayer(player) {
        // TODO: Implement when database integration is required
        throw new Error('Save functionality not yet implemented');
    }

    /**
     * Future method: Update player points (for database integration)
     * @param {number} playerId - Player ID
     * @param {number} newPoints - New points value
     * @returns {Promise<boolean>} Success status
     */
    async updatePlayerPoints(playerId, newPoints) {
        // TODO: Implement when database integration is required
        throw new Error('Update functionality not yet implemented');
    }
}