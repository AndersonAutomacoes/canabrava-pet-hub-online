
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import PetSelection from '@/components/PetSelection';

interface PetSelectionStepProps {
  selectedPet: string;
  onPetSelect: (petId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PetSelectionStep = ({ 
  selectedPet, 
  onPetSelect, 
  onNext, 
  onBack 
}: PetSelectionStepProps) => {
  return (
    <div className="space-y-6">
      <Card className="pet-card border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-xl">Selecione o Pet</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <PetSelection selectedPet={selectedPet} onPetSelect={onPetSelect} />
        </CardContent>
      </Card>
      <div className="flex space-x-4">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex-1 h-12"
        >
          Voltar
        </Button>
        <Button 
          onClick={onNext} 
          className="flex-1 pet-button-primary h-12"
          disabled={!selectedPet}
        >
          <ArrowRight className="w-5 h-5 mr-2" />
          Continuar
        </Button>
      </div>
    </div>
  );
};
