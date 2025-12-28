import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyBqenDkMCv8fb9pWBzh4EbD9DvEWQkB6vw");

export const getRouteRecommendation = async (source, destination, preferences = {}) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `As a sustainable transportation expert, analyze the route from "${source}" to "${destination}" and provide:
    1. Best eco-friendly transportation mode
    2. Estimated travel time
    3. Approximate cost in INR
    4. Carbon footprint (kg CO2)
    5. Brief reason for recommendation
    
    Consider: traffic conditions, distance, environmental impact, and cost-effectiveness.
    Response in JSON format: {"mode": "mode name", "time": minutes, "cost": rupees, "carbon": kg, "reason": "brief explanation"}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON from response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log("JSON parse failed, using default");
    }
    
    return {
      mode: "Bus",
      time: 30,
      cost: 40,
      carbon: 1.2,
      reason: "Most eco-friendly and cost-effective option for this route",
      aiResponse: text
    };
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return null;
  }
};

export const getCarbonFootprintAdvice = async (transportData, totalEmissions) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Based on monthly transportation data:
    - Car: ${transportData.car} km
    - Bus: ${transportData.bus} km
    - Train: ${transportData.train} km
    - Bicycle: ${transportData.bicycle} km
    - Walking: ${transportData.walking} km
    - Total emissions: ${totalEmissions.toFixed(2)} kg CO2
    
    Provide 3 personalized tips to reduce carbon footprint. Be specific and actionable. Keep each tip to 1-2 sentences.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.split('\n').filter(line => line.trim().length > 0);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return [
      "Consider carpooling for your car trips to reduce individual emissions",
      "Switch some car journeys to public transport or cycling",
      "Combine multiple errands into one trip to minimize overall travel"
    ];
  }
};

export const getParkingRecommendation = async (currentLocation, destination, vehicleType) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Suggest optimal parking strategy for ${vehicleType} traveling to ${destination}.
    Consider: parking availability, cost, walking distance, and eco-friendly options.
    Provide brief advice (2-3 sentences).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Look for parking spots within 5-10 minutes walking distance. Consider using park-and-ride facilities for longer trips.";
  }
};

export const getCommunityInsights = async (campaigns) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const campaignList = campaigns.slice(0, 3).map(c => c.title).join(", ");
    const prompt = `Based on these eco-friendly campaigns: ${campaignList}.
    Generate an encouraging message (2-3 sentences) about the community's environmental efforts and impact.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Your community is making great strides towards sustainability! Every action counts in creating a greener future.";
  }
};

export const getCarpoolingSuggestion = async (source, destination, time) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Provide carpooling tips for route from ${source} to ${destination} during ${time || 'regular hours'}.
    Include: best meeting points, safety tips, and environmental benefits. Keep it brief (3-4 sentences).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Carpooling reduces traffic congestion and cuts emissions by 50%. Choose well-lit public meeting points for safety. Split fuel costs to save money while helping the environment.";
  }
};
