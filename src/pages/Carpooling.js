import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaRobot } from "react-icons/fa";
import carp from "../assets/carp.jpg";
import CarpoolingModal from "../components/CarpoolingModal";
import { getCarpoolingSuggestion } from "../utils/geminiAI";

const Carpooling = () => {
  const [showModal, setShowModal] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  useEffect(() => {
    loadAISuggestion();
  }, []);

  const loadAISuggestion = async () => {
    const suggestion = await getCarpoolingSuggestion("your location", "your destination", "morning");
    setAiSuggestion(suggestion);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* AI Suggestion Banner */}
      {aiSuggestion && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 px-6 text-center"
        >
          <div className="flex items-center justify-center space-x-3">
            <FaRobot className="text-3xl" />
            <p className="text-lg font-semibold">{aiSuggestion}</p>
          </div>
        </motion.div>
      )}
      
      <div className="flex flex-col lg:flex-row min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 p-8 flex flex-col justify-center"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-custom-green mb-6 leading-tight">
            Car Pooling  
          </h2>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-green-700 mb-8">
            Earn, Connect and Contribute to Greener Society
          </h2>
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💰</span>
              <p className="text-lg text-gray-700">Save money on commute</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🌱</span>
              <p className="text-lg text-gray-700">Reduce carbon footprint</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👥</span>
              <p className="text-lg text-gray-700">Meet new people</p>
            </div>
          </div>
          <button
            onClick={toggleModal}
            type="button"
            className="custom-button px-8 py-4 text-lg transform transition hover:scale-105 shadow-xl w-fit"
          >
            Start Your Journey
          </button>
          <CarpoolingModal showModal={showModal} toggleModal={toggleModal} />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2 p-8 flex justify-center items-center"
        >
          <img src={carp} className="w-full max-w-lg h-auto rounded-2xl shadow-2xl" alt="Carpooling" />
        </motion.div>
      </div>
    </div>
  );
};

export default Carpooling;
