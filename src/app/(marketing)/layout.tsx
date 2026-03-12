import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            Husbandry Tool
          </Link>
          <div className="flex gap-6">
            <Link href="/features" className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-300">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-300">
              Pricing
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-300">
              FAQ
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-300">
              About
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-300">
              Log In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-4 flex justify-between text-sm text-gray-500">
          <div>
            <Link href="/features" className="hover:underline">Features</Link>
            {" · "}
            <Link href="/pricing" className="hover:underline">Pricing</Link>
            {" · "}
            <Link href="/about" className="hover:underline">About</Link>
          </div>
          <span>© {new Date().getFullYear()} Husbandry Tool</span>
        </div>
      </footer>
    </div>
  );
}
