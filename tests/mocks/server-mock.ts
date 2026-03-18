jest.mock("@/auth", () => ({
  auth: jest.fn(() => Promise.resolve({ user: null })),
}));
jest.mock("@/shared/lib/mongoose", () => ({
  default: jest.fn(() => Promise.resolve()),
}));
