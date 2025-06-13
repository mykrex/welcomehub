/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.env-setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/__mocks__/next.js'],
  
  moduleNameMapper: {
    // Handle CSS imports (both with and without CSS modules)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    
    // Handle image imports
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i': '<rootDir>/__mocks__/fileMock.js',
    
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  
  transformIgnorePatterns: [
    '/node_modules/(?!(.*\\.mjs$))',
  ],
  
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  moduleDirectories: ['node_modules', 'src'],
  
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  verbose: true,
  
  // Code coverage configuration
  collectCoverage: false, // Default false, enable with --coverage flag
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',                    // Exclude TypeScript declaration files
    '!src/**/*.stories.{ts,tsx}',        // Exclude Storybook files
    '!src/**/index.{ts,tsx}',            // Exclude index files
    '!src/**/*.config.{ts,tsx}',         // Exclude configuration files
  ],
  
  // Coverage thresholds by percentage
  coverageThreshold: {
    global: {
      branches: 70,      // 70% of branches covered
      functions: 80,     // 80% of functions covered
      lines: 75,         // 75% of lines covered
      statements: 75,    // 75% of statements covered
    },
    // Specific thresholds by directory
    './src/app/(authed)/dashboard/': {
      branches: 60,
      functions: 70,
      lines: 65,
      statements: 65,
    },
    './src/app/hooks/': {
      branches: 80,
      functions: 90,
      lines: 85,
      statements: 85,
    },
  },
  
  // Coverage reporters
  coverageReporters: [
    'text',           // Display in console
    'lcov',           // For tools like SonarQube
    'html',           // Generate HTML report
    'json-summary',   // JSON summary
  ],
  
  // Directory where coverage reports are saved
  coverageDirectory: 'coverage',
};