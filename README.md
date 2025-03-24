# Movie Explorer Mobile

A React Native mobile application for exploring movies, TV shows, and more. This is the mobile version of the Movie Explorer web application.

## Features

- **Authentication**: User registration and login functionality
- **Movie Search**: Search for movies, TV shows, and episodes
- **Movie Details**: View detailed information about movies
- **Filtering**: Filter search results by type and year
- **Favorites**: Save and manage your favorite movies
- **User Profile**: View and manage your profile information
- **Responsive Design**: Optimized for various mobile screen sizes

## Tech Stack

- **React Native**: Core framework for building the mobile app
- **Expo**: Development platform for React Native
- **React Navigation**: Navigation library for React Native
- **React Native Paper**: Material Design components for React Native
- **React Query**: Data fetching and state management
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation
- **React Native Reanimated**: Advanced animations
- **AsyncStorage**: Local storage solution
- **OMDB API**: Movie database API

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/movie-explorer-mobile.git
   cd movie-explorer-mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on a device or emulator:
   - Press `i` to run on iOS Simulator
   - Press `a` to run on Android Emulator
   - Scan the QR code with the Expo Go app on your physical device

## Detailed Setup Instructions

To set up this React Native project from scratch, follow these steps:

1. Create a new Expo project:
   ```bash
   npx create-expo-app MovieExplorerNative
   cd MovieExplorerNative
   ```

2. Install the required dependencies:
   ```bash
   npm install \
     @react-navigation/native \
     @react-navigation/native-stack \
     @react-navigation/bottom-tabs \
     react-native-paper \
     react-native-vector-icons \
     @react-native-async-storage/async-storage \
     react-native-reanimated \
     react-native-gesture-handler \
     react-native-safe-area-context \
     @tanstack/react-query \
     react-hook-form \
     @hookform/resolvers \
     zod \
     expo-linear-gradient
   ```

3. Update your `babel.config.js` to include the Reanimated plugin:
   ```javascript
   module.exports = {
     presets: ['babel-preset-expo'],
     plugins: ['react-native-reanimated/plugin'],
   };
   ```

## API Integration

This app uses the OMDB API to fetch movie data. You'll need to obtain an API key from [OMDB API](http://www.omdbapi.com/) and update it in the `src/services/api.ts` file.

## Authentication

The app includes a mock authentication system for demonstration purposes. In a production environment, you would replace this with a real authentication service.

Demo credentials:
- Email: user@example.com
- Password: password123

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OMDB API](http://www.omdbapi.com/) for providing movie data
- [React Native Paper](https://callstack.github.io/react-native-paper/) for UI components
- [React Navigation](https://reactnavigation.org/) for navigation

