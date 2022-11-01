import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';

import AddEvaluateeModal from '../../../components/AddEvaluateeModal/AddEvaluateeModal.js';

export default function ClassesEvaluation({ setDrawerSelectedItem, link }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAddEvaluateeModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleAddEvaluateeModalClose = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    setDrawerSelectedItem(link);
  }, []);
  return (
    <div>
      <h1>Classes evalution</h1>
      <Button onClick={handleAddEvaluateeModalOpen}>Add Evaluatee</Button>
      <AddEvaluateeModal
        isOpen={isModalOpen}
        onAdd={handleAddEvaluateeModalClose}
        onClose={handleAddEvaluateeModalClose}
      />
    </div>
  );
}
