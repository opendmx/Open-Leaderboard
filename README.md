# 🏆 Gaming Leaderboard

A modern, responsive leaderboard website for tracking player rankings and achievements. Built with vanilla JavaScript using the MVVM (Model-View-ViewModel) architectural pattern.

![Leaderboard Screenshot](https://github.com/user-attachments/assets/47534e9b-2ba8-4328-abd8-789158dad2bb)

## 🌟 Features

- **Player Rankings**: Display players ranked by points with position indicators
- **Seniority System**: 10 different skill levels based on points earned
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Interactive UI**: Hover tooltips showing detailed player information
- **Real-time Updates**: Click header to refresh leaderboard data
- **Extensible Architecture**: Prepared for future database integration

## 🎯 Seniority Levels

The leaderboard features 10 distinct seniority levels based on points:

| Level | Points Range | Badge Color |
|-------|--------------|-------------|
| 🆕 Rookie | 0-99 | Gray |
| 🌱 Beginner | 100-299 | Light Green |
| 📚 Apprentice | 300-599 | Green |
| ⚡ Intermediate | 600-999 | Cyan |
| 🚀 Advanced | 1000-1499 | Blue |
| 🎯 Expert | 1500-2199 | Indigo |
| 👑 Master | 2200-2999 | Purple |
| 🏆 Champion | 3000-3999 | Pink |
| ⭐ Legend | 4000-4999 | Orange |
| 💎 Hero | 5000+ | Gold Gradient |

## 🏗️ Architecture

This project follows the **MVVM (Model-View-ViewModel)** pattern:

### 📁 Project Structure

```
├── index.html                 # Main HTML file
├── css/
│   └── styles.css            # Styling and responsive design
├── js/
│   ├── models/
│   │   ├── Player.js         # Player data model
│   │   └── DataService.js    # Data access layer
│   ├── viewmodels/
│   │   └── LeaderboardViewModel.js  # Business logic
│   ├── views/
│   │   └── LeaderboardView.js       # UI manipulation
│   └── app.js                # Application entry point
├── data/
│   └── leaderboard.json      # Static player data
└── package.json              # Project configuration
```

### 🔧 Components

- **Model Layer**: Handles data structures and data access
  - `Player.js`: Player model with seniority calculation
  - `DataService.js`: Data fetching and caching (prepared for database integration)

- **ViewModel Layer**: Business logic and data binding
  - `LeaderboardViewModel.js`: Manages player data, statistics, and notifications

- **View Layer**: User interface and DOM manipulation
  - `LeaderboardView.js`: Renders leaderboard, handles user interactions

## 🚀 Getting Started

### Prerequisites

- Python 3.x (for local development server)
- Modern web browser

### Installation & Running

1. **Clone the repository**:
   ```bash
   git clone https://github.com/opendmx/test1.git
   cd test1
   ```

2. **Start the development server**:
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Or using npm script
   npm start
   ```

3. **Open in browser**:
   ```
   http://localhost:8000
   ```

## 🚀 Live Demo

The Gaming Leaderboard is automatically deployed to GitHub Pages via GitHub Actions:

🌐 **[View Live Demo](https://opendmx.github.io/Open-Leaderboard/)**

### Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch. The deployment workflow:

- ✅ Triggers on pushes to `main` branch
- ✅ Uses GitHub Actions for automated deployment
- ✅ Serves static files directly (no build process required)
- ✅ Available at: `https://opendmx.github.io/Open-Leaderboard/`

## 🎮 Usage

- **View Rankings**: Players are automatically sorted by points in descending order
- **Hover for Details**: Hover over any player to see detailed information
- **Refresh Data**: Click the header title to refresh the leaderboard
- **Responsive**: View on any device - the layout adapts automatically

## 🔮 Future Enhancements

The application is designed for easy extension:

### Database Integration
The `DataService` class is prepared for database integration:
```javascript
// Future method implementation
async loadFromDatabase() {
    const connection = await this.getDatabaseConnection();
    const query = `SELECT id, player_name, points, last_active FROM players ORDER BY points DESC`;
    const result = await connection.query(query);
    return result.rows;
}
```

### Additional Features
- Player search functionality
- Statistics dashboard
- Achievement system
- Real-time updates via WebSocket
- Player profiles and history
- Admin panel for data management

## 🛠️ Technical Details

### Data Format

Player data structure:
```json
{
    "id": 1,
    "playerName": "DragonSlayer99",
    "points": 5245,
    "lastActive": "2024-01-15"
}
```

### Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance

- Efficient data caching (5-minute cache duration)
- Optimized DOM updates
- Smooth animations and transitions
- Responsive image loading



## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Development Notes

### MVVM Implementation

This project demonstrates a clean MVVM architecture:

- **Separation of Concerns**: Each layer has distinct responsibilities
- **Data Binding**: ViewModel notifies View of data changes
- **Testability**: Business logic is separated from UI code
- **Maintainability**: Modular structure makes code easy to maintain

### Code Quality

- ES6+ JavaScript features
- Comprehensive error handling
- Performance monitoring
- Responsive design principles
- Accessibility considerations
