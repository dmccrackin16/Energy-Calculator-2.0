import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const BUILDING_TYPES = {
  office: { name: 'Office', low: 30, medium: 80, high: 130 },
  retail: { name: 'Retail', low: 40, medium: 90, high: 140 },
  hospital: { name: 'Hospital', low: 150, medium: 250, high: 350 },
  school: { name: 'School', low: 35, medium: 75, high: 115 },
  residential: { name: 'Residential', low: 25, medium: 60, high: 95 }
};

export const EnhancedEnergyCalculator = () => {
  const [buildings, setBuildings] = useState([]);
  const [formData, setFormData] = useState({
    buildingName: '',
    squareFootage: '',
    kbtu: '',
    buildingType: ''
  });
  const [currentEUI, setCurrentEUI] = useState(null);

  const calculateEUI = () => {
    if (!formData.buildingName || !formData.squareFootage || !formData.kbtu || !formData.buildingType) {
      return;
    }

    const eui = parseFloat(formData.kbtu) / parseFloat(formData.squareFootage);
    setCurrentEUI(eui);
  };

  const addToComparison = () => {
    if (!currentEUI) return;

    const newBuilding = {
      name: formData.buildingName,
      type: formData.buildingType,
      squareFootage: parseFloat(formData.squareFootage),
      kbtu: parseFloat(formData.kbtu),
      eui: currentEUI
    };

    setBuildings([...buildings, newBuilding]);
    setFormData({
      buildingName: '',
      squareFootage: '',
      kbtu: '',
      buildingType: ''
    });
    setCurrentEUI(null);
  };

  const getBenchmarkStatus = (eui, buildingType) => {
    const benchmark = BUILDING_TYPES[buildingType];
    if (!benchmark) return 'unknown';
    if (eui < benchmark.low) return 'excellent';
    if (eui < benchmark.medium) return 'good';
    if (eui < benchmark.high) return 'fair';
    return 'high';
  };

  const getComparisonData = () => {
    return buildings.map(building => ({
      name: building.name,
      EUI: parseFloat(building.eui.toFixed(2)),
      Benchmark: BUILDING_TYPES[building.type]?.medium || 0
    }));
  };

  const getBenchmarkingData = () => {
    if (!formData.buildingType || !currentEUI) return [];
    
    const benchmark = BUILDING_TYPES[formData.buildingType];
    return [
      { name: 'Low', value: benchmark.low },
      { name: 'Medium', value: benchmark.medium },
      { name: 'High', value: benchmark.high },
      { name: 'Current', value: currentEUI }
    ];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Building Energy Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Input
              placeholder="Building Name"
              value={formData.buildingName}
              onChange={(e) => setFormData({...formData, buildingName: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Square Footage"
                value={formData.squareFootage}
                onChange={(e) => setFormData({...formData, squareFootage: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Annual kBTU"
                value={formData.kbtu}
                onChange={(e) => setFormData({...formData, kbtu: e.target.value})}
              />
            </div>
            <select
              className="w-full p-2 border rounded"
              value={formData.buildingType}
              onChange={(e) => setFormData({...formData, buildingType: e.target.value})}
            >
              <option value="">Select Building Type</option>
              {Object.entries(BUILDING_TYPES).map(([key, value]) => (
                <option key={key} value={key}>{value.name}</option>
              ))}
            </select>
            <div className="flex gap-4">
              <Button 
                className="flex-1"
                onClick={calculateEUI}
              >
                Calculate EUI
              </Button>
              <Button 
                className="flex-1"
                onClick={addToComparison}
                disabled={!currentEUI}
              >
                Add to Comparison
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentEUI && (
        <Card>
          <CardHeader>
            <CardTitle>Current Building Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Energy Use Intensity (EUI): {currentEUI.toFixed(2)} kBTU/ft²/year
                </AlertDescription>
              </Alert>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getBenchmarkingData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {buildings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Building Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getComparisonData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="EUI" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="Benchmark" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};