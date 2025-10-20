import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../button/Button';
import AddIngredientModal from '../addIngredientModal/AddIngredientModal';

const AddIngredientButton = ({ onIngredientAdded, variant = "primary", size = "medium" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitIngredient = async (ingredientData) => {
    try {
      if (onIngredientAdded) {
        await onIngredientAdded(ingredientData);
      }
      
      setIsModalOpen(false);
      
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
        <div className='buttonIngredient'>
      <Button
        variant={variant}
        size={size}
        icon={Plus}
        iconPosition="left"
        onClick={handleOpenModal}
      >
        Añadir ingrediente
      </Button>
      </div>

      <AddIngredientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitIngredient}
      />
    </>
  );
};

export default AddIngredientButton;