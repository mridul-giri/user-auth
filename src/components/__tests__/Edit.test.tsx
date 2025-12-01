import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Edit from "../Edit";
import axios from "axios";

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Edit Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update user profile successfully", async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: "user-123",
      name: "Old Name",
      email: "old@example.com",
      passwordExists: false,
    };

    mockedAxios.get.mockResolvedValue({
      data: { user: mockUser },
    });
    mockedAxios.patch.mockResolvedValue({
      data: {
        user: {
          id: "user-123",
          name: "New Name",
          email: "new@example.com",
        },
      },
    });

    render(<Edit userExist={true} />);

    await waitFor(() => {
      expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText("Your full name");
    await user.type(nameInput, "New Name");

    const submitButton = screen.getByText("Save changes");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.patch).toHaveBeenCalled();
    });
  });
});
