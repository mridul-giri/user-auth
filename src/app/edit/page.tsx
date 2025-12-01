import Edit from "@/components/Edit";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Edit userExist={session?.user} />
    </>
  );
}
