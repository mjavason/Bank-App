# Banking App

A simple application for managing finances, making transactions, and accessing your accounts with ease.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [User Registration](#user-registration)
- [Password Reset (Backend Perspective)](#password-reset-backend-perspective)
- [Documentation](#documentation)
- [Design Choices](#design-choices)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

## Introduction

The Banking App is a side project that offers basic financial management features, including account management, fund transfers, and transaction history. It aims to provide a simple and straightforward banking experience while considering data security. Currently hosted live at [Bank App](https://bank-app-ef40.onrender.com)

## Installation

To run the app locally, follow these steps:

1. Clone the repository.
2. Install the required dependencies using `npm install`.
3. Create a `.env` file in the project's root folder with environment-specific variables.

   - Example `.env` file:
     ```env
     APP_NAME=BankingApp
     JWT_SECRET=your_secret_key
     MONGO_DB_URL=your_mongodb_uri
     ```

4. Ensure Node.js is installed on your computer.
5. Build the application with `npm run build`.
6. Start the local server using one of the following commands:

   - For local development with automatic code reloading (using nodemon):

     ```bash
     npm run dev
     ```

   - For running the production-ready build:
     ```bash
     npm start
     ```

7. Check the terminal output to confirm the server is running and the database is connected correctly.

## User Registration

### User Registration Example

**Request**

To register a new user, make a POST request to the `/api/v1/auth/register` endpoint with the following JSON payload:

```json
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstname": "John",
  "lastname": "Doe",
  "email": "johndoe@example.com",
  "password": "secure_password"
}
```

**Response**

A successful registration yields a JSON response like this:

```json
{
  "success": true,
  "status_code": "10000",
  "message": "Registration successful",
 "data": {
    "_id": "5f8a12a3e055b1246890d4ad",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "deleted": false,
    "createdAt": "2023-09-25T11:00:00.000Z",
    "updatedAt": "2023-09-25T11:00:00.000Z"
  }
}
```

## Password Reset (Backend Perspective)

The password reset process from a backend perspective involves several steps:

1. **User Requests Password Reset**: Users request a password reset by providing their registered email address.

2. **Token Generation**: The backend generates a unique, time-limited token associated with the user's account for identity verification.

3. **Sending Reset Link**: An email with a token-containing link is sent to the user's registered email address, leading to a password reset page.

4. **User Clicks Reset Link**: Clicking the link directs the user to the password reset page, passing the token as a query parameter or in the URL.

5. **Token Verification**: The backend verifies the token's validity and checks if it has expired.

6. **Setting New Password**: If the token is valid, the user sets a new password for their account.

7. **Password Update**: The backend updates the user's password in the database.

8. **Password Reset Confirmation**: Users receive a confirmation message that their password has been reset.

9. **Token Expiry Handling**: Expired tokens or previously used reset links are invalidated, prompting users to request new ones if necessary.

10. **Logging In**: After resetting the password, users can log in with their new credentials.

The backend ensures security by validating user identity through token and email verification, secure password storage, and monitoring for suspicious activity.

## Documentation

For detailed information about using the app's API and endpoints, consult the [Banking App Documentation](https://documenter.getpostman.com/view/29278179/2s9YJXYPzS).

## Design Choices

The app employs Email-based Password Reset:

A link or token is sent to the user's registered email address.
User clicks on the link/token and is directed to a page where they can set a new password.
Advantages: Widely used and familiar to users. Doesn't require additional authentication mechanisms.
Disadvantages: Vulnerable to email account compromise.

## Contributing

To contribute to the app's development:

1. Fork the project on GitHub.
2. Create a new branch for your changes.
3. Make improvements or additions.
4. Thoroughly test your changes.
5. Create a pull request with a clear description of your changes.
6. Your contribution will be reviewed, and feedback will be provided.

Contributions enhancing security, performance, and user experience are welcome.

## Acknowledgments

The project has benefited from the collaboration and support of colleagues, mentors, and friends. Their contributions in coding, design, testing, data management, and advice have been invaluable. Thank you to all who have been a part of this project.
