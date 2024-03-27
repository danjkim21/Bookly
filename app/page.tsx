import { BooklyIcon } from "@/components/shared/BooklyIcon";
import Link from "next/link";

const features = [
  {
    title: "Sharing",
    description: "Create digital public bookshelves and share your stories."
  },
  {
    title: "Collaboration",
    description:
      "Create or join a Book Club to discuss your reading with friends and family"
  },
  {
    title: "Analysis",
    description:
      "Log your reading activity to get insight into your reading history, favorite genres, and trends."
  }
];
const footerLinks = [
  {
    title: "About",
    url: "/"
  },
  {
    title: "Pricing",
    url: "/pricing"
  },
  {
    title: "Community",
    url: "/community"
  },
  {
    title: "Sign In",
    url: "/sign-in"
  },
  {
    title: "danjkim21",
    url: "https://github.com/danjkim21"
  },
  {
    title: "© 2024 Bookly",
    url: "https://github.com/danjkim21/Bookly"
  }
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center px-4 lg:px-6">
        <Link className="flex items-center justify-center" href="/">
          <BooklyIcon className="h-10 w-10" />
          <span className="sr-only">Bookly</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="invisible hidden text-sm font-medium underline-offset-4 hover:underline sm:visible sm:block"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="/sign-in"
          >
            Sign In
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-6 sm:py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="mx-auto aspect-video overflow-hidden rounded-xl bg-neutral-100 object-cover dark:bg-neutral-800 sm:w-full lg:order-last lg:aspect-square" />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    The complete platform <br />
                    for discovering Stories
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground dark:text-neutral-400 md:text-xl">
                    Keep track of your favorite books with ease. Discover new
                    stories and connect with a community of like-minded readers.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-8 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-neutral-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 dark:focus-visible:ring-neutral-300"
                    href="/sign-up"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm dark:bg-neutral-800">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Easy to use. More discovery.
                </h2>
                <p className="max-w-[900px] text-muted-foreground dark:text-neutral-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The platform for your reading. Focus on developing your
                  reading habits, sharing your stories, and discovering new
                  worlds.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-10">
              <div className="mx-auto aspect-video overflow-hidden rounded-xl bg-neutral-100 object-cover object-center dark:bg-neutral-800 sm:w-full lg:order-last" />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  {features.map((feature, index) => {
                    return (
                      <li key={index}>
                        <div className="grid gap-1">
                          <h3 className="text-xl font-bold">{feature.title}</h3>
                          <p className="text-muted-foreground  dark:text-neutral-400">
                            {feature.description}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full border-t py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Sign Up for Updates
                </h2>
                <p className="max-w-[600px] text-muted-foreground dark:text-neutral-400 md:text-xl">
                  Stay updated with the latest product news and updates.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                  <input
                    className="max-w-lg flex-1 rounded-md border border-border px-4 py-2 "
                    placeholder="Enter your email"
                    type="email"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-neutral-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 dark:focus-visible:ring-neutral-300"
                  >
                    Sign Up
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className=" flex w-full shrink-0 items-center justify-center border-t">
        <div className="bg-g mx-4 my-10 flex min-w-[320px] max-w-xl  flex-col items-center justify-center gap-6 rounded-xl bg-secondary p-4 md:mx-6 md:p-12">
          <Link href="/">
            <BooklyIcon className="h-14 w-14" />
            <span className="sr-only">Bookly</span>
          </Link>
          <small className="text-xs text-white dark:text-neutral-400">
            <ul className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              {footerLinks.map((link, index) => {
                return (
                  <ol key={index}>
                    <Link
                      className="underline-offset-4 hover:underline"
                      href={link.url}
                    >
                      {link.title}
                    </Link>
                  </ol>
                );
              })}
            </ul>
          </small>
        </div>
      </footer>
    </div>
  );
}
