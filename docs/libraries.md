# Library Documentation

This document provides an overview of the libraries used in the project and how they are integrated.

## Zustand

Zustand is used for state management in the project. It is implemented in various stores to manage different aspects of the application's state.

- **Movie Store**: Manages movie-related state, including search functionality.
  ```typescript
  // store/movie-store.ts
  import { create } from "zustand";
  // ... existing code ...
  export const useMovieStore = create<MovieState>((set, get) => ({
    movies: [],
    searchTerm: "",
    // ... existing code ...
  }));

