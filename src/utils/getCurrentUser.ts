import { authOptions } from "@/lib/auth";
import { getServerSession, User } from "next-auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!user) return null;
  return user;
}
