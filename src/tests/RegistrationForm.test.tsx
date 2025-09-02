import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegistrationForm } from "../components/RegistrationForm";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  vi,
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} from "vitest";

const server = setupServer(
  http.post("http://localhost:5000/register", () => {
    return HttpResponse.json("Team registered successfully!");
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock the useToast hook
const mockToast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe("RegistrationForm", () => {
  it("renders the form correctly", () => {
    render(<RegistrationForm />);
    expect(screen.getByLabelText(/Team Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Register Your Team/i)).toBeInTheDocument();
  });

  it("allows adding and removing participants", async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);
    const addMemberButton = screen.getByText(/Add Team Member/i);
    await user.click(addMemberButton);
    expect(screen.getAllByPlaceholderText(/Member \d+ Name/i)).toHaveLength(3);

    const removeButtons = screen.getAllByRole("button", {
      name: /minus-circle/i,
    });
    await user.click(removeButtons[0]);
    expect(screen.getAllByPlaceholderText(/Member \d+ Name/i)).toHaveLength(2);
  });

  it("submits the form with valid data", async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);

    await user.type(screen.getByLabelText(/Team Name/i), "Test Team");
    await user.type(
      screen.getAllByPlaceholderText(/Member \d+ Name/i)[0],
      "John Doe"
    );
    await user.type(
      screen.getAllByPlaceholderText(/Member \d+ Email/i)[0],
      "john.doe@example.com"
    );
    await user.type(
      screen.getAllByPlaceholderText(/Member \d+ Name/i)[1],
      "Jane Doe"
    );
    await user.type(
      screen.getAllByPlaceholderText(/Member \d+ Email/i)[1],
      "jane.doe@example.com"
    );

    const file = new File(["(⌐□_□)"], "payment.pdf", {
      type: "application/pdf",
    });
    const fileInput = screen.getByLabelText(/Payment Proof/i);
    await user.upload(fileInput, file);

    await user.type(
      screen.getByLabelText(/Git Repository URL/i),
      "https://github.com/test/repo"
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("Web Development"));

    const submitButton = screen.getByText(/Register Team/i);
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Registering.../i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Registration Successful!",
        description: "Team registered successfully!",
      });
    });
  });
});
