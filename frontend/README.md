# Pet eBooklet - Frontend Dashboard

A web-based dashboard for managing pet health records, built with **React**, **TypeScript**, and **Vite**. It acts as a digital health passport, allowing users to securely authenticate, manage multiple pet profiles, track vaccinations, and log veterinary visits.

## Features
- **User Authentication:** JWT-based login and registration, complete with password strength calculation and validation.
- **Pet Management:** Add new pets (name, species, gender, birthdate), view detailed profiles, and update or remove records.
- **Health Tracking:** Log specific vet visits (reasons, notes) and keep track of vaccinations (date given, valid until).
- **Global Filtering:** Filter global vaccination and vet visit tables by specific pets to easily find history.
- **Responsive Design:** Fully mobile-friendly user interface leveraging plain CSS without heavy UI libraries.
- **Dynamic Network Config:** Supports easy multi-device local network testing by falling back to `window.location.hostname` if no `.env` variable is provided.

## How it works

### Authentication
On successful login via `/api/users/login`, the backend issues a JWT. The frontend stores this token in `localStorage` and automatically attaches it as a `Bearer` token in the `Authorization` header for all subsequent protected API requests (e.g., fetching pets, adding a vaccination). 

### API Configuration
Instead of hardcoding `localhost`, the app centralizes its base URL in `src/config.ts`. It prioritizes the `VITE_API_BASE_URL` from the `.env` file (useful for production or specific developer setups). If missing, it dynamically uses the browser's current hostname, allowing you to access the Vite dev server from your mobile phone on the same Wi-Fi network and still successfully connect to the backend.

### Routing & State
Navigation is handled by `react-router-dom`, ensuring users are cleanly redirected to `/login` if their token expires (catching 401/403 HTTP statuses). State is strictly typed with TypeScript interfaces (`Pet`, `Vaccination`, `VetVisit`) and managed using React hooks (`useState`, `useEffect`).

## Project structure

```

src/
├── App.tsx / App.css           # Main application routing and global styling
├── config.ts                   # Centralized API base URL configuration
├── dashboard/
│   ├── MainDashboard.tsx       # Home view listing all registered pets
│   ├── PetInfo.tsx             # Detailed view of a single pet's records
│   ├── Vaccinations.tsx        # Global vaccinations table with pet filtering
│   ├── VetVisits.tsx           # Global vet visits table with pet filtering
│   └── Add*.tsx                # Forms for adding pets, visits, and vaccines
└── user_authentication/
├── Login.tsx               # Login form and API integration
└── Register.tsx            # Registration form with password strength meter

```

## Backend API
This frontend requires a custom **Spring Boot** backend exposing REST endpoints under `/api/...` to function. Expected routes include:
- `POST /api/users/login` and `POST /api/users/register`
- `GET /api/users/get_pets` and `POST /api/users/add_pet`
- `GET /api/pets/retrieve_pet_info/{id}`
- `POST /api/pets/add_vaccination/{id}` and `POST /api/pets/add_vet_visit/{id}`

## Requirements
- Node.js (v18 or later recommended).
- The companion Spring Boot backend running locally on port `8080`.

## Build & Run
From the repository root:

```bash
# Setup environment variables (modify .env for the correct backend api url)
cp .env.example .env

# Run the development server
npm run dev

```

The application will launch on `http://localhost:5173`.

## Troubleshooting

* **Blank screen / Network errors:** Make sure your Spring Boot backend is actively running on port 8080 and that your `.env` file contains the correct `VITE_API_BASE_URL`. If you just created the `.env` file, restart Vite.
* **Unauthorized / Redirected to Login:** Your JWT may have expired or the backend returned a 401/403. Try logging in again to generate a fresh token.

## Authors

**[Your Name]**

* [Website / Portfolio](https://yourwebsite.com)
* [GitHub](https://github.com/yourusername)
* [LinkedIn](https://www.linkedin.com/in/yourprofile)

```