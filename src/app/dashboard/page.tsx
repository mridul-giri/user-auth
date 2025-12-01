import Dashboard from "@/components/Dashboard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <Dashboard userExist={session?.user} />
    </>
  );
}
