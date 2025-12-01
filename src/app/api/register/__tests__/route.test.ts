import { POST } from "../route";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { signUpSchema } from "@/schema/signUpSchema";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcrypt");
jest.mock("@/schema/signUpSchema", () => ({
  signUpSchema: {
    safeParse: jest.fn(),
  },
}));

describe("POST /api/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
    };

    (signUpSchema.safeParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      },
    });

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const req = new Request("http://localhost/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({
      id: mockUser.id,
      email: mockUser.email,
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(prisma.user.create).toHaveBeenCalled();
  });
});
