# Pet eBooklet - Backend API

A RESTful API backend for managing pet health records, built with **Java 21**, **Spring Boot**, and **PostgreSQL**. It acts as the secure data foundation for the Pet eBooklet dashboard, handling user authentication, data persistence, business logic, and ownership validation.

## Features
- **Stateless Authentication:** Secure login and registration using JSON Web Tokens (JWT) and BCrypt password hashing.
- **Ownership Validation:** Service-layer security ensures users can only retrieve, modify, or delete pets and health records that belong to them.
- **Data Persistence:** Relational data mapping using Spring Data JPA and Hibernate, connected to a PostgreSQL database.
- **Global Exception Handling:** Centralized error handling (`@ControllerAdvice`) that returns clean, structured HTTP responses for bad credentials, missing users, and validation errors.
- **CORS Configured:** Pre-configured Cross-Origin Resource Sharing to allow seamless communication with the frontend dashboard across local networks.

## How it works

### Authentication & Security
On successful login via `/api/users/login`, the backend generates and returns a JWT. For all protected routes, the `JwtAuthenticationFilter` intercepts incoming HTTP requests, extracts the `Bearer` token from the `Authorization` header, validates its signature, and extracts the user ID to establish the security context. 

### Database & Entities
The application uses JPA to map Java objects to PostgreSQL tables. The core entities are `User`, `Pet`, `Vaccination`, and `VetVisit`. Relationships are strictly defined (e.g., a `User` has many `Pets`, a `Pet` has many `Vaccinations`), ensuring referential integrity. 

### Request Handling
Data entering the application is mapped to Data Transfer Objects (DTOs) and validated using `jakarta.validation` constraints (e.g., ensuring passwords are at least 6 characters, emails are valid, and names only contain letters). Controllers route these DTOs to Services, which perform business logic before saving to the database via Repository interfaces.

## Project structure

```text
src/main/java/ptrypos/petelectronicbooklet/
├── config/                 # Security and CORS configurations
├── controller/             # REST API endpoints (PetController, UserController)
├── dao/                    # Spring Data JPA repository interfaces
├── dto/                    # Data Transfer Objects for API requests and responses
├── exception/              # Custom exceptions and GlobalExceptionHandler
├── model/                  # JPA Entity classes and Enums (User, Pet, etc.)
├── security/               # JWT generation, extraction, and request filtering
└── service/                # Business logic implementation and ownership checks

```

## Frontend Integration

This backend exposes REST endpoints under `/api/...` for the React frontend to consume. Key routes include:

* **Auth:** `POST /api/users/login` | `POST /api/users/register`
* **User/Pets:** `GET /api/users/get_pets` | `POST /api/users/add_pet` | `DELETE /api/users/remove_pet/{petId}`
* **Pet Details:** `GET /api/pets/retrieve_pet_info/{petId}` | `PUT /api/pets/change_pet_birthdate/{petId}`
* **Health Records:** `GET /api/pets/get_vaccinations` | `POST /api/pets/add_vaccination/{petId}` | `GET /api/pets/get_vet_visits` | `POST /api/pets/add_vet_visit/{petId}`

## Requirements

* Java 21 (JDK)
* PostgreSQL (running on default port `5432`)
* Maven (wrapper included in the project)

## Build & Run

From the `Backend` directory:

```bash
# 1. Setup your PostgreSQL database
# Create a local database named 'pet_ebooklet_db'

# 2. Setup environment properties
# Copy the example properties file and add your database credentials and a secure JWT secret
cp src/main/resources/application.properties.example src/main/resources/application.properties

# 3. Run the Spring Boot application using the Maven wrapper
./mvnw spring-boot:run

```

The API will launch and listen for requests on `http://localhost:8080`.

## Troubleshooting

* **Database Connection Errors:** Ensure your PostgreSQL server is running, the database `pet_ebooklet_db` exists, and the username/password in `application.properties` are correct.
* **JWT Signature Exception:** If you receive 500 errors regarding token signing, ensure your `jwt.secret` in `application.properties` is at least 32 characters (256 bits) long.
* **CORS Errors on Frontend:** If the frontend is blocked from accessing the API, verify that the `CorsConfigurationSource` in `SecurityConfig.java` allows the origin IP or port your frontend is running on (defaults to allowing all `*` for easy testing).

## Authors

**ptrypos**

* [Website / Portfolio](https://ptrypos.me)
* [GitHub](https://github.com/ptrypos)
* [LinkedIn](https://www.linkedin.com/in/panagiotis-trypos-983abb242/)

```