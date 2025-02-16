import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCar, FaBus, FaTrain, FaBicycle, FaWalking } from 'react-icons/fa';

const CarbonFootprint = () => {
  const [transportData, setTransportData] = useState({
    car: 0,
    bus: 0,
    train: 0,
    bicycle: 0,
    walking: 0
  });

  const [totalEmissions, setTotalEmissions] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [badges, setBadges] = useState([]);

  // CO2 emissions in kg per km
  const emissionFactors = {
    car: 0.120,
    bus: 0.082,
    train: 0.041,
    bicycle: 0,
    walking: 0
  };

  useEffect(() => {
    calculateTotalEmissions();
    checkBadges();
  }, [transportData]);

  const calculateTotalEmissions = () => {
    let total = 0;
    Object.keys(transportData).forEach(mode => {
      total += transportData[mode] * emissionFactors[mode];
    });
    setTotalEmissions(total);
  };

  const checkBadges = () => {
    const newBadges = [];
    if (totalEmissions < 50) newBadges.push('Eco Warrior');
    if (transportData.bicycle + transportData.walking > 100) newBadges.push('Active Commuter');
    if (transportData.bus + transportData.train > 200) newBadges.push('Public Transport Hero');
    setBadges(newBadges);
  };

  const handleInputChange = (mode, value) => {
    setTransportData(prev => ({
      ...prev,
      [mode]: parseFloat(value) || 0
    }));
  };

  const getEmissionColor = () => {
    if (totalEmissions < 50) return 'text-green-500';
    if (totalEmissions < 100) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Carbon Footprint Calculator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Transport Mode Inputs */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <FaCar className="text-gray-600 mr-2" />
              <label className="text-gray-700">Car (km/month)</label>
            </div>
            <input
              type="number"
              value={transportData.car}
              onChange={(e) => handleInputChange('car', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <FaBus className="text-gray-600 mr-2" />
              <label className="text-gray-700">Bus (km/month)</label>
            </div>
            <input
              type="number"
              value={transportData.bus}
              onChange={(e) => handleInputChange('bus', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <FaTrain className="text-gray-600 mr-2" />
              <label className="text-gray-700">Train (km/month)</label>
            </div>
            <input
              type="number"
              value={transportData.train}
              onChange={(e) => handleInputChange('train', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <FaBicycle className="text-gray-600 mr-2" />
              <label className="text-gray-700">Bicycle (km/month)</label>
            </div>
            <input
              type="number"
              value={transportData.bicycle}
              onChange={(e) => handleInputChange('bicycle', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <FaWalking className="text-gray-600 mr-2" />
              <label className="text-gray-700">Walking (km/month)</label>
            </div>
            <input
              type="number"
              value={transportData.walking}
              onChange={(e) => handleInputChange('walking', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 mb-2">Total Monthly Emissions:</p>
              <p className={`text-3xl font-bold ${getEmissionColor()}`}>
                {totalEmissions.toFixed(2)} kg CO2
              </p>
            </div>
            <div>
              <p className="text-gray-700 mb-2">Your Green Badges:</p>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Eco-friendly Tips</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Consider carpooling to reduce individual carbon emissions</li>
            <li>Use public transport for longer journeys when possible</li>
            <li>Try cycling or walking for short distances</li>
            <li>Maintain your vehicle regularly for optimal fuel efficiency</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default CarbonFootprint;
