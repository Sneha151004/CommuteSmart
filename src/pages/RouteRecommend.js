import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRoute, FaClock, FaLeaf, FaMoneyBillWave, FaMapMarkerAlt, FaRobot } from 'react-icons/fa';
import { getRouteRecommendation } from '../utils/geminiAI';

const RouteRecommend = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);

  const transportModes = [
    { mode: 'Car', icon: '🚗', color: 'bg-blue-100', time: 25, cost: 150, carbon: 4.5 },
    { mode: 'Bus', icon: '🚌', color: 'bg-green-100', time: 45, cost: 30, carbon: 1.2 },
    { mode: 'Train', icon: '🚆', color: 'bg-purple-100', time: 35, cost: 40, carbon: 0.8 },
    { mode: 'Bike', icon: '🚴', color: 'bg-yellow-100', time: 50, cost: 0, carbon: 0 },
    { mode: 'Carpool', icon: '🚗👥', color: 'bg-teal-100', time: 30, cost: 75, carbon: 1.5 }
  ];

  const handleFindRoutes = async () => {
    if (!source || !destination) {
      alert('Please enter both source and destination');
      return;
    }
    setLoading(true);
    
    // Get AI recommendation
    const aiResult = await getRouteRecommendation(source, destination);
    if (aiResult) {
      setAiRecommendation(aiResult);
    }
    
    setTimeout(() => {
      setRoutes(transportModes);
      setLoading(false);
    }, 1000);
  };

  const getRecommendation = (mode) => {
    if (aiRecommendation && mode.mode.toLowerCase() === aiRecommendation.mode?.toLowerCase()) {
      return '🤖 AI Recommended';
    }
    if (mode.carbon === 0) return 'Best for Environment';
    if (mode.cost === 0) return 'Most Economical';
    if (mode.time <= 30) return 'Fastest Option';
    if (mode.carbon < 2) return 'Eco-Friendly';
    return 'Convenient';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-center text-custom-green mb-8">
          Smart Route Recommendations
        </h1>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="flex items-center text-lg font-semibold mb-2 text-gray-700">
                <FaMapMarkerAlt className="mr-2 text-green-600" />
                Starting Point
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Enter your source location"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="flex items-center text-lg font-semibold mb-2 text-gray-700">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter your destination"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
              />
            </div>
          </div>
          <button
            onClick={handleFindRoutes}
            disabled={loading}
            className="w-full custom-button py-4 text-lg font-bold rounded-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Finding Best Routes...' : 'Find Routes'}
          </button>
        </div>

        {/* AI Recommendation Banner */}
        {aiRecommendation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 mb-8 shadow-xl"
          >
            <div className="flex items-center mb-3">
              <FaRobot className="text-4xl mr-3" />
              <h3 className="text-2xl font-bold">🤖 AI-Powered Recommendation</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div>
                <p className="text-sm opacity-90">Best Mode</p>
                <p className="text-xl font-bold">{aiRecommendation.mode}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Time</p>
                <p className="text-xl font-bold">{aiRecommendation.time} min</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Cost</p>
                <p className="text-xl font-bold">₹{aiRecommendation.cost}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Carbon</p>
                <p className="text-xl font-bold">{aiRecommendation.carbon} kg</p>
              </div>
            </div>
            <p className="text-sm bg-white/20 rounded-lg p-3">
              💡 {aiRecommendation.reason}
            </p>
          </motion.div>
        )}

        {routes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Routes:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className={`${route.color} rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-4xl mr-3">{route.icon}</span>
                      <h3 className="text-2xl font-bold text-gray-800">{route.mode}</h3>
                    </div>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {getRecommendation(route)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700">
                        <FaClock className="mr-2 text-blue-600" />
                        <span className="font-medium">Time:</span>
                      </div>
                      <span className="font-bold text-lg">{route.time} min</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700">
                        <FaMoneyBillWave className="mr-2 text-green-600" />
                        <span className="font-medium">Cost:</span>
                      </div>
                      <span className="font-bold text-lg">₹{route.cost}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700">
                        <FaLeaf className="mr-2 text-green-600" />
                        <span className="font-medium">Carbon:</span>
                      </div>
                      <span className="font-bold text-lg">{route.carbon} kg CO₂</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition transform hover:scale-105">
                    Select Route
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {routes.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FaRoute className="text-6xl text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Plan Your Green Journey</h3>
            <p className="text-gray-600">Enter your starting point and destination to discover eco-friendly routes</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RouteRecommend;
