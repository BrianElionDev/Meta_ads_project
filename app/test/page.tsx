export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Tailwind CSS Test</h1>
        
        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-600 p-6 rounded-xl text-white">
            <h3 className="text-xl font-semibold mb-2">Blue Card</h3>
            <p>This should be blue with white text</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl text-white border border-gray-700">
            <h3 className="text-xl font-semibold mb-2">Gray Card</h3>
            <p>This should be dark gray with white text</p>
          </div>
          
          <div className="bg-green-600 p-6 rounded-xl text-white">
            <h3 className="text-xl font-semibold mb-2">Green Card</h3>
            <p>This should be green with white text</p>
          </div>
        </div>
        
        {/* Test Buttons */}
        <div className="space-x-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Blue Button
          </button>
          <button className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Gray Button
          </button>
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Green Button
          </button>
        </div>
      </div>
    </div>
  );
}
