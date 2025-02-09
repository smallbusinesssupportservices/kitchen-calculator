# QuickBooks Online OAuth Integration Documentation

This document provides a visual representation of the QuickBooks Online (QBO) OAuth authentication and integration process.

## OAuth Flow Overview

```mermaid
sequenceDiagram
    participant U as User
    participant A as Application
    participant I as Intuit OAuth
    participant Q as QuickBooks API
    
    U->>A: Click "Connect to QuickBooks"
    A->>I: Request Authorization URL
    I-->>A: Return Auth URL
    A->>U: Redirect to Intuit Login
    U->>I: Login & Authorize
    I->>A: Redirect with Auth Code
    A->>I: Exchange Code for Tokens
    I-->>A: Return Access & Refresh Tokens
    A->>A: Store Tokens
```

## Token Management Flow

```mermaid
graph TD
    A[Start API Request] --> B{Check Token}
    B -->|Valid| C[Make API Call]
    B -->|Expired| D[Refresh Token]
    D -->|Success| C
    D -->|Failed| E[Request New Authorization]
    C -->|Success| F[Return Response]
    C -->|Error| G{Check Error}
    G -->|Auth Error| D
    G -->|Other Error| H[Handle Error]
```

## Token Storage Structure

```mermaid
classDiagram
    class TokenData {
        +String realmId
        +String token_type
        +String access_token
        +String refresh_token
        +Number expires_in
        +Number x_refresh_token_expires_in
        +String id_token
        +Number latency
        +Number createdAt
    }
    
    class OAuthClient {
        +String environment
        +String clientId
        +String clientSecret
        +String redirectUri
        +TokenData token
        +Boolean logging
    }
    
    OAuthClient --> TokenData
```

## Authorization Process

```mermaid
graph TD
    A[User Initiates Auth] --> B[Generate Auth URL]
    B --> C[Open Auth Window]
    C --> D{User Authorizes?}
    D -->|Yes| E[Receive Auth Code]
    D -->|No| F[Handle Rejection]
    E --> G[Exchange for Tokens]
    G --> H[Save Tokens]
    H --> I[Close Auth Window]
```

## API Integration Flow

```mermaid
sequenceDiagram
    participant App as Application
    participant QC as QBO Client
    participant API as QuickBooks API
    
    App->>QC: Request API Call
    QC->>QC: Validate Token
    
    alt Token Valid
        QC->>API: Make API Request
        API-->>QC: Return Response
        QC-->>App: Return Data
    else Token Expired
        QC->>QC: Refresh Token
        QC->>API: Retry API Request
        API-->>QC: Return Response
        QC-->>App: Return Data
    end
```

## Error Handling Flow

```mermaid
graph TD
    A[API Request] --> B{Check Response}
    B -->|Success| C[Return Data]
    B -->|Error| D{Error Type}
    D -->|401| E[Token Expired]
    D -->|403| F[Permission Error]
    D -->|500| G[Server Error]
    E --> H[Refresh Token]
    F --> I[Request Reauthorization]
    G --> J[Retry Request]
```

## Key Components

### 1. OAuth Client Configuration
```javascript
{
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  environment: "sandbox|production",
  redirectUri: "YOUR_REDIRECT_URI",
  logging: true
}
```

### 2. Token Structure
```javascript
{
  realmId: "COMPANY_ID",
  token_type: "bearer",
  access_token: "ACCESS_TOKEN",
  refresh_token: "REFRESH_TOKEN",
  expires_in: 3600,
  x_refresh_token_expires_in: 8726400,
  createdAt: TIMESTAMP
}
```

## Important Notes

1. **Token Security**
   - Tokens are stored securely in token.json
   - Access tokens expire after 1 hour
   - Refresh tokens expire after 100 days
   - Never expose tokens in client-side code

2. **Environment Considerations**
   - Sandbox environment for development/testing
   - Production environment for live data
   - Different credentials for each environment

3. **Authorization Scopes**
   - com.intuit.quickbooks.accounting
   - com.intuit.quickbooks.payment
   - OpenId scopes for user information

4. **Best Practices**
   - Always check token validity before API calls
   - Implement proper error handling
   - Store company ID (realmId) with tokens
   - Maintain token refresh mechanism
   - Log authentication events

## Integration Points

1. **Initial Authorization**
   - User clicks "Connect to QuickBooks"
   - Redirect to Intuit login
   - Handle authorization callback
   - Store initial tokens

2. **Token Management**
   - Automatic token refresh
   - Token validation
   - Token storage
   - Error handling

3. **API Integration**
   - Company information
   - Customer management
   - Estimate creation
   - PDF generation