/**
 * LeaderboardView - Handles DOM manipulation and user interface
 * Implements the View layer in MVVM pattern
 */
class LeaderboardView {
    constructor(viewModel) {
        this.viewModel = viewModel;
        this.elements = {
            leaderboardList: document.getElementById('leaderboard-list'),
            loading: document.getElementById('loading'),
            error: document.getElementById('error')
        };

        this.bindEvents();
        this.subscribeToViewModel();
    }

    /**
     * Bind DOM events
     */
    bindEvents() {
        // Add refresh functionality on header click
        const header = document.querySelector('header h1');
        if (header) {
            header.addEventListener('click', () => {
                this.viewModel.refreshLeaderboard();
            });
            header.style.cursor = 'pointer';
            header.title = 'Click to refresh leaderboard';
        }
    }

    /**
     * Subscribe to ViewModel property changes
     */
    subscribeToViewModel() {
        this.viewModel.subscribe('playersChanged', (players) => {
            this.renderLeaderboard(players);
        });

        this.viewModel.subscribe('loadingChanged', (isLoading) => {
            this.toggleLoading(isLoading);
        });

        this.viewModel.subscribe('errorChanged', (error) => {
            this.showError(error);
        });

        this.viewModel.subscribe('statsChanged', (stats) => {
            this.updateStats(stats);
        });
    }

    /**
     * Render the leaderboard
     * @param {Array<Player>} players - Array of Player objects
     */
    renderLeaderboard(players) {
        if (!this.elements.leaderboardList) return;

        // Clear existing content
        this.elements.leaderboardList.innerHTML = '';

        if (!players || players.length === 0) {
            this.renderEmptyState();
            return;
        }

        // Create leaderboard entries
        players.forEach((player, index) => {
            const entryElement = this.createLeaderboardEntry(player, index);
            this.elements.leaderboardList.appendChild(entryElement);
        });

        // Add fade-in animation
        this.elements.leaderboardList.style.opacity = '0';
        requestAnimationFrame(() => {
            this.elements.leaderboardList.style.transition = 'opacity 0.3s ease-in';
            this.elements.leaderboardList.style.opacity = '1';
        });
    }

    /**
     * Create a single leaderboard entry element
     * @param {Player} player - Player object
     * @param {number} index - Index in the list
     * @returns {HTMLElement} Leaderboard entry element
     */
    createLeaderboardEntry(player, index) {
        const entry = document.createElement('div');
        entry.className = 'leaderboard-entry';
        entry.setAttribute('data-player-id', player.id);

        // Add animation delay for staggered appearance
        entry.style.animationDelay = `${index * 50}ms`;

        const positionClass = player.position <= 3 ? `rank-${player.position}` : '';

        entry.innerHTML = `
            <div class="position ${positionClass}">
                ${player.getFormattedPosition()}
            </div>
            <div class="player">
                ${this.escapeHtml(player.playerName)}
                ${player.isActive() ? '<span style="color: #4CAF50; margin-left: 5px;">●</span>' : ''}
            </div>
            <div class="points">
                ${player.getFormattedPoints()}
            </div>
            <div class="seniority">
                <span class="seniority-badge ${player.seniority.class}">
                    ${player.seniority.level}
                </span>
            </div>
        `;

        // Add hover effect for additional info
        this.addPlayerHoverEffect(entry, player);

        return entry;
    }

    /**
     * Add hover effect to show additional player information
     * @param {HTMLElement} entry - Leaderboard entry element
     * @param {Player} player - Player object
     */
    addPlayerHoverEffect(entry, player) {
        let tooltip = null;

        entry.addEventListener('mouseenter', (e) => {
            tooltip = this.createPlayerTooltip(player);
            document.body.appendChild(tooltip);
            this.positionTooltip(tooltip, e);
        });

        entry.addEventListener('mousemove', (e) => {
            if (tooltip) {
                this.positionTooltip(tooltip, e);
            }
        });

        entry.addEventListener('mouseleave', () => {
            if (tooltip) {
                document.body.removeChild(tooltip);
                tooltip = null;
            }
        });
    }

    /**
     * Create player tooltip
     * @param {Player} player - Player object
     * @returns {HTMLElement} Tooltip element
     */
    createPlayerTooltip(player) {
        const tooltip = document.createElement('div');
        tooltip.className = 'player-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 0.9rem;
            z-index: 1000;
            max-width: 200px;
            pointer-events: none;
        `;

        tooltip.innerHTML = `
            <strong>${this.escapeHtml(player.playerName)}</strong><br>
            Position: ${player.position}<br>
            Points: ${player.getFormattedPoints()}<br>
            Level: ${player.seniority.level}<br>
            Last Active: ${new Date(player.lastActive).toLocaleDateString()}<br>
            Status: ${player.isActive() ? 'Active' : 'Inactive'}
        `;

        return tooltip;
    }

    /**
     * Position tooltip near mouse cursor
     * @param {HTMLElement} tooltip - Tooltip element
     * @param {MouseEvent} event - Mouse event
     */
    positionTooltip(tooltip, event) {
        const x = event.pageX + 10;
        const y = event.pageY - 10;
        
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }

    /**
     * Render empty state when no players are available
     */
    renderEmptyState() {
        this.elements.leaderboardList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <h3>No players found</h3>
                <p>The leaderboard is currently empty.</p>
            </div>
        `;
    }

    /**
     * Toggle loading state
     * @param {boolean} isLoading - Whether app is loading
     */
    toggleLoading(isLoading) {
        if (this.elements.loading) {
            this.elements.loading.style.display = isLoading ? 'block' : 'none';
        }
        
        if (this.elements.leaderboardList) {
            this.elements.leaderboardList.style.display = isLoading ? 'none' : 'block';
        }
    }

    /**
     * Show error message
     * @param {string} error - Error message
     */
    showError(error) {
        if (!this.elements.error) return;

        if (error) {
            this.elements.error.textContent = error;
            this.elements.error.style.display = 'block';
        } else {
            this.elements.error.style.display = 'none';
        }
    }

    /**
     * Update statistics display (future enhancement)
     * @param {object} stats - Statistics object
     */
    updateStats(stats) {
        // This could be used to display statistics in the UI
        // For now, we'll log them to console for debugging
        if (stats) {
            console.log('Leaderboard Stats:', stats);
        }
    }

    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Scroll to specific player in the leaderboard
     * @param {number} playerId - Player ID to scroll to
     */
    scrollToPlayer(playerId) {
        const playerElement = this.elements.leaderboardList.querySelector(
            `[data-player-id="${playerId}"]`
        );
        
        if (playerElement) {
            playerElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Briefly highlight the player
            playerElement.style.backgroundColor = '#ffeb3b';
            setTimeout(() => {
                playerElement.style.backgroundColor = '';
            }, 2000);
        }
    }

    /**
     * Add CSS animation keyframes if not already present
     */
    addAnimationStyles() {
        if (!document.querySelector('#leaderboard-animations')) {
            const style = document.createElement('style');
            style.id = 'leaderboard-animations';
            style.textContent = `
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .leaderboard-entry {
                    animation: fadeInUp 0.3s ease-out forwards;
                    opacity: 0;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Initialize the view
     */
    initialize() {
        this.addAnimationStyles();
        // Additional initialization if needed
    }
}