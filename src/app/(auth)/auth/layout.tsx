import { getServerSession } from "@/actions/auth/get-session.action";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return <>{children}</>;
}
