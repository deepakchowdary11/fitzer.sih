import React, { createContext, useContext, useState, useEffect } from 'react';

const BMIContext = createContext();

export const useBMI = () => {
  const context = useContext(BMIContext);
  if (!context) {
    throw new Error('useBMI must be used within a BMIProvider');
  }
  return context;
};

export const BMIProvider = ({ children }) => {
  const [bmiData, setBmiData] = useState({
    bmi: 0,
    bmiCategory: '',
    heightCm: 0,
    weightKg: 0,
    age: 25,
    gender: 'male',
    sleepHours: 8,
    bodyFatPercentage: 15,
    geneticCondition: '',
    activityLevel: 'moderate',
    fitnessGoal: 'maintain'
  });

  useEffect(() => {
    // Load BMI data from localStorage on mount
    try {
      const saved = JSON.parse(localStorage.getItem('fitzer.bmi') || '{}');
      if (saved && typeof saved === 'object') {
        setBmiData(prev => ({ ...prev, ...saved }));
      }
    } catch (error) {
      console.error('Error loading BMI data:', error);
    }
  }, []);

  const updateBMI = (newData) => {
    const updatedData = { ...bmiData, ...newData };
    setBmiData(updatedData);
    
    // Save to localStorage
    try {
      localStorage.setItem('fitzer.bmi', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving BMI data:', error);
    }
  };

  const calculateBMI = (height, weight) => {
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      let category = '';
      
      if (bmi < 18.5) {
        category = 'Underweight';
      } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal';
      } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
      } else {
        category = 'Obese';
      }
      
      return { bmi: Math.round(bmi * 10) / 10, bmiCategory: category };
    }
    return { bmi: 0, bmiCategory: '' };
  };

  const value = {
    bmiData,
    updateBMI,
    calculateBMI
  };

  return (
    <BMIContext.Provider value={value}>
      {children}
    </BMIContext.Provider>
  );
};
