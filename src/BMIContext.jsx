import React, { createContext, useContext, useState, useEffect } from 'react';

const BMIContext = createContext();

export const useBMI = () => {
  const context = useContext(BMIContext);
  if (!context) {
    throw new Error('useBMI must be used within a BMIProvider');
  }
  return context;
};

const DEFAULT_BMI_DATA = {
  bmi: 0,
  bmiCategory: '',
  heightCm: 0,
  weightKg: 0,
  age: 0,
  gender: '',
  sleepHours: 0,
  bodyFatPercentage: 0,
  geneticCondition: '',
  activityLevel: 'moderate',
  fitnessGoal: 'maintain'
};

export const BMIProvider = ({ children }) => {
  const [bmiData, setBmiData] = useState(DEFAULT_BMI_DATA);

  // Helper to get active user ID
  const getActiveUserId = () => {
    try {
      const u = JSON.parse(localStorage.getItem('fitzer.user') || '{}');
      return u?.id || null;
    } catch {
      return null;
    }
  };

  const loadUserData = () => {
    try {
      const uid = getActiveUserId();
      if (uid) {
        const saved = JSON.parse(localStorage.getItem(`fitzer.bmi.${uid}`) || 'null');
        if (saved && typeof saved === 'object') {
          setBmiData(prev => ({ ...DEFAULT_BMI_DATA, ...saved }));
          return;
        }
      }
      setBmiData(DEFAULT_BMI_DATA);
    } catch (error) {
      console.error('Error loading user BMI data:', error);
      setBmiData(DEFAULT_BMI_DATA);
    }
  };

  useEffect(() => {
    loadUserData();

    // Listen for storage or hash changes (e.g. login/logout)
    const handleStorage = () => loadUserData();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('hashchange', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('hashchange', handleStorage);
    };
  }, []);

  const updateBMI = (newData, explicitUid = null) => {
    const uid = explicitUid || getActiveUserId();
    const updatedData = { ...bmiData, ...newData };
    setBmiData(updatedData);

    try {
      if (uid) {
        localStorage.setItem(`fitzer.bmi.${uid}`, JSON.stringify(updatedData));
      }
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
    calculateBMI,
    loadUserData
  };

  return (
    <BMIContext.Provider value={value}>
      {children}
    </BMIContext.Provider>
  );
};
