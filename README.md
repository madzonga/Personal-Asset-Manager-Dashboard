# Project Name

## Description
A brief description of your application and its purpose.

## Prerequisites

Before you start, ensure you have the following installed:

- **Node.js**: [Download and Install Node.js](https://nodejs.org/)  
  Ensure you're using a supported version (e.g., v16 or later).
  
- **npm**: npm is the default package manager that comes with Node.js.
  You can verify that both Node.js and npm are installed by running:
  ```bash
  node -v
  npm -v

## Setup Instructions

Follow the steps below to set up the project locally:
1.	Clone the repository:
    Clone the repository to your local machine using Git:
    - `git clone git@github.com:madzonga/personal-asset-manager-dashboard.git`

2.	Navigate to the project directory:
    Change to the project directory:
    - `cd personal-asset-manager-dashboard`

3.	Install dependencies:
    Install the project dependencies using npm:
    - `npm install`
    This will install all the necessary dependencies listed in the package.json file.

## Database Setup

To set up the PostgreSQL database and Adminer, follow these steps:
1.	Run the Database with Docker Compose:
    The project includes a docker-compose.yml file configured to set up a PostgreSQL database and an Adminer UI.
    Start the database by running:
    - `docker-compose up -d`

    This command will:
    -	Spin up a PostgreSQL container accessible on localhost:5432.
    -	Set up an Adminer instance accessible on http://localhost:8080 for database management.

2.	Database Configuration:
    The database is set up with the following environment variables:
    -	POSTGRES_USER: myuser
    -   POSTGRES_PASSWORD: mypassword
    -	POSTGRES_DB: mydatabase

    You can modify these values directly in the docker-compose.yml file if needed, don't forget to change them in the .env file as well.

3.	Accessing Adminer:
    After starting the containers, you can manage the PostgreSQL database using Adminer:
    -	Open your browser and go to http://localhost:8080.
    -	Use the database details to log in:

4.	Run Migrations:
    If your application includes database migrations, run the migrations to set up the necessary tables:
    - `npm run migrate`

## Running the Application

After setting up the project, you can run it locally by following the instructions below.
1.	Start the development server:
    To run the application in development mode, use the following command:
    - `npm run start:dev`
    This will start the server and watch for file changes. The application should be available at http://localhost:3000 (or another port if specified).

2.	Access the application:
    Open your browser and go to:
    - `http://localhost:3000`
    You should see the app running locally.

## Running Tests

To ensure that everything works correctly, you can run tests locally.
1.	Run unit tests:
    Use the following command to run the unit tests using Jest (or your chosen test framework):
    - `npm test`
    This will run the tests defined in the project and output the results to the console.

2.	Run linting:
    To check the code quality and ensure it adheres to the style guide, run:
    - `npm run lint`
    This will run ESLint (if configured) and highlight any linting issues in the code.

## GitHub Actions

This repository is integrated with GitHub Actions to automate linting, building, and testing. The workflows are configured in the .github/workflows/ directory.
-	CI Workflow: Runs on every push or pull request to the main branch. It checks the code quality, installs dependencies,  builds the project, and runs tests.
- Lint and Lockfile Verification Workflow: Runs on every push or pull request to the main branch. Runs linting and verifies that the lockfile is up to date.

## Environment Variables

If your application requires any environment variables, create a .env file in the root of the project with the necessary variables. Use .env.sample as your guide.

## Troubleshooting

If you encounter any issues, check the following:
-	Ensure you have all the required dependencies installed.
-	Review any error messages in the terminal for more information.
-	Refer to the project’s documentation or open an issue if you need further assistance.

