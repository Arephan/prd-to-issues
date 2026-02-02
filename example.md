# Example Product PRD

## User Authentication Feature
Users should be able to sign up and log in securely.

### OAuth Integration
Support for Google and GitHub OAuth providers.
- Handle OAuth callbacks
- Store tokens securely

### Password Reset
Email-based password reset functionality.
- Send reset email with token
- Token expires after 24 hours

## Dashboard UI
Main dashboard showing user analytics and quick actions.

### Analytics Widgets
Display key metrics in card format.

### Quick Actions Panel
One-click access to common tasks.

## API Endpoints
RESTful API for mobile and third-party integrations.

### Authentication API
Login, logout, and token refresh endpoints.

### User Profile API  
CRUD operations for user profiles.

## Security Enhancements
Improve overall application security.

### Rate Limiting
Prevent brute force attacks on auth endpoints.

### Audit Logging
Log all sensitive operations for compliance.
