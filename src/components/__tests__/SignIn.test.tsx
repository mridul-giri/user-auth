import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignIn from "../SignIn";
import { signIn } from "next-auth/react";
import axios from "axios";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const mockedSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("SignIn Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle Google sign in", async () => {
    const user = userEvent.setup();
    mockedSignIn.mockResolvedValue({
      error: null,
      status: 200,
      ok: true,
      url: null,
    });

    render(<SignIn />);

    const googleButton = screen.getByText("Continue with Google");
    await user.click(googleButton);

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith("google", {
        callbackUrl: "/dashboard",
      });
    });
  });
});
