import Search from "@/components/Search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getUserAuth } from "@/lib/auth/utils";
import StatisticItem from "./StatisticItem";

export default async function Home() {
  const { session } = await getUserAuth();
  return (
    <main className="">
      <h1 className="my-2 text-2xl font-bold text-accent">
        Welcome, <span className="text-white">{session?.user.name}</span>
      </h1>

      <Search />

      <div className="grid grid-cols-1 gap-3 py-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardContent className="p-4">
            <div className="grid grid-cols-2">
              <StatisticItem label="books completed" value={39} />
              <StatisticItem label="pages read" value={48001} />
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-2 rounded-b-lg border bg-muted p-4 dark:bg-card">
            <Button>Add</Button>
            <Button>Complete</Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardContent className="flex flex-col gap-6 p-4">
            <div className="grid grid-cols-2">
              <StatisticItem label="books favorited" value={12} />
              <StatisticItem label="books reviewed" value={1} />
            </div>
            <div className="grid grid-cols-2">
              <StatisticItem label="quotes captured" value={19} />
              <StatisticItem label="reflections added" value={48} />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
