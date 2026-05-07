# User Guide for Recipe Website Frontend

## Introduction

This user guide provides instructions for setting up and using the Recipe Website frontend application. The application is built using React, TypeScript, and Vite, offering a modern web interface for browsing, managing, and interacting with recipes. Features include user authentication, recipe browsing, chat functionality, and administrative tools.

## Prerequisites

Before getting started, ensure you have the following installed on your system:

- Node.js (version 16 or higher)
- npm or yarn package manager
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation

1. Clone or download the project repository to your local machine.

2. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

   This will install all necessary packages, including React, TypeScript, Vite, and ESLint configurations as outlined in the project setup.

## Running the Application

1. After installation, start the development server:
   ```
   npm run dev
   ```

2. Open your web browser and navigate to the URL provided by Vite (typically `http://localhost:5173`).

3. The application will load with Hot Module Replacement (HMR) enabled for a smooth development experience.

## Features and Usage

### Home Page
- The landing page of the application.
- Provides an overview of the website and navigation to other sections.

### Recipes
- Browse a collection of recipes.
- View detailed information about each recipe, including ingredients and instructions.
- Search and filter recipes based on categories or keywords.

### User Authentication
- **Register**: Create a new account by providing your details.
- **Login**: Sign in with your credentials to access personalized features.
- Use the authentication context to manage user sessions across the app.

### Profile
- View and edit your user profile.
- Manage personal settings and preferences.

### Chat
- Interact with other users or administrators through the chat feature.
- Send and receive messages in real-time.

### Administrative Features
- Admin users can manage recipes through the Admin Recipe Manager.
- Add, edit, or delete recipes using the Admin Recipe Modal.

### About and Contact
- Learn more about the website on the About page.
- Contact the developers or support team via the Contact page.

## Development Notes

This application uses Vite for fast development and building. The setup includes ESLint for code quality, with configurations for React and TypeScript.

- For production builds, run `npm run build`.
- To preview the production build, run `npm run preview`.

If you encounter issues, refer to the troubleshooting section below or check the ESLint configuration for code-related problems.

## Troubleshooting

- **Build Errors**: Ensure all dependencies are installed correctly. Try deleting `node_modules` and running `npm install` again.
- **ESLint Issues**: The project uses ESLint with React-specific rules. If you see linting errors, review the configuration in `eslint.config.js`.
- **Runtime Errors**: Check the browser console for JavaScript errors. Ensure the backend API is running if the frontend relies on it.
- **Performance**: If development is slow, consider enabling the React Compiler as described in the React documentation linked in the README.

For more advanced configurations, such as enabling stricter ESLint rules or adding React-specific plugins, refer to the original README.md file.

## Support

If you need further assistance, please contact the development team or refer to the project's issue tracker.