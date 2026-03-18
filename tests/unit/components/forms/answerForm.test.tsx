import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnswerForm from "@/features/answer/components/answer-form";
import { CreateAnswer } from "@/features/answer/actions/create-answer.action";
import { api } from "@/shared/lib/api";
import {
  MockEditor,
  mockSession,
  mockToast,
  mockUseSession,
  resetAllMocks,
} from "../../../mocks";

const user = userEvent.setup();

jest.mock("@/shared/components/editor", () => ({
  __esModule: true,
  default: MockEditor,
}));
jest.mock("@/features/answer/actions/create-answer.action", () => ({
  CreateAnswer: jest.fn(),
}));
jest.mock("@/shared/lib/api", () => ({
  api: { ai: { getAnswer: jest.fn() } },
}));

const mockCreateAnswer = CreateAnswer as jest.MockedFunction<
  typeof CreateAnswer
>;
const mockApiAiAnswer = api.ai.getAnswer as jest.MockedFunction<
  typeof api.ai.getAnswer
>;

describe("AnswerForm Component", () => {
  beforeAll(() => {
    resetAllMocks();
  });

  describe("AI Generation", () => {
    it("SHould generate an AI answer for an authenticated user", async () => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: jest.fn(),
      });

      mockApiAiAnswer.mockResolvedValue({
        success: true,
        data: "This is an AI-generated answer",
      });

      render(
        <AnswerForm
          questionId={"123"}
          questionTitle={"Test Question"}
          questionContent={"Test content"}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: /generate ai answer/i }),
      );

      expect(mockApiAiAnswer).toHaveBeenCalledWith(
        "Test Question",
        "Test content",
        "",
      );
      expect(mockToast.success).toHaveBeenCalledWith(
        "Success",
        expect.objectContaining({
          description: "AI generated answer has been generated.",
        }),
      );
    });

    it("Should not generate AI answer for unauthenticated user", async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "authenticated",
        update: jest.fn(),
      });
      render(
        <AnswerForm
          questionId={"123"}
          questionTitle={"Test Question"}
          questionContent={"Test content"}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: /generate ai answer/i }),
      );

      expect(mockToast.success).toHaveBeenCalledWith(
        "Success",
        expect.objectContaining({
          description: "AI generated answer has been generated.",
        }),
      );
    });
  });

  describe("Submission", () => {
    it("Should submit form successfully with valid data", async () => {
      mockCreateAnswer.mockResolvedValue({ success: true });

      render(
        <AnswerForm
          questionId="123"
          questionTitle="Test Question"
          questionContent="Test Content"
        />,
      );

      await user.type(
        await screen.findByTestId("mdx-editor"),
        "This is my answer to the question".repeat(5),
      );

      await user.click(screen.getByRole("button", { name: /post answer/i }));

      expect(mockCreateAnswer).toHaveBeenCalledWith({
        content: "This is my answer to the question".repeat(5),
        questionId: "123",
      });
      expect(mockToast.success).toHaveBeenCalledWith(
        "Your answer has been posted successfully",
      );
    });

    it("Should disable submit button when form is submitting", async () => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: jest.fn(),
      });

      mockCreateAnswer.mockImplementation(() => new Promise(() => {}));
      mockApiAiAnswer.mockImplementation(() => new Promise(() => {}));

      render(
        <AnswerForm
          questionId="123"
          questionTitle="Test Question"
          questionContent="Test Content"
        />,
      );

      await user.type(
        await screen.findByTestId("mdx-editor"),
        "This is my answer to the question".repeat(5),
      );

      const postButton = screen.getByRole("button", { name: /post answer/i });

      await user.click(postButton);

      await waitFor(() => {
        expect(postButton).toBeDisabled();
        expect(screen.getByText("Posting...")).toBeInTheDocument();
      });
    });

    it("Should disable ai button when the user clicks on the generate ai answer", async () => {
      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
        update: jest.fn(),
      });

      mockApiAiAnswer.mockImplementation(() => new Promise(() => {}));

      render(
        <AnswerForm
          questionId="123"
          questionTitle="Test Question"
          questionContent="Test Content"
        />,
      );
      const aiGenerateButton = screen.getByRole("button", {
        name: /generate ai answer/i,
      });
      await user.click(aiGenerateButton);

      await waitFor(() => {
        expect(aiGenerateButton).toBeDisabled();
        expect(screen.getByText("Generating...")).toBeInTheDocument();
      });
    });
  });
});
