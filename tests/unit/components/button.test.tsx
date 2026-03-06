import { Button } from "@/shared/components/ui";
import { fireEvent, render, screen } from "@testing-library/react";

describe("button Component - TDD", () => {
  it("should render a button with text", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
  });

  it("should call the onClick when the button is clicked", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });

  it("should render the button with the correct variant", () => {
    render(<Button variant="destructive">Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-destructive"); // ✅ correct class
  });

  it("should render the button with correct disabled state", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
