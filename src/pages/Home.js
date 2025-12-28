import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import hero from "../assets/hero.png";
import { FaLeaf, FaCar, FaUsers, FaTrophy } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <FaCar />, title: "Car Pooling", desc: "Share rides, save money", link: "/car-pooling" },
    { icon: <FaLeaf />, title: "Carbon Tracking", desc: "Monitor your impact", link: "/carbon-footprint" },
    { icon: <FaUsers />, title: "Community", desc: "Join campaigns", link: "/community" },
    { icon: <FaTrophy />, title: "Rewards", desc: "Earn EcoCoins", link: "/redeem" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 p-8 flex flex-col justify-center"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-custom-green mb-6 leading-tight">
            Sustainable Urban Mobility: Paving the Way to a Greener Future
          </h2>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-green-700 mb-8">
            Optimize Your Commute, Minimize Your Footprint
          </h3>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/car-pooling')}
              className="custom-button px-6 py-3 transform transition hover:scale-105 shadow-lg"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate('/community')}
              className="bg-white border-2 border-green-600 text-green-600 font-bold px-6 py-3 rounded transform transition hover:scale-105 hover:bg-green-50 shadow-lg"
            >
              Learn More
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2 p-8 flex justify-center items-center"
        >
          <img src={hero} className="w-full max-w-lg h-auto drop-shadow-2xl" alt="Hero Image" />
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12"
        >
          Why Choose CommuteSmart?
        </motion.h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => navigate(feature.link)}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-4xl text-green-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
          <motion.div whileHover={{ scale: 1.1 }}>
            <h3 className="text-4xl font-bold mb-2">10K+</h3>
            <p className="text-lg">Active Users</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <h3 className="text-4xl font-bold mb-2">50K+</h3>
            <p className="text-lg">Rides Shared</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <h3 className="text-4xl font-bold mb-2">2M+</h3>
            <p className="text-lg">CO2 Saved (kg)</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <h3 className="text-4xl font-bold mb-2">100+</h3>
            <p className="text-lg">Campaigns</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
