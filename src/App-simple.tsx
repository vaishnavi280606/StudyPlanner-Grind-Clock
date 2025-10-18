import { useState } from 'react';
import { Zap } from 'lucide-react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="shadow-md border-b bg-white border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-xl shadow-lg">
                <Zap className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Grind Clock</h1>
                <p className="text-xs text-slate-500">Push Your Limits</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Welcome to Grind Clock!
          </h2>
          <p className="text-slate-600 mb-8">
            Your study planner is working! Click the button below to test functionality.
          </p>
          <button
            onClick={() => setCount(count + 1)}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition-colors"
          >
            Clicked {count} times
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;