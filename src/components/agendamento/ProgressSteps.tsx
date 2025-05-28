
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
}

export const ProgressSteps = ({ currentStep }: ProgressStepsProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentStep >= stepNumber 
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNumber}
            </div>
            <span className={`ml-2 text-sm font-medium ${currentStep >= stepNumber ? 'text-green-600' : 'text-gray-600'}`}>
              {stepNumber === 1 && 'Serviços'}
              {stepNumber === 2 && 'Pet'}
              {stepNumber === 3 && 'Data/Hora'}
              {stepNumber === 4 && 'Confirmação'}
            </span>
            {stepNumber < 4 && (
              <ArrowRight className={`w-4 h-4 mx-4 ${
                currentStep > stepNumber ? 'text-green-600' : 'text-gray-400'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
