/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.env-setup.js"],
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js",
    "<rootDir>/__mocks__/next.js",
  ],

  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",

    "^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i":
      "<rootDir>/__mocks__/fileMock.js",

    '^@/(.*)$': '<rootDir>/src/$1',
  },

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          jsx: "react-jsx",
        },
      },
    ],
  },

  transformIgnorePatterns: ["/node_modules/(?!(.*\\.mjs$))"],

  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  moduleDirectories: ["node_modules", "src"],

  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],

  extensionsToTreatAsEsm: [".ts", ".tsx"],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  verbose: true,

  collectCoverage: false,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{ts,tsx}",
    "!src/**/index.{ts,tsx}",
    "!src/**/*.config.{ts,tsx}",
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 75,
      statements: 75,
    },

    "./src/app/(authed)/dashboard/": {
      branches: 60,
      functions: 70,
      lines: 65,
      statements: 65,
    },
    "./src/app/hooks/": {
      branches: 80,
      functions: 90,
      lines: 85,
      statements: 85,
    },
  },

  coverageReporters: ["text", "lcov", "html", "json-summary"],

  coverageDirectory: "coverage",
};
