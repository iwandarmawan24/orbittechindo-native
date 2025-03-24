# Architecture Overview

This document provides an overview of the architecture of the Movie Explorer Mobile application.

## High-Level Architecture

The application follows a layered architecture pattern:

1. **Presentation Layer**: React Native components, screens, and navigation
2. **Business Logic Layer**: Contexts, hooks, and services
3. **Data Layer**: API services and local storage

## Key Components

### Navigation

The app uses React Navigation with a combination of stack and tab navigators:

- `AppNavigator`: The root navigator that handles authentication state
- `MainTabs`: Bottom tab navigator for the main app screens
- Stack navigators for authentication and movie details

### State Management

The app uses a combination of state management approaches:

- **React Context**: For global state like authentication
- **React Query**: For server state management (API data)
- **Local Component State**: For UI state
- **AsyncStorage**: For persistent storage

### Authentication

Authentication is handled by the `AuthContext` which provides:

- User login/logout functionality
- Registration
- Session management
- Protected routes

### API Integration

The `api.ts` service handles all communication with the OMDB API:

- `searchMovies`: Search for movies
- `getMovieById`: Get detailed information about a movie

### UI Components

The app uses React Native Paper for UI components, with custom components built on top:

- `MovieCard`: Displays a movie in a card format
- `MovieCarousel`: Displays featured movies in a carousel
- `FilterSection`: Provides filtering options for movie searches
- Various utility components like `LoadingIndicator`, `EmptyState`, etc.

## Data Flow

1. User interacts with the UI
2. UI components call hooks or context methods
3. Hooks/contexts call API services or update local state
4. API services fetch data from the OMDB API
5. Data flows back to the UI components for rendering

## Folder Structure

The application follows a feature-based folder structure:

- `components/`: Reusable UI components
- `contexts/`: React contexts for state management
- `navigation/`: Navigation configuration
- `screens/`: Screen components
- `services/`: API services
- `theme/`: Theme configuration
- `types/`: TypeScript type definitions

## Design Patterns

The application uses several design patterns:

- **Provider Pattern**: For global state management
- **Container/Presentational Pattern**: Separating logic from UI
- **Custom Hooks**: Encapsulating reusable logic
- **Render Props**: For component composition

## Performance Considerations

- **Memoization**: Using React.memo and useMemo to prevent unnecessary re-renders
- **Virtualization**: Using FlatList for efficient rendering of long lists
- **Lazy Loading**: Loading data only when needed
- **Caching**: Using React Query for caching API responses

## Key Differences from Web Version

When adapting the web version to React Native, several architectural changes were made:

1. **Navigation**: Replaced Next.js routing with React Navigation
2. **UI Components**: Replaced shadcn/ui with React Native Paper
3. **State Management**: Added React Context for authentication
4. **Storage**: Replaced localStorage with AsyncStorage
5. **Styling**: Replaced Tailwind CSS with React Native StyleSheet
6. **Animations**: Replaced Framer Motion with React Native Reanimated

These changes were necessary to accommodate the mobile platform while maintaining the same core functionality and user experience.

