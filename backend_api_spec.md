# Homelab Dashboard API Specification
==================================================

This document outlines the required RESTful API endpoints that the frontend dashboard (served by `dashboard.html`) expects to communicate with. This specification acts as the contract between the client-side UI and the backend service.

## 1. Authentication Endpoints

**Goal:** Secure access control for the entire dashboard.

### A. Login
*   **Endpoint:** `POST /api/login`
*   **Request Body (JSON):**
    ```json
    {
        "username": "string",
        "password": "string"
    }
    ```
*   **Success Response (200 OK - JSON):** Returns a JWT or session token.
    ```json
    {
        "success": true,
        "token": "<JWT_TOKEN_HERE>",
        "user_info": {"username": "admin", "roles": ["admin"]}
    }
    ```
*   **Failure Response (401 Unauthorized - JSON):**
    ```json
    {
        "success": false,
        "message": "Invalid credentials provided."
    }
    ```

## 2. Widget Data Endpoints

These endpoints fetch the *data* to populate widgets, not the entire service UI (which is handled by iframes).

### A. System Status Widget
*   **Endpoint:** `GET /api/status/system`
*   **Description:** Fetches aggregated status from core services.
*   **Success Response (200 OK - JSON):**
    ```json
    {
        "uptime": "14 days",
        "cpu_load": "15%",
        "memory_usage": "6.2GB / 32GB",
        "network_status": {"gateway": "Online", "ip": "10.0.0.2"}
    }
    ```

### B. Service Status Widget (Example: Plex)
*   **Endpoint:** `GET /api/status/plex`
*   **Description:** Checks if the Plex service is running and reports basic metrics.
*   **Success Response (200 OK - JSON):**
    ```json
    {
        "service": "Plex Media Server",
        "status": "Operational",
        "last_check": "2024-01-01T10:00:00Z",
        "details": {"library_count": 5, "active_users": 2}
    }
    ```

## 3. Deployment Integration Notes

### A. Bare Metal Installation (Direct Service)
*   The backend service (e.g., a Python Flask app) must be installed directly on the host OS.
*   It should listen on a specific port (e.g., `http://localhost:5000`).
*   The `install.sh` script will need to install required language runtimes (Python/Node.js).

### B. Docker Container Installation
*   A `Dockerfile` must be created for the backend service.
*   The container should expose a port (e.g., `EXPOSE 5000`).
*   The `install.sh` script will run `docker-compose up -d` to manage the service lifecycle.

## Next Steps:
1.  **Backend Implementation:** Build the actual backend service that implements these endpoints.
2.  **Frontend Integration:** Update `js/main.js` to use `fetch()` calls instead of relying solely on static links for widget data.