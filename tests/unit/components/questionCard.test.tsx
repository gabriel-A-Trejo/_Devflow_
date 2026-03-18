import { render, screen } from "@testing-library/react";
import {
  MockEditDeleteAction,
  MockedImage,
  MockMetric,
  MockLink,
} from "../../mocks";

import { getTimeStamp } from "@/features/question/lib/getTimeStamp";

import type { Question } from "@/shared/types/global";
import QuestionCard from "@/features/question/components/question-card";

jest.mock("next/link", () => MockLink);
jest.mock("next/image", () => MockedImage);
jest.mock("@/features/user/components/edit-delete-action", () => ({
  __esModule: true,
  MockEditDeleteAction,
}));
jest.mock("@/features/question/components/metric", () => ({
  __esModule: true,
  Metric: MockMetric,
}));

const mockQuestion: Question = {
  _id: "123",
  title: "How to unit test a Next.js component",
  content: "This is a simple question content",
  tags: [
    { _id: "tag1", name: "JavaScript" },
    { _id: "tag2", name: "Next.js" },
  ],
  author: {
    _id: "user1",
    name: "John Doe",
    image: "/image/user.jpg",
  },
  createdAt: new Date("2025-09-01T12:00:00Z"),
  upvotes: 10,
  downvotes: 0,
  answers: 5,
  views: 100,
};

const relativeTimeText = getTimeStamp(mockQuestion.createdAt);
describe("QuestionCard Component", () => {
  describe("Rendering", () => {
    it("Should render all elements", () => {
      render(<QuestionCard question={mockQuestion} />);

      expect(
        screen.getByRole("link", { name: mockQuestion.title }),
      ).toHaveAttribute("href", "/questions/123");

      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getByText("Next.js")).toBeInTheDocument();

      expect(screen.getByRole("img", { name: "John Doe" }));
      expect(screen.getByText(relativeTimeText)).toBeInTheDocument();
      expect(screen.getByText("10 Votes")).toBeInTheDocument();
      expect(screen.getByText("5 Answers")).toBeInTheDocument();
      expect(screen.getByText("100 Views")).toBeInTheDocument();
    });

    describe("Responsive Behavior", () => {
      it("Should hide timestamp on small screes", () => {
        Object.defineProperty(window, "innerWidth", {
          writable: true,
          configurable: true,
          value: 500,
        });

        window.dispatchEvent(new Event("resize"));

        render(<QuestionCard question={mockQuestion} />);

        const timeStamp = screen.getByText(relativeTimeText, {
          selector: "span",
        });

        expect(timeStamp).toHaveClass("sm:hidden");
      });
    });
  });
});
