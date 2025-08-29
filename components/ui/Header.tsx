import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full py-6 px-8 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">
          Meta Ads Automation
        </h1>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors">
            About
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
