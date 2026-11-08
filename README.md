# Pet Electronic Booklet

A full-stack web application that serves as a digital health passport for pets. Users can securely register, manage multiple pet profiles, track vaccination schedules, and log veterinary visits all in one place.

## Architecture

This repository is a monorepo consisting of two main components:

* **Frontend:** A responsive Single Page Application (SPA) built with React, TypeScript, and Vite.
* **Backend:** A secure REST API built with Java 21, Spring Boot, and PostgreSQL.

## Repository Structure

```text
PetEBooklet/
├── backend/                 # Spring Boot Java application
│   ├── .mvn/                # Maven wrapper configurations
│   ├── src/                 # Java source code and resources (main/test)
│   ├── pom.xml              # Maven project dependencies
│   ├── mvnw / mvnw.cmd      # Maven wrapper executables
│   └── README.md            # Backend-specific documentation and setup
│
├── frontend/                # React TypeScript application
│   ├── public/              # Static assets
│   ├── src/                 # React components, styles, and config
│   ├── package.json         # Node.js dependencies and scripts
│   ├── vite.config.ts       # Vite bundler configuration
│   └── README.md            # Frontend-specific documentation and setup
│
├── .gitignore               # Root git ignore file
└── README.md                # This file (Root documentation)
```
## Prerequisites

To run this project locally, you will need the following installed on your machine:
*   **Java 21** (JDK)
*   **Node.js** (v18 or later recommended)
*   **PostgreSQL** (running on default port 5432)

## Getting Started

### 1. Database Setup
Create a local PostgreSQL database named `pet_ebooklet_db`.

### 2. Start the Backend
Navigate to the `Backend` directory, configure your environment variables, and run the Spring Boot server. Detailed instructions are in the [backend README](./backend/README.md).

```bash
cd backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit application.properties with your DB credentials and a JWT secret
./mvnw spring-boot:run
```
The backend will run on `http://localhost:8080`.

### 3. Start the Frontend
In a new terminal window, navigate to the `Frontend` directory, install dependencies, and start the Vite development server. Detailed instructions are in the [frontend README](./frontend/README.md).

```bash
cd frontend
cp .env.example .env
# Edit .env if your backend is running on a different URL/IP
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Authors

**ptrypos**

* [Website / Portfolio](https://ptrypos.me)
* [GitHub](https://github.com/ptrypos)
* [LinkedIn](https://www.linkedin.com/in/panagiotis-trypos-983abb242/)
