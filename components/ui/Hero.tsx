import Link from "next/link";

export default function Hero() {
  return (
    <div className="mb-16 text-center">
      <h2 className="text-5xl font-bold mb-6 text-white">
        Your ads, automated
      </h2>
      <p className="text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
        Create, manage, and optimize your Meta Ads campaigns with intelligent automation
      </p>
      <Link
        href="/onboarding"
        className="inline-block px-8 py-4 bg-gray-700 text-white text-lg font-medium rounded-lg hover:bg-gray-600 transition-colors"
      >
        Proceed to onboarding
      </Link>        
    </div>
  );
}
