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
6. [Development](#development)
   - [Editing the CLI Tool](#editing-the-cli-tool)
   - [Publishing the CLI Tool](#publishing-the-cli-tool)
   - [Installing Globally](#installing-globally)
7. [Best Practices](#best-practices)
   - [Coding Standards](#coding-standards)
   - [Error Handling](#error-handling)
   - [Logging](#logging)
8. [Adding New Features](#adding-new-features)
9. [Testing](#testing)
10. [Contribution Guidelines](#contribution-guidelines)
11. [License](#license)
12. [Acknowledgments](#acknowledgments)

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
   git clone <repository-url> consist-cli-typescript
   ```

2. **Navigate to the project directory**

   ```bash
   cd consist-cli-typescript
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
consist-cli-typescript/
├── bin/                      # Executable scripts
│   └── index.js              # Entry point for the CLI tool
├── templates/                # Templates for project generation
│   ├── project/              # Base project template
│   └── services/             # Templates for optional services
│       ├── glassix/
│       ├── google-sheets/
│       └── redis/
├── src/
│   ├── commands/             # CLI command implementations
│   ├── utils/                # Utility functions
│   └── index.ts              # CLI entry point
├── package.json              # Project metadata and scripts
├── tsconfig.json             # TypeScript configuration
├── README.md                 # This file
└── ...                       # Other configuration files
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

## Development

### Editing the CLI Tool

If you wish to modify or extend the CLI tool itself, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone <repository-url> consist-cli-typescript
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd consist-cli-typescript
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Make Changes**

   - The CLI source code is located in the `src/` directory.
   - Implement new commands in `src/commands/`.
   - Update templates in the `templates/` directory.
   - Ensure you follow the existing code structure and conventions.

5. **Build the CLI Tool**

   Compile the TypeScript code:

   ```bash
   npm run build
   ```

6. **Test Locally**

   - You can test your changes without publishing by linking the package globally using `npm link`.

   ```bash
   npm link
   ```

   - Now, you can use the CLI commands globally.

   ```bash
   consist-cli new my-new-project
   ```

   - To unlink:

   ```bash
   npm unlink
   ```

### Publishing the CLI Tool

If you want to publish the CLI tool so others can install it via npm:

1. **Update `package.json`**

   - Ensure the `name`, `version`, and other metadata are correctly set.
   - The `bin` field should point to your CLI entry point.

   ```json
   {
     "name": "consist-cli",
     "version": "1.0.0",
     "bin": {
       "consist-cli": "./bin/index.js"
     }
     // ... other fields ...
   }
   ```

2. **Login to npm**

   ```bash
   npm login
   ```

3. **Publish the Package**

   ```bash
   npm publish
   ```

   - **Note**: Make sure the package name is unique on the npm registry.

4. **Versioning**

   - Increment the version number in `package.json` for each new release.
   - Follow semantic versioning (e.g., `1.0.1`, `1.1.0`, `2.0.0`).

### Installing Globally

Once the package is published to npm, it can be installed globally:

```bash
npm install -g consist-cli
```

Now, you can use the CLI tool from anywhere:

```bash
consist-cli new my-new-project
```

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

To add a new feature to the CLI tool or the generated projects, follow these steps:

### Adding a New Service Template

1. **Create the Service Template**

   - Add a new directory under `templates/services/` for your service.
   - Include any files and directories that should be copied into generated projects.

2. **Update `servicesInfo`**

   - In `src/commands/createProject.ts` (or wherever the service configurations are), add an entry for your service.

   ```typescript
   const servicesInfo = {
     // ... existing services ...
     'New Service': {
       dependencies: {
         'new-service-package': '^1.0.0',
       },
       envConfig: `
       newService: {
         apiKey: getEnvVar('NEW_SERVICE_API_KEY'),
       }`,
       files: [
         {
           source: 'new-service/config/newServiceConfig.ts',
           destination: 'src/config/newServiceConfig.ts',
         },
       ],
     },
   };
   ```

3. **Modify the CLI Logic**

   - Ensure the CLI prompts include your new service.
   - Update any logic that handles copying files and modifying configuration.

4. **Test Your Changes**

   - Use `npm link` to test the CLI tool locally.
   - Generate a new project and verify that your service is included correctly.

---

## Testing

Implement unit and integration tests to ensure code quality and reliability.

- **Testing Frameworks**: Use testing frameworks like Jest or Mocha.
- **Mocking**: Mock external dependencies (e.g., API calls, file system operations) using libraries like `sinon` or `jest-mock`.
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
