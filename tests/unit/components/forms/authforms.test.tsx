import AuthForm from "@/features/auth/components/auth-form";
import { SignInSchema, SignUpSchema } from "@/features/auth/schema/auth-schema";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { mockRouter, mockToast, resetAllMocks } from "../../../mocks";
import ROUTES from "@/shared/constants/routes";

const user = userEvent.setup();

describe("AuthForm Component", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  describe("Sign In form", () => {
    describe("Rendering", () => {
      it("Should display all required fields", () => {
        const onSubmit = jest.fn();
        render(
          <AuthForm
            schema={SignInSchema}
            defaultValues={{ email: "", password: "" }}
            onSubmit={onSubmit}
            formType="SIGN_IN"
          />,
        );
        expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Sign In" }),
        ).toBeInTheDocument();
        expect(screen.getByText("Don't have an Account?")).toBeInTheDocument();
      });
    });

    describe("Form validation", () => {
      let onSubmit: jest.Mock;

      beforeEach(() => {
        onSubmit = jest.fn();
        render(
          <AuthForm
            schema={SignInSchema}
            defaultValues={{ email: "", password: "" }}
            onSubmit={onSubmit}
            formType="SIGN_IN"
          />,
        );
      });

      it("Should show validation error for invalid email", async () => {
        await user.type(screen.getByLabelText("Email Address"), "test@invalid");
        await user.type(screen.getByLabelText("Password"), "123123123");
        await user.click(screen.getByRole("button", { name: "Sign In" }));

        expect(
          screen.getByText("Please provide a valid email address"),
        ).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
      });

      it("Should show validation error for short password", async () => {
        await user.type(
          screen.getByLabelText("Email Address"),
          "valid@email.com",
        );
        await user.type(screen.getByLabelText("Password"), "123");
        await user.click(screen.getByRole("button", { name: "Sign In" }));

        expect(
          screen.getByText("Password must be at least 6 characters"),
        ).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });

    describe("Submission", () => {
      it("Should call onSubmit with valid data and show loading state", async () => {
        const onSubmit = jest
          .fn()
          .mockImplementation(
            () =>
              new Promise((resolve) =>
                setTimeout(() => resolve({ success: true }), 100),
              ),
          );
        render(
          <AuthForm
            schema={SignInSchema}
            defaultValues={{ email: "", password: "" }}
            onSubmit={onSubmit}
            formType="SIGN_IN"
          />,
        );

        await user.type(
          screen.getByLabelText("Email Address"),
          "test@valid.com",
        );
        await user.type(screen.getByLabelText("Password"), "123123123");
        await user.click(screen.getByRole("button", { name: "Sign In" }));

        expect(screen.getByText("Signin In...")).toBeInTheDocument();
        expect(onSubmit).toHaveBeenCalledWith({
          email: "test@valid.com",
          password: "123123123",
        });
      });
    });

    describe("Success Handling", () => {
      it("Should show success toast and redirect to home", async () => {
        const onSubmit = jest.fn().mockResolvedValue({ success: true });
        render(
          <AuthForm
            schema={SignInSchema}
            defaultValues={{ email: "", password: "" }}
            onSubmit={onSubmit}
            formType="SIGN_IN"
          />,
        );

        await user.type(
          screen.getByLabelText("Email Address"),
          "test@valid.com",
        );
        await user.type(screen.getByLabelText("Password"), "123123123");
        await user.click(screen.getByRole("button", { name: "Sign In" }));

        expect(mockToast.success).toHaveBeenCalledWith(
          "You have successfully signed in.",
        );
        expect(mockRouter.replace).toHaveBeenCalledWith(ROUTES.HOME);
      });

      it("Should show error toast when sign in fails", async () => {
        const onSubmit = jest.fn().mockResolvedValue({
          success: false,
          status: 401,
          error: { message: "Invalid credentials" },
        });
        render(
          <AuthForm
            schema={SignInSchema}
            defaultValues={{ email: "", password: "" }}
            onSubmit={onSubmit}
            formType="SIGN_IN"
          />,
        );

        await user.type(
          screen.getByLabelText("Email Address"),
          "test@valid.com",
        );
        await user.type(screen.getByLabelText("Password"), "123123123");
        await user.click(screen.getByRole("button", { name: "Sign In" }));

        expect(mockToast.error).toHaveBeenCalledWith("Error (401)", {
          description: "Invalid credentials",
        });
      });
    });
  });

  describe("Sign Up form", () => {
    let onSubmit: jest.Mock;

    beforeEach(() => {
      onSubmit = jest.fn();
      render(
        <AuthForm
          schema={SignUpSchema}
          defaultValues={{ username: "", name: "", email: "", password: "" }}
          onSubmit={onSubmit}
          formType="SIGN_UP"
        />,
      );
    });

    describe("Rendering", () => {
      it("Should display all required fields", () => {
        expect(screen.getByLabelText("Username")).toBeInTheDocument();
        expect(screen.getByLabelText("Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Sign Up" }),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Already have an Account?"),
        ).toBeInTheDocument();
      });
    });

    describe("Form validation", () => {
      // Valid data for all fields - only override the field being tested
      const validData = {
        username: "validuser",
        name: "Valid Name",
        email: "test@valid.com",
        password: "ValidPass1!",
      };

      it("should show error for short username", async () => {
        await user.type(screen.getByLabelText("Username"), "ab");
        await user.type(screen.getByLabelText("Name"), validData.name);
        await user.type(
          screen.getByLabelText("Email Address"),
          validData.email,
        );
        await user.type(screen.getByLabelText("Password"), validData.password);
        await user.click(screen.getByRole("button", { name: "Sign Up" }));
        expect(
          screen.getByText("Username must be at least 3 characters long."),
        ).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
      });

      it("should show error for invalid username characters", async () => {
        await user.type(screen.getByLabelText("Username"), "invalid user!");
        await user.type(screen.getByLabelText("Name"), validData.name);
        await user.type(
          screen.getByLabelText("Email Address"),
          validData.email,
        );
        await user.type(screen.getByLabelText("Password"), validData.password);
        await user.click(screen.getByRole("button", { name: "Sign Up" }));
        expect(
          screen.getByText(
            "Username can only contain letters, numbers, and underscores.",
          ),
        ).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
      });

      it("should show error for invalid email", async () => {
        await user.type(screen.getByLabelText("Username"), validData.username);
        await user.type(screen.getByLabelText("Name"), validData.name);
        await user.type(screen.getByLabelText("Email Address"), "notanemail");
        await user.type(screen.getByLabelText("Password"), validData.password);
        await user.click(screen.getByRole("button", { name: "Sign Up" }));
        expect(
          screen.getByText("Please provide a valid email address."),
        ).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
      });

      it("should show error for password missing uppercase", async () => {
        await user.type(screen.getByLabelText("Username"), validData.username);
        await user.type(screen.getByLabelText("Name"), validData.name);
        await user.type(
          screen.getByLabelText("Email Address"),
          validData.email,
        );
        await user.type(screen.getByLabelText("Password"), "validpass1!");
        await user.click(screen.getByRole("button", { name: "Sign Up" }));
        expect(
          screen.getByText(
            "Password must contain at least one uppercase letter.",
          ),
        ).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
      });

      it("should show error for password missing number", async () => {
        await user.type(screen.getByLabelText("Username"), validData.username);
        await user.type(screen.getByLabelText("Name"), validData.name);
        await user.type(
          screen.getByLabelText("Email Address"),
          validData.email,
        );
        await user.type(screen.getByLabelText("Password"), "ValidPass!");
        await user.click(screen.getByRole("button", { name: "Sign Up" }));
        expect(
          screen.getByText("Password must contain at least one number."),
        ).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
      });

      it("should show error for password missing special character", async () => {
        await user.type(screen.getByLabelText("Username"), validData.username);
        await user.type(screen.getByLabelText("Name"), validData.name);
        await user.type(
          screen.getByLabelText("Email Address"),
          validData.email,
        );
        await user.type(screen.getByLabelText("Password"), "ValidPass1");
        await user.click(screen.getByRole("button", { name: "Sign Up" }));
        expect(
          screen.getByText(
            "Password must contain at least one special character.",
          ),
        ).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
      });

      it("should show error for invalid name characters", async () => {
        await user.type(screen.getByLabelText("Username"), validData.username);
        await user.type(screen.getByLabelText("Name"), "Name123");
        await user.type(
          screen.getByLabelText("Email Address"),
          validData.email,
        );
        await user.type(screen.getByLabelText("Password"), validData.password);
        await user.click(screen.getByRole("button", { name: "Sign Up" }));
        expect(
          screen.getByText("Name can only contain letters and spaces."),
        ).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });

    describe("Submission", () => {
      it("Should call onSubmit with valid data and show loading state", async () => {
        onSubmit.mockImplementation(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ success: true }), 100),
            ),
        );

        await user.type(screen.getByLabelText("Username"), "validuser");
        await user.type(screen.getByLabelText("Name"), "Valid Name");
        await user.type(
          screen.getByLabelText("Email Address"),
          "test@valid.com",
        );
        await user.type(screen.getByLabelText("Password"), "Valid1!abc");
        await user.click(screen.getByRole("button", { name: "Sign Up" }));

        expect(screen.getByText("Signing Up...")).toBeInTheDocument();
        expect(onSubmit).toHaveBeenCalledWith({
          username: "validuser",
          name: "Valid Name",
          email: "test@valid.com",
          password: "Valid1!abc",
        });
      });
    });

    describe("Success Handling", () => {
      it("Should show success toast and redirect to home", async () => {
        onSubmit.mockResolvedValue({ success: true });

        await user.type(screen.getByLabelText("Username"), "validuser");
        await user.type(screen.getByLabelText("Name"), "Valid Name");
        await user.type(
          screen.getByLabelText("Email Address"),
          "test@valid.com",
        );
        await user.type(screen.getByLabelText("Password"), "Valid1!abc");
        await user.click(screen.getByRole("button", { name: "Sign Up" }));

        expect(mockToast.success).toHaveBeenCalledWith(
          "You have successfully signed up.",
        );
        expect(mockRouter.replace).toHaveBeenCalledWith(ROUTES.HOME);
      });

      it("Should show error toast when sign up fails", async () => {
        onSubmit.mockResolvedValue({
          success: false,
          status: 400,
          error: { message: "Email already exists" },
        });

        await user.type(screen.getByLabelText("Username"), "validuser");
        await user.type(screen.getByLabelText("Name"), "Valid Name");
        await user.type(
          screen.getByLabelText("Email Address"),
          "test@valid.com",
        );
        await user.type(screen.getByLabelText("Password"), "Valid1!abc");
        await user.click(screen.getByRole("button", { name: "Sign Up" }));

        expect(mockToast.error).toHaveBeenCalledWith("Error (400)", {
          description: "Email already exists",
        });
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });
  });
});
