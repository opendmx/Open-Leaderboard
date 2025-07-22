/**
 * Player Model - Represents a player in the leaderboard
 */
class Player {
    constructor(id, playerName, points, lastActive) {
        this.id = id;
        this.playerName = playerName;
        this.points = points;
        this.lastActive = lastActive;
        this.position = 0; // Will be set by the ViewModel
        this.seniority = this.calculateSeniority(points);
    }

    /**
     * Calculate seniority level based on points
     * @param {number} points - Player's points
     * @returns {object} Seniority information with level and class
     */
    calculateSeniority(points) {
        const seniorityLevels = [
            { min: 0, max: 99, level: 'rookie', class: 'seniority-rookie' },
            { min: 100, max: 299, level: 'beginner', class: 'seniority-beginner' },
            { min: 300, max: 599, level: 'apprentice', class: 'seniority-apprentice' },
            { min: 600, max: 999, level: 'intermediate', class: 'seniority-intermediate' },
            { min: 1000, max: 1499, level: 'advanced', class: 'seniority-advanced' },
            { min: 1500, max: 2199, level: 'expert', class: 'seniority-expert' },
            { min: 2200, max: 2999, level: 'master', class: 'seniority-master' },
            { min: 3000, max: 3999, level: 'champion', class: 'seniority-champion' },
            { min: 4000, max: 4999, level: 'legend', class: 'seniority-legend' },
            { min: 5000, max: Infinity, level: 'hero', class: 'seniority-hero' }
        ];

        const seniority = seniorityLevels.find(level => 
            points >= level.min && points <= level.max
        );

        return seniority || seniorityLevels[0]; // Default to rookie if not found
    }

    /**
     * Get translated seniority level name
     * @returns {string} Translated seniority level
     */
    getSeniorityDisplayName() {
        if (typeof i18n !== 'undefined') {
            return i18n.t(`seniority.${this.seniority.level}`);
        }
        // Fallback for when i18n is not loaded yet
        return this.seniority.level.charAt(0).toUpperCase() + this.seniority.level.slice(1);
    }

    /**
     * Get formatted points with commas
     * @returns {string} Formatted points
     */
    getFormattedPoints() {
        return this.points.toLocaleString();
    }

    /**
     * Get position with appropriate suffix (1st, 2nd, 3rd, etc.)
     * @returns {string} Formatted position
     */
    getFormattedPosition() {
        const position = this.position;
        if (position === 1) return '🥇 1st';
        if (position === 2) return '🥈 2nd';
        if (position === 3) return '🥉 3rd';
        
        const suffix = position % 10 === 1 && position !== 11 ? 'st' :
                      position % 10 === 2 && position !== 12 ? 'nd' :
                      position % 10 === 3 && position !== 13 ? 'rd' : 'th';
        
        return `${position}${suffix}`;
    }

    /**
     * Check if player is active (played within last 7 days)
     * @returns {boolean} Whether player is active
     */
    isActive() {
        const lastActiveDate = new Date(this.lastActive);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return lastActiveDate >= sevenDaysAgo;
    }
}