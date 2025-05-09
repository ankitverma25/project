import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateCarValuation = async (req, res) => {
  try {
    const { model: carModel, year, condition, fuelType, mileage } = req.body;
    
    const prompt = `You are an expert automotive scrap valuation system in India. Based on your extensive knowledge of the Indian car market, scrap metal prices, and vehicle recycling industry, provide an estimated scrap value for the following vehicle:

Vehicle Details:
- Make and Model: ${carModel}
- Manufacturing Year: ${year}
- Current Condition: ${condition}
- Fuel Type: ${fuelType}
- Odometer Reading: ${mileage || 'N/A'} kilometers

Consider these key factors in your valuation:
1. Material Composition:
   - Average metal content (steel, aluminum, copper) based on vehicle type
   - Current market rates for recyclable materials
   - Salvageable parts value

2. Age-related Factors:
   - Depreciation curve for this specific model
   - Typical material degradation based on age
   - Historical scrap value trends for similar vehicles

3. Market Conditions:
   - Current scrap metal prices in Indian market
   - Regional demand for specific car parts
   - Seasonal market fluctuations

4. Vehicle-specific Considerations:
   - Parts salvage potential based on model popularity
   - Known resale value of common components
   - Environmental compliance costs

5. Condition Impact:
   - Excellent: Parts have high salvage value, minimal rust/damage
   - Good: Normal wear, most parts salvageable
   - Poor: Significant deterioration, mainly scrap metal value

Final Valuation Rules:
- Base calculation on current 2025 market rates
- Consider both material scrap value and salvageable parts
- Account for processing and handling costs
- Factor in environmental disposal requirements
- Include transportation and dismantling costs

Return only the final estimated value in INR as a number, rounded to the nearest hundred. Example: 25000`;

    const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const price = parseInt(response.text().trim());

    if (isNaN(price)) {
      throw new Error('Failed to generate valid price estimation');
    }

    res.json({ estimatedValue: price });
  } catch (error) {
    console.error('AI Valuation Error:', error);
    res.status(500).json({ 
      message: 'Failed to generate AI valuation',
      error: error.message 
    });
  }
};

export { generateCarValuation };