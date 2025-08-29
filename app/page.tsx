import Hero from "../components/ui/Hero";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] text-center relative">
      <Hero />
      
      {/* Footer */}
      <div className="mt-20 text-center">        
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
