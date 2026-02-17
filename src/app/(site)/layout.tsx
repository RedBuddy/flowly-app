import { getServerSession } from "@/actions/auth/get-session.action";
import { redirect } from "next/navigation";

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
