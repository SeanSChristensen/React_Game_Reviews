# Game Review Website

A simple game review website developed using React, Node.js, PostgreSQL, and Keycloak.

## Technologies

### Frontend

* **React** – Component-based user interface
* **Vite** – Frontend build tool and development server
* **React Router** – Client-side routing
* **Bootstrap** – UI styling and responsive layout
* **React Icons** – Icon library
* **JavaScript (JSX)** – Frontend development
* **ESLint** – Code linting and quality

### Backend

* **Node.js** – Server-side JavaScript runtime
* **Express** – REST API framework
* **PostgreSQL** – Relational database
* **node-postgres (`pg`)** – PostgreSQL database connectivity
* **CORS** – Cross-origin resource sharing
* **JOSE** – JWT handling and verification

### Authentication

* **Keycloak** – Identity and access management
* **OpenID Connect** – Authentication protocol
* **OAuth 2.0** – Authorization framework
* **JSON Web Tokens (JWT)** – Authentication and API authorization

## Architecture

```text
React + Vite
     │
     │ HTTP / REST API
     ▼
Node.js + Express
     │
     ├──────────────► PostgreSQL
     │
     └──────────────► Keycloak
```


## Project Structure

```text
├── keycloak/       # Keycloak configuration
├── public/         # Static assets
├── server/         # Node.js / Express backend
├── src/            # React frontend
├── package.json
├── vite.config.js
└── eslint.config.js
```

## Overview

This Project of mine developed my understanding of the below:

* React frontend development
* REST API development
* Relational database integration
* User authentication and authorization
* JWT-based API security
* Client-server communication
* Frontend routing
* Git-based development
* Access tokens, refresh tokens
