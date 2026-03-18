import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  MockEditor,
  mockRouter,
  mockToast,
  resetAllMocks,
} from "../../../mocks";
import QuestionForm from "@/features/question/components/question-form";
import userEvent from "@testing-library/user-event";
import { createQuestion } from "@/features/question/actions/question.action";

jest.mock("@/shared/components/editor", () => ({
  __esModule: true,
  default: MockEditor,
}));

jest.mock("@/features/question/actions/question.action", () => ({
  createQuestion: jest.fn(),
}));

const mockCreateQuestion = createQuestion as jest.MockedFunction<
  typeof createQuestion
>;

describe("QuestionForm Component", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    resetAllMocks();
    mockCreateQuestion.mockClear();
  });

  describe("Rendering", () => {
    it("Should render all form fields", async () => {
      render(<QuestionForm />);

      expect(screen.getByLabelText(/question title/i)).toBeInTheDocument();

      expect(
        await screen.findByLabelText(/question details/i),
      ).toBeInTheDocument();

      expect(screen.getByPlaceholderText(/add tags/i)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /ask a question/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("Should show validation error when the form is empty", async () => {
      render(<QuestionForm />);

      const submitBtn = screen.getByRole("button", {
        name: /ask a question/i,
      });

      await user.click(submitBtn);

      expect(
        await screen.findByText(/Title must be at least 5 characters./i),
      ).toBeInTheDocument();

      expect(
        await screen.findByText(/minimum of 100 characters/i),
      ).toBeInTheDocument();

      expect(
        await screen.findByText(/add at least one tag/i),
      ).toBeInTheDocument();
    });
  });

  describe("Submission", () => {
    it("Should submit form successfully with valid data", async () => {
      mockCreateQuestion.mockResolvedValue({
        success: true,
        data: {
          _id: "123",
          title: "",
          content: "",
          tags: [],
          author: {
            _id: "",
            name: "",
            image: "",
          },
          createdAt: new Date(),
          upvotes: 0,
          downvotes: 0,
          answers: 0,
          views: 0,
        },
      });

      render(<QuestionForm />);

      await user.type(
        screen.getByLabelText(/question title/i),
        "Unit testing Title",
      );

      const editorTextArea = await screen.findByTestId("mdx-editor");

      await user.click(editorTextArea);

      await user.type(
        editorTextArea,
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      );

      const tagInput = screen.getByPlaceholderText(/add tags/i);

      fireEvent.change(tagInput, { target: { value: "react" } });
      fireEvent.keyDown(tagInput, { key: "Enter" });

      const submitBtn = screen.getByRole("button", {
        name: /ask a question/i,
      });

      await user.click(submitBtn);

      await waitFor(() => {
        expect(mockCreateQuestion).toHaveBeenCalledWith({
          title: "Unit testing Title",
          content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
          tags: ["react"],
        });
        expect(mockToast.success).toHaveBeenCalledWith(
          "Question created successfully",
        );
        expect(mockRouter.push).toHaveBeenCalledWith("/questions/123");
      });
    });
    it("Should show error toast and stay on page when submission fails", async () => {
      mockCreateQuestion.mockResolvedValue({
        success: false,
        status: 400,
        error: { message: "Something went wrong" },
      });

      render(<QuestionForm />);

      await user.type(screen.getByLabelText(/question title/i), "Valid Title");

      const editorTextArea = await screen.findByTestId("mdx-editor");
      await user.click(editorTextArea);
      await user.type(
        editorTextArea,
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      );

      const tagInput = screen.getByPlaceholderText(/add tags/i);
      fireEvent.change(tagInput, { target: { value: "react" } });
      fireEvent.keyDown(tagInput, { key: "Enter" });

      const submitBtn = screen.getByRole("button", { name: /ask a question/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(mockCreateQuestion).toHaveBeenCalledWith({
          title: "Valid Title",
          content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
          tags: ["react"],
        });

        expect(mockToast.error).toHaveBeenCalledWith("Error 400", {
          description: "Something went wrong",
        });

        expect(mockRouter.push).not.toHaveBeenCalled();
      });
    });
  });
});
