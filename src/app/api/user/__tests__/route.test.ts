import { GET, PATCH } from "../route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/utils/getCurrentUser";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  authOptions: {},
}));

jest.mock("@/utils/getCurrentUser");
jest.mock("bcrypt");

describe("GET /api/user", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return user data successfully", async () => {
    const mockCurrentUser = { id: "user-123", email: "test@example.com" };
    const mockUser = {
      id: "user-123",
      name: "Test User",
      email: "test@example.com",
      image: null,
      password: "hashed-password",
    };

    (getCurrentUser as jest.Mock).mockResolvedValue(mockCurrentUser);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const req = new Request("http://localhost/api/user", {
      method: "GET",
    });

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.user).toEqual({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      passwordExists: true,
      image: mockUser.image,
    });
  });
});
