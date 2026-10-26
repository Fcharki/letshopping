import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all scale-100">
        <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
        <p className="text-gray-600 mt-2">Are you sure you want to delete this? This action cannot be undone.</p>
        
        <div className="flex justify-end mt-6 space-x-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
