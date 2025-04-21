# React Tetris Game

A modern Tetris clone built with React, TypeScript, and Tailwind CSS.

![Tetris Game Screenshot](https://via.placeholder.com/800x450.png?text=Tetris+Game+Screenshot)

## Features

- Classic Tetris gameplay with modern web technologies
- Responsive design that works on both desktop and mobile
- Customizable controls and settings
- Dark/light theme options
- High score tracking with localStorage
- Ghost piece preview (optional)
- Adjustable game speed and difficulty

## Tech Stack

- **React 19** for UI components and rendering
- **TypeScript** for type safety and better developer experience
- **Vite** for lightning-fast builds and development
- **Tailwind CSS** for styling
- **Headless UI** for accessible component primitives
- **Context API** for game state management

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v7 or later)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tetris.git
cd tetris
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Game Controls

- **←/→**: Move tetromino left/right
- **↑**: Rotate tetromino
- **↓**: Soft drop (move down faster)
- **Space**: Hard drop (instantly drop the tetromino)
- **Esc**: Pause/Resume game

Controls can be customized in the Settings menu.

## Build and Deployment

### Local Build

To build the application locally:

```bash
npm run build
```

The built files will be in the `dist` directory.

### GitHub Pages Deployment

To deploy the game to GitHub Pages:

1. Update the `homepage` field in `package.json` with your GitHub username:

```json
"homepage": "https://yourusername.github.io/tetris"
```

2. Run the deploy script:

```bash
npm run deploy
```

This will build the project and publish it to the `gh-pages` branch of your repository.

## Project Structure

```
tetris/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and other assets
│   ├── components/      # React components
│   ├── contexts/        # React contexts for state management
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Game services and logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main App component
│   ├── index.css        # Global styles and Tailwind
│   └── main.tsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Game Architecture

The game is built with a modular architecture:

- **Game Service**: Handles game logic, tetromino movement, collision detection, line clearing, and scoring
- **Tetromino Service**: Manages tetromino generation, rotation, and collision detection
- **Storage Service**: Handles saving/loading high scores and settings using localStorage
- **Game Context**: Provides game state and dispatch functions to all components
- **UI Components**: Render the game board, tetrominoes, scores, and menus

## License

MIT

## Acknowledgments

- Original Tetris game by Alexey Pajitnov
- React and TypeScript communities for excellent documentation and resources
- Tailwind CSS for making styling a breeze
