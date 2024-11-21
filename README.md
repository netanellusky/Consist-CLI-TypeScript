# Consist CLI TypeScript Project

A customizable Node.js project template using TypeScript, Express, and optional integrations with services like Glassix, Google Sheets, Redis, and Azure Key Vault. This project is designed to help developers quickly bootstrap a new application with selected services and best practices in mind.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)
   - [Installation](#installation)
   - [Configuration](#configuration)
3. [Project Structure](#project-structure)
4. [Features](#features)
   - [Glassix Integration](#glassix-integration)
   - [Google Sheets Integration](#google-sheets-integration)
   - [Redis Integration](#redis-integration)
   - [Azure Key Vault Integration](#azure-key-vault-integration)
5. [Usage](#usage)
   - [Running the Application](#running-the-application)
   - [Available Scripts](#available-scripts)
6. [Best Practices](#best-practices)
   - [Coding Standards](#coding-standards)
   - [Error Handling](#error-handling)
   - [Logging](#logging)
7. [Adding New Features](#adding-new-features)
8. [Testing](#testing)
9. [Contribution Guidelines](#contribution-guidelines)
10. [License](#license)
11. [Acknowledgments](#acknowledgments)

---

## Prerequisites

- **Node.js** (version >= 16.x)
- **npm** (version >= 8.x) or **yarn**
- **TypeScript**
- **Git**
- **Access to External Services** (depending on selected features):
  - Glassix API
  - Google Sheets API
  - Azure Key Vault
  - Redis instance

---

## Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url> consist-starter-app
   ```

2. **Navigate to the project directory**

   ```bash
   cd consist-starter-app
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

   _or if you're using yarn:_

   ```bash
   yarn install
   ```

### Configuration

1. **Create an `.env` file**

   Copy the `.env.example` file to `.env` and fill in the required environment variables.

   ```bash
   cp .env.example .env
   ```

2. **Set Environment Variables**

   The application uses environment variables for configuration. The required variables depend on the features you have selected during project creation.

   - **Common Variables**

     ```dotenv
     PORT=3000
     NODE_ENV=development
     ```

   - **Glassix**

     ```dotenv
     GLASSIX_API_KEY=your_glassix_api_key
     ```

   - **Google Sheets**

     ```dotenv
     GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
     GOOGLE_PRIVATE_KEY=your_private_key
     GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
     REFRESH_INTERVAL_MS=21600000 # Optional, default is 6 hours
     ```

   - **Redis**

     ```dotenv
     REDIS_HOST=your_redis_host
     REDIS_PORT=your_redis_port
     REDIS_PASSWORD=your_redis_password
     ```

   - **Azure Key Vault**

     ```dotenv
     AZURE_TENANT_ID=your_azure_tenant_id
     AZURE_CLIENT_ID=your_azure_client_id
     AZURE_CLIENT_SECRET=your_azure_client_secret
     KEY_VAULT_NAME=your_key_vault_name
     ```

---

## Project Structure

The project follows a clean architecture and domain-driven design principles. Here's an overview of the project's structure:

```
consist-starter-app/
├── package.json            # Project metadata and scripts
├── tsconfig.json           # TypeScript configuration
├── server.ts               # Entry point of the application
├── .env.example            # Example environment variables file
└── src/
    ├── config/             # Configuration files
    │   ├── envConfig.ts    # Environment configuration
    │   └── redisConfig.ts  # Redis configuration (if Redis selected)
    ├── core/               # Core functionalities like logging
    │   └── logger/
    │       ├── index.ts
    │       ├── dev-logger.ts
    │       └── prod-logger.ts
    ├── features/           # Application features grouped by domain
    │   ├── glassix/        # Glassix integration (if Glassix selected)
    │   │   ├── controllers/
    │   │   ├── interfaces/
    │   │   └── services/
    │   ├── google-sheets/  # Google Sheets integration (if selected)
    │   │   ├── interfaces/
    │   │   └── services/
    │   └── ...             # Other features
    ├── middleware/         # Express middleware
    │   └── errorMiddleware.ts
    ├── routes/             # Express route definitions
    ├── shared/             # Shared resources (interfaces, services, errors)
    │   ├── errors/
    │   │   └── ErrorResponse.ts
    │   ├── interfaces/
    │   └── services/
    │       ├── AzureKeyVaultService.ts
    │       └── cacheService.ts  # Redis cache utilities (if Redis selected)
    └── tests/              # Test suites (if applicable)
```

---

## Features

### Glassix Integration

The Glassix integration allows your application to interact with the Glassix API for functionalities such as creating tickets, adding notes, and more.

#### Setup

Ensure you have the following environment variable set:

```dotenv
GLASSIX_API_KEY=your_glassix_api_key
```

#### Usage

- **Controllers** are located in `src/features/glassix/controllers/`.
- **Services** are located in `src/features/glassix/services/`.
- **Interfaces** are in `src/features/glassix/interfaces/`.

#### Key Components

- **`glassixController.ts`**: Handles incoming requests and responses related to Glassix operations.
- **`apiService.ts`**: Contains methods to interact with the Glassix API.
- **Authentication**: Ensure you handle authentication tokens securely.

---

### Google Sheets Integration

This feature integrates with the Google Sheets API, allowing your application to read from and write to Google Sheets.

#### Setup

Set the following environment variables:

```dotenv
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
REFRESH_INTERVAL_MS=21600000 # Optional
```

#### Usage

- **Services** are located in `src/features/google-sheets/services/`.
- **Interfaces** are in `src/features/google-sheets/interfaces/`.

#### Key Components

- **`googleSpreadsheetService.ts`**: Handles interactions with Google Sheets.
- **Caching**: Consider caching spreadsheet data if frequent reads are performed.

---

### Redis Integration

Redis is used for caching purposes to improve performance.

#### Setup

Set the following environment variables:

```dotenv
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
```

#### Usage

- **Configuration**: Redis configuration is in `src/config/redisConfig.ts`.
- **Cache Service**: Cache utility functions are in `src/shared/services/cacheService.ts`.

#### Key Components

- **`redisConfig.ts`**: Establishes the Redis client connection.
- **`cacheService.ts`**: Provides `setCache`, `getCache`, and `deleteCache` methods for caching data.

---

### Azure Key Vault Integration

Azure Key Vault is used for securely storing and accessing secrets.

#### Setup

Set the following environment variables:

```dotenv
AZURE_TENANT_ID=your_azure_tenant_id
AZURE_CLIENT_ID=your_azure_client_id
AZURE_CLIENT_SECRET=your_azure_client_secret
KEY_VAULT_NAME=your_key_vault_name
```

#### Usage

- **Service**: The Azure Key Vault service is in `src/shared/services/AzureKeyVaultService.ts`.
- **Interfaces**: Defined in `src/shared/interfaces/IAzureKeyVaultService.ts`.

#### Key Components

- **`AzureKeyVaultService.ts`**: Handles retrieval and storage of secrets in Azure Key Vault.
- **Caching**: Implements caching to minimize calls to Azure Key Vault.

---

## Usage

### Running the Application

To start the application in development mode:

```bash
npm run dev
```

To build and run the application in production mode:

```bash
npm run build
npm start
```

### Available Scripts

- **`npm run dev`**: Runs the application using `ts-node` for development with hot-reloading.
- **`npm run build`**: Compiles TypeScript to JavaScript.
- **`npm start`**: Starts the compiled JavaScript application.
- **`npm run lint`**: Runs ESLint to check for linting errors.
- **`npm run format`**: Formats the code using Prettier.

---

## Best Practices

### Coding Standards

- **TypeScript**: Utilize TypeScript's strong typing and interfaces for type safety.
- **Project Structure**: Adhere to the established project structure for consistency.
- **Naming Conventions**: Use clear and descriptive names for files, classes, methods, and variables.
- **Modularity**: Keep code modular with separation of concerns.

### Error Handling

- **Custom Error Classes**: Use custom error classes located in `src/shared/errors/` for consistent error handling.
- **Try-Catch Blocks**: Wrap asynchronous operations in try-catch blocks to handle exceptions.
- **Middleware**: Use Express middleware for centralized error handling (`errorMiddleware.ts`).

### Logging

- **Logger**: Utilize the logging utilities provided in `src/core/logger/`.
- **Log Levels**: Use appropriate log levels (`info`, `debug`, `error`, etc.) for different types of messages.
- **Sensitive Information**: Avoid logging sensitive information like passwords or API keys.

---

## Adding New Features

To add a new feature to the project, follow these steps:

1. **Create a New Feature Directory**

   ```bash
   mkdir -p src/features/your-feature/{controllers,services,interfaces}
   ```

2. **Implement Controllers, Services, and Interfaces**

   - **Controllers**: Handle incoming HTTP requests and responses.
   - **Services**: Contain business logic and interact with external services or databases.
   - **Interfaces**: Define TypeScript interfaces for data models and service contracts.

3. **Define Routes**

   - Add route definitions in `src/routes/` or within your feature directory.
   - Register your routes in the main router (`src/routes/index.ts`).

4. **Update `server.ts`**

   - Import and use your new feature's router.

     ```typescript
     import yourFeatureRouter from './features/your-feature/routes/yourFeatureRoutes';

     app.use('/api/your-feature', yourFeatureRouter);
     ```

5. **Implement Business Logic**

   - Follow best practices for separation of concerns.
   - Use dependency injection where appropriate.

6. **Update Documentation**

   - Add necessary documentation for your feature in the project's README or a separate file.

---

## Testing

Implement unit and integration tests to ensure code quality and reliability.

- **Testing Frameworks**: Use testing frameworks like Jest or Mocha.
- **Mocking**: Mock external dependencies (e.g., API calls, database connections) using libraries like `sinon` or `jest-mock`.
- **Test Structure**: Place test files alongside the files they test or in a separate `tests/` directory.
- **Running Tests**: Add scripts to `package.json` for running tests.

  ```json
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
  ```

---

## Contribution Guidelines

We welcome contributions! Please follow these guidelines:

1. **Fork the Repository**

   - Create a personal fork of the repository on GitHub.

2. **Create a Branch**

   - Create a new branch for your feature or bug fix.

     ```bash
     git checkout -b feature/your-feature-name
     ```

3. **Make Changes**

   - Ensure your code follows the project's coding standards.
   - Write clear and descriptive commit messages.

4. **Add Tests**

   - Include tests for new functionalities.

5. **Submit a Pull Request**

   - Push your changes to your fork and submit a pull request to the `main` branch.
   - Provide a detailed description of your changes.

---

## License

This project is licensed under the **MIT License**.

---

## Acknowledgments

- **Express.js**: For providing a robust web framework.
- **TypeScript**: For enabling strong typing and modern JavaScript features.
- **Open Source Community**: For the libraries and tools that make development easier.
