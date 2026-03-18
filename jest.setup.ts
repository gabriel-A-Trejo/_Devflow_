import "@testing-library/jest-dom";

import {
  mockToast,
  mockUseRouter,
  mockUseToast,
  mockUseSession,
} from "./tests/mocks";

jest.mock("next/navigation", () => ({
  useRouter: mockUseRouter,
}));
jest.mock("sonner", () => ({
  useToast: mockUseToast,
  toast: mockToast,
}));

jest.mock("next-auth/react", () => ({ useSession: mockUseSession }));
