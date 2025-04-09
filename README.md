# Playwright Automation Testing Framework

This project contains automated tests for the VKho API using Playwright.

## Prerequisites

- Node.js (v14 or higher)
- Yarn package manager
- Git

## Project Structure

```
├── tests/                  # Test files
│   ├── api/               # API tests
│   └── e2e/               # End-to-end tests
├── config/                # Configuration files
├── fixtures/              # Test data and fixtures
├── utils/                 # Utility functions and helpers
├── playwright.config.ts   # Playwright configuration
└── package.json          # Project dependencies and scripts
```

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
yarn install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

Run all tests:
```bash
yarn test
```

Run tests in UI mode:
```bash
yarn test --ui
```

Run tests in a specific browser:
```bash
yarn test --project=chromium
```

Run tests in headed mode:
```bash
yarn test --headed
```

## Test Reports

After test execution, HTML reports are generated in the `playwright-report` directory. To view the report:

```bash
npx playwright show-report
```

## Configuration

The project uses the following configuration files:

- `playwright.config.ts`: Main Playwright configuration
- `config/env.config.ts`: Environment-specific configuration

## Best Practices

1. Use Page Object Model (POM) pattern for better maintainability
2. Keep test data in separate fixture files
3. Use meaningful test and variable names
4. Add appropriate assertions and error handling
5. Follow the AAA (Arrange-Act-Assert) pattern

## Contributing

1. Create a new branch for your feature
2. Write tests following the existing patterns
3. Ensure all tests pass
4. Submit a pull request

## Troubleshooting

Common issues and solutions:

1. **Browser not found**: Run `npx playwright install` to install browsers
2. **Tests failing**: Check the test report for detailed error messages
3. **Configuration issues**: Verify the `playwright.config.ts` file

## Support

For any questions or issues, please create an issue in the repository. 