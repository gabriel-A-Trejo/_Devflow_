import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const moduleNameMapper = {
  "^@/(.*)$": "<rootDir>/src/$1",
};

const config: Config = {
  verbose: true,
  projects: [
    {
      displayName: "client",
      testEnvironment: "jsdom",
      clearMocks: true,
      testMatch: [
        "**/tests/unit/**/*.+(test|spec).[jt]s?(x)",
        "**/tests/integration/**/*.client.+(test|spec).[jt]s?(x)",
        "**/*.client.+(test|spec).[jt]s?(x)",
      ],
      transform: {
        "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
      },
      moduleNameMapper,
      setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
      testPathIgnorePatterns: [".*\\.server\\.(test|spec)\\.[jt]s?(x)$"],
    },
    {
      displayName: "server",
      testEnvironment: "node",
      clearMocks: true,
      maxWorkers: 1,

      transform: {
        "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
      },
      transformIgnorePatterns: [
        "/node_modules/(?!(next-auth|@auth/core|oauth4webapi)/)",
      ],
      moduleNameMapper,

      setupFilesAfterEnv: ["<rootDir>/jest.server.setup.ts"],
      testMatch: [
        "**/tests/integration/**/*.server.+(test|spec).[jt]s?(x)",
        "**/*.server.+(test|spec).[jt]s?(x)",
      ],
      testPathIgnorePatterns: [".*\\.client\\.(test|spec)\\.[jt]s?(x)$"],
    },
  ],
  coverageProvider: "v8",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["html", ["text", { skipFull: true }], "text-summary"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/node_modules/**",
    "!src/**/*.test.{js,jsx,ts,tsx}",
    "!src/**/*.client.{test,spec}.{js,jsx,ts,tsx}",
    "!src/**/*.server.{test,spec}.{js,jsx,ts,tsx}",
  ],
};

export default createJestConfig(config);
