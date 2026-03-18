export const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
};

export const mockUseToast = jest.fn(() => ({
  toast: mockToast,
  toasts: [],
  dismiss: jest.fn(),
}));
