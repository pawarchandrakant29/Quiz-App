# Quiz Application

## Overview
The Quiz Application allows users to create, manage, and participate in quizzes. It is designed for educators, trainers, and individuals to conduct assessments, improve learning, and evaluate knowledge.

---

## Features

- **Quiz Creation**:
  - Add, edit, and delete quizzes.
  - Include multiple-choice.
- **User Roles**:
  - User: Take quizzes and view results.
- **Timer and Scoring**:
  - Set time limits for quizzes.
  - Auto-calculate scores and display results.
- **Responsive Design**:
  - Optimized for desktop, tablet, and mobile devices.

---

## Technology Stack

- **Frontend**:
  - Framework: React.js
  - Styling: Material UI 

- **Backend**:
  - Framework: Node.js with Express.js
  - Database: MongoDB


---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pawarchandrakant29/Quiz-App.git
   cd Quiz-App
   ```

2. Install dependencies for the backend and frontend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Include the following variables:
     ```env
     PORT=5000
     DATABASE_URL=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     NODE_ENV=development
     ```

4. Run the application:
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend development server:
     ```bash
     cd frontend
     npm start
     ```

5. Open the app in your browser at `http://localhost:3000`.

---
