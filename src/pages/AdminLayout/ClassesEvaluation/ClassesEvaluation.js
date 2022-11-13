import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AddEvaluateeModal from '../../../components/AddEvaluateeModal/AddEvaluateeModal.js';

export default function ClassesEvaluation({ setDrawerSelectedItem, link }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAddEvaluateeModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleAddEvaluateeModalClose = () => {
    setIsModalOpen(false);
  };

  const notifySuccess = (msg) =>
    toast.success(`${msg}`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const notifyError = (msg) =>
    toast.error(`${msg}`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  useEffect(() => {
    setDrawerSelectedItem(link);
  }, []);
  return (
    <div>
      <ToastContainer />

      <h1>Classes evalution</h1>
      <Button onClick={handleAddEvaluateeModalOpen}>Add Evaluatee</Button>
      <AddEvaluateeModal
        isOpen={isModalOpen}
        onClose={handleAddEvaluateeModalClose}
        notifySuccess={notifySuccess}
        notifyError={notifyError}
      />
    </div>
  );
}
