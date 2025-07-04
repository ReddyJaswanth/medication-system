# Medication Adherence System

This is a full-stack web application designed to help patients manage their medication schedules and allow caretakers to monitor their adherence. The system features separate dashboards for patients and caretakers, providing a tailored experience for each role.

## Demo

![Medication Adherence System Demo](demo-video.gif)

## Key Features

### Patient Dashboard
- **Medication Management**: Add, edit, and delete medications from a personalized list.
- **Daily Tracking**: Mark medications as taken each day and upload optional proof photos.
- **Adherence Calendar**: Visualize medication history on a calendar with color-coded dates for taken, missed, and upcoming doses.
- **Dynamic Greetings**: Receive personalized greetings based on the time of day and their username.
- **Streak & Adherence Metrics**: Track the daily streak of taken medications and view a monthly adherence rate.

### Caretaker Dashboard
- **Patient Monitoring**: View a dashboard summarizing a patient's medication adherence.
- **Multiple Views**: Switch between an overview, a detailed activity feed, a full calendar view, and notification settings.
- **Recent Activity Feed**: See a chronological list of the patient's recent medication events (taken or missed).
- **Adherence Calendar**: Access a read-only view of the patient's medication calendar.
- **Notification Preferences**: Configure email alerts for missed medications and set custom reminder schedules.

## Tech Stack

- **Frontend**: React, Vite, React Query, Axios
- **Backend**: Node.js, Express, SQLite3, bcrypt, JWT
- **Testing**: Vitest, Supertest

## Project Structure

The project is a monorepo containing two main packages:

- `frontend/`: The React-based client application.
- `backend/`: The Node.js and Express-based server and API.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd medication-system
    ```

2.  **Set up the Backend:**
    ```bash
    cd backend
    npm install
    ```
    The backend uses a SQLite database that is automatically created. No manual database setup is required.

3.  **Set up the Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```
    The frontend requires a `.env` file to connect to the backend API. Create a file named `.env` in the `frontend` directory and add the following line:
    ```
    VITE_API_URL=http://localhost:5000/api
    ```

## Running the Application

1.  **Start the Backend Server:**
    From the `backend/` directory, run:
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

2.  **Start the Frontend Development Server:**
    From the `frontend/` directory, run:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Running Tests

To run the backend tests, navigate to the `backend/` directory and execute:
```bash
npm test
```
This command runs all test suites using Vitest.
