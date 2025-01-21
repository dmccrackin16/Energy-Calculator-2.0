import { EnhancedEnergyCalculator } from './components/EnhancedEnergyCalculator';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Building Energy Calculator 2.0</h1>
        <EnhancedEnergyCalculator />
      </div>
    </div>
  );
}

export default App;