# Recipe App

A modern web application for discovering, saving, and sharing recipes with friends.

## Tech Stack

### Frontend
- **React**: UI library for building interactive components
- **Next.js**: React framework for server-side rendering and static site generation
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework for styling

### Data Management
- **Local Storage**: Browser-based storage for saving user preferences and favorite recipes
- **Static JSON**: Pre-defined recipe data stored in static files

### Deployment
- **Vercel**: Platform optimized for Next.js deployment

## Features

- 🔍 Search for recipes by ingredient, cuisine, or dietary restrictions
- 💾 Save favorite recipes to your local collection
- 👥 Share recipes with friends via social media or email
- 🗂️ Filter recipes by categories
- 📱 Fully responsive design for all devices

## Implementation Details

### Architecture
This application follows a modern JAMstack architecture, leveraging Next.js for server-side rendering and static site generation. All data is managed client-side with no backend database.

### Data Structure
- Recipe data is stored in static JSON files
- User preferences and saved recipes are stored in browser's local storage
- The application maintains state using React's Context API or state management libraries

### Deployment Strategy
The application is deployed on Vercel, taking advantage of its global CDN for optimal performance and seamless integration with Next.js.

## Getting Started

### Prerequisites
- Node.js (v14.0.0 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/recipe.git
   cd recipe
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open https://recipe-wizard-eta.vercel.app/ in your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.