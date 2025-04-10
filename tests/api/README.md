# API Test Suites

This directory contains the API test suites for the vKho application. The tests are organized by role to ensure proper authorization testing.

## Directory Structure

```
tests/api/
├── helpers/              # Helper classes and utilities
│   └── auth.helper.ts    # Authentication helper for different roles
├── manager/              # Tests for Manager role
│   ├── vans.spec.ts
│   ├── blocks.spec.ts
│   ├── zones.spec.ts
│   └── ...
├── supervisor/           # Tests for Supervisor role
│   ├── vans.spec.ts
│   ├── blocks.spec.ts
│   ├── zones.spec.ts
│   └── ...
└── README.md             # This file
```

## Role-Based Testing

The test suites are organized by role to ensure proper authorization testing:

1. **Manager Role**: Tests that require manager-level permissions
2. **Supervisor Role**: Tests that require supervisor-level permissions

## Running Tests

You can run tests for specific roles using the following commands:

```bash
# Run all tests
npx playwright test

# Run only manager role tests
npx playwright test --project=manager

# Run only supervisor role tests
npx playwright test --project=supervisor

# Run a specific test file
npx playwright test tests/api/manager/vans.spec.ts
```

## Authentication

The `AuthHelper` class provides methods for authenticating with different roles:

- `loginManagerCredential`: Authenticates as a manager
- `loginSupervisorCredential`: Authenticates as a supervisor

## Best Practices

1. Always use the appropriate role for each test suite
2. Ensure tests run sequentially to maintain proper test flow
3. Validate response data in each test
4. Add error handling for failed requests
5. Use descriptive test names that indicate the expected behavior 