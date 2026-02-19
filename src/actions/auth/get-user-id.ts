'use server';
import { getServerSession } from "./get-session.action";

export async function getUserId(): Promise<string | null> {

  const session = await getServerSession();

  if (!session) {
    return null;
  }

  return session.user.id;
}