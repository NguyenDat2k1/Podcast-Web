import LoginForm from "@/components/LoginForm";
import HomePage from "@/components/HomePage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // if (!session) redirect("/homePage");

  return (
    <main>
      <HomePage />
    </main>
  );
}
