
export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateString = (): string => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const KG_TO_LBS = 2.20462;
export const LBS_TO_KG = 0.453592;
export const M_TO_IN = 39.3701;

export const kgToLbs = (kg: number): number => kg * KG_TO_LBS;
export const lbsToKg = (lbs: number): number => lbs * LBS_TO_KG;

export const mToFtIn = (m: number): { feet: number, inches: number } => {
    const totalInches = m * M_TO_IN;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
}

export const ftInToM = (feet: number, inches: number): number => {
    const totalInches = (feet * 12) + inches;
    return totalInches / M_TO_IN;
}

export const cmToM = (cm: number): number => cm / 100;
export const mToCm = (m: number): number => m * 100;


export const calculateBMI = (weightKg: number, heightM: number): number => {
    if (heightM <= 0) return 0;
    return weightKg / (heightM * heightM);
};

export const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
}