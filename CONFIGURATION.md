# Flexible Leaderboard Configuration

This document explains how to use the flexible configuration features of the Open Leaderboard.

## Overview

The leaderboard supports flexible configuration through external JSON files that can be loaded via URL parameters. This allows customization of content, layout, styling, and behavior without modifying the core application code.

## Basic Usage

### Default Mode
```
http://localhost:8000
```
Shows the default leaderboard with predefined players and styling.

### External Configuration Mode
```
http://localhost:8000?config=your-config.json
```
Loads configuration from the specified JSON file, which can be a local file or external URL.

## Configuration File Structure

A configuration file is a JSON object with the following optional properties:

### Basic Configuration
```json
{
  "title": "Custom Tournament",
  "subtitle": "Track rankings and achievements",
  "customCss": "custom-styles.css",
  "players": [...],
  "columns": [...]
}
```

### Player Data Structure
```json
{
  "players": [
    {
      "id": 1,
      "playerName": "ProGamer",
      "points": 9500,
      "lastActive": "2024-01-16",
      "icon": "https://example.com/avatar.png",
      "image": "https://example.com/photo.jpg",
      "link": "https://example.com/profile",
      "team": "Alpha Squad",
      "country": "USA",
      "customAttribute": "Any value"
    }
  ]
}
```

### Column Configuration
```json
{
  "columns": [
    {
      "field": "position",
      "label": "Rank",
      "class": "position"
    },
    {
      "field": "icon",
      "label": "Avatar",
      "class": "icon"
    },
    {
      "field": "playerName",
      "label": "Player",
      "class": "player"
    },
    {
      "field": "customAttribute",
      "label": "Custom",
      "class": "custom"
    }
  ]
}
```

## Supported Features

### 1. Custom Player Attributes
- Add any custom attributes to player objects
- They will be displayed in tooltips
- Use in custom columns by referencing the attribute name

### 2. Player Icons and Images
- `icon`: Small avatar image (recommended: 40x40px)
- `image`: Larger player image (recommended: 60x60px)

### 3. External Links
- `link`: URL that opens when player entry is clicked
- Links open in new tabs/windows

### 4. Custom CSS Styling
- `customCss`: Path to CSS file that overrides default styles
- CSS is loaded dynamically and applied to the page

### 5. Flexible Columns
- Define which columns to display and their order
- Support for built-in fields: `position`, `playerName`, `points`, `seniority`, `icon`, `image`
- Support for any custom attribute names

### 6. Tooltips
- Hover over any player to see detailed information
- Automatically includes all custom attributes

## Built-in Field Types

| Field | Description | Example |
|-------|-------------|---------|
| `position` | Player rank with medals for top 3 | 🥇 1st, 🥈 2nd, 🥉 3rd, 4th |
| `playerName` | Player name with activity indicator | ProGamer ● |
| `points` | Formatted point total | 9,500 |
| `seniority` | Calculated level based on points | Hero, Legend, etc. |
| `icon` | Small circular avatar image | ![icon] |
| `image` | Larger rectangular image | ![image] |

## Example Configuration Files

### Basic Tournament Setup
```json
{
  "title": "Weekly Tournament",
  "subtitle": "Compete for the crown!",
  "players": [
    {
      "id": 1,
      "playerName": "Champion",
      "points": 10000,
      "lastActive": "2024-01-16",
      "team": "Elite"
    }
  ]
}
```

### Advanced Configuration with Custom Styling
```json
{
  "title": "Pro League Championship",
  "subtitle": "The ultimate gaming competition",
  "customCss": "pro-league-theme.css",
  "columns": [
    {"field": "position", "label": "Rank", "class": "rank"},
    {"field": "icon", "label": "", "class": "avatar"},
    {"field": "playerName", "label": "Player", "class": "name"},
    {"field": "team", "label": "Team", "class": "team"},
    {"field": "points", "label": "Score", "class": "score"}
  ],
  "players": [
    {
      "id": 1,
      "playerName": "ProGamer2024",
      "points": 15000,
      "lastActive": "2024-01-16",
      "icon": "https://example.com/avatars/pro.png",
      "team": "Legends",
      "sponsor": "TechCorp",
      "region": "North America",
      "link": "https://example.com/player/pro2024"
    }
  ]
}
```

## CSS Customization

Custom CSS files can override any aspect of the leaderboard styling:

```css
/* Custom header styling */
header h1 {
    color: #FFD700 !important;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
}

/* Custom team column */
.team {
    font-weight: bold;
    color: #2196F3;
    text-align: center;
}

/* Enhanced hover effects */
.leaderboard-entry[style*="cursor: pointer"]:hover {
    background: linear-gradient(90deg, #fff3e0 0%, #ffe0b2 100%) !important;
    border-left: 4px solid #FFD700 !important;
}
```

## Error Handling

- If the external configuration file fails to load, the application falls back to default mode
- Invalid JSON configurations are logged to the console and ignored
- Missing custom CSS files are logged as warnings but don't break functionality
- Unknown field types in columns are rendered as text

## Performance Considerations

- Configuration files are cached for 5 minutes to reduce server requests
- Custom CSS is loaded asynchronously to avoid blocking the main interface
- Player images should be optimized for web (recommended: < 50KB each)

## Browser Support

- Modern browsers with ES6+ support
- Tested on Chrome, Firefox, Safari, and Edge
- Mobile responsive design maintained with custom configurations