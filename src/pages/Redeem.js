import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCoins, FaGift } from "react-icons/fa";

const Redeem = () => {
  const navigate = useNavigate();
  const goodies = [
    {
      id: 1,
      name: "Money Plant",
      pointsRequired: 1000,
      imageUrl: require("../assets/plant.jpg"),
      description: "Bring nature to your space"
    },
    {
      id: 2,
      name: "Eco-Friendly Bottle",
      pointsRequired: 2500,
      imageUrl: require("../assets/bottle.jpeg"),
      description: "Stay hydrated sustainably"
    },
    {
      id: 4,
      name: "Branded Cap",
      pointsRequired: 3500,
      imageUrl: require("../assets/cap.jpg"),
      description: "Style meets sustainability"
    },
    {
      id: 5,
      name: "Eco T-Shirt",
      pointsRequired: 4500,
      imageUrl: require("../assets/tshirt.jpeg"),
      description: "Wear your values"
    },
  ];
  const currentCoins = localStorage.getItem("coins") || 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto flex flex-col items-center">
        {localStorage.getItem("id") ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl text-custom-green font-bold mb-4">
              Welcome, {localStorage.getItem("name")}!
            </h2>
            <div className="flex items-center justify-center space-x-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <FaCoins className="text-yellow-500 text-2xl" />
              <p className="text-xl font-bold text-gray-800">Eco-Coins Available:</p>
              <span className="text-2xl font-bold text-green-600">{currentCoins}</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center"
          >
            <FaGift className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl text-custom-green font-bold mb-4">
              Please Sign in to grab the goodies
            </h2>
            <button
              onClick={() => navigate("/login")}
              className="custom-button px-6 py-3 text-lg transform transition hover:scale-105"
            >
              Sign In Now
            </button>
          </motion.div>
        )}

        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-800 mb-8 text-center"
        >
          🎁 Rewards Store
        </motion.h3>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl">
          {goodies.map((goodie, index) => (
            <motion.div
              key={goodie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative">
                <img
                  className="w-full h-56 object-cover"
                  src={goodie.imageUrl}
                  alt={goodie.name}
                />
                {currentCoins >= goodie.pointsRequired && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Available!
                  </div>
                )}
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold mb-2 text-gray-800">{goodie.name}</h4>
                <p className="text-gray-600 mb-4 text-sm">{goodie.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FaCoins className="text-yellow-500" />
                    <span className="text-sm font-semibold text-custom-green">
                      {goodie.pointsRequired} EcoCoins
                    </span>
                  </div>
                </div>

                <button
                  className={`w-full custom-button px-4 py-3 text-lg transform transition hover:scale-105 ${
                    currentCoins < goodie.pointsRequired
                      ? "opacity-50 cursor-not-allowed"
                      : "shadow-lg"
                  }`}
                  disabled={currentCoins < goodie.pointsRequired}
                >
                  {currentCoins >= goodie.pointsRequired ? "Redeem Now" : "Insufficient Coins"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white text-center max-w-4xl"
        >
          <h3 className="text-2xl font-bold mb-4">🌟 Earn More EcoCoins!</h3>
          <p className="text-lg mb-4">
            Participate in carpooling, join community campaigns, and track your carbon footprint to earn more rewards!
          </p>
          <button
            onClick={() => navigate("/community")}
            className="bg-white text-green-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Explore Campaigns
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Redeem;
