import Search from "@/components/Search";
import { getUserAuth } from "@/lib/auth/utils";

export default async function Home() {
  const { session } = await getUserAuth();
  return (
    <main className="">
      <h1 className="my-2 text-2xl font-bold text-accent">
        Welcome, <span className="text-white">{session?.user.name}!</span>
      </h1>

      <Search />
    </main>
  );
}
