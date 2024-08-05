# hunain-mern-10shine

# NotesNest

## Tech Stack

### Frontend
- React
- Material-UI (MUI) for UI components
- React Router for navigation
- Axios for API requests
- Tailwind CSS

### Backend
- Node.js
- Express
- MongoDB
- Mongoose (for MongoDB ORM)
- JWT (JSON Web Token) for authentication
- Mocha and Chai for testing
- Pino Logger for logging

## Third-Party Services
- None

## Environment Variables

The following environment variables are required to run this project:
- `CONNECTION`: MongoDB connection string for the main database
- `TEST_CONNECTION`: MongoDB connection string for the test database
- `TOKEN`: Secret key for JWT token generation

## Running the Project

### Backend

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   nodemon
   ```
   ### OR
   ```sh
   node index.js
   ```
   ### OR
   ```sh
   npm start
   ```
### Frontend

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Navigate to the notes-app directory:
   ```sh
   cd notes-app
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the frontend development server:
   ```sh
   npm run dev
   ```
   ### OR
   ```sh
   npm start
   ```

## Running Tests

### Backend Tests

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Run the tests:
   ```sh
   npm test
   ```

### Frontend Tests

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Run the tests:
   ```sh
   npm test
   ```

## Additional Features and Information

- **User Authentication**: Sign up and login functionality with JWT-based authentication.
- **CRUD Operations for Notes**: Users can create, read, update, and delete notes.
- **Note Tagging**: Notes can be tagged for easy categorization.
- **Note Search**: Search functionality to find notes by title or content.
- **Note Pinning**: Users can pin important notes to keep them at the top of the list.
- **Error Handling and Logging**: Comprehensive error handling and logging using Pino Logger.

---