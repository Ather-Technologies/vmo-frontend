"use client"

import React, { useState } from 'react';

function ActionsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = () => {
    setIsOpen(true);
  };

  const handleMenuClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button className="text-gray-500 text-md" onClick={handleButtonClick}>
        Main Menu
      </button>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center" onClick={handleMenuClose}>
          <div className="bg-white rounded-lg p-4 text-gray-900">
            <h2 className="text-lg font-bold mb-4">Menu</h2>
            <p>Menu content goes here.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionsMenu;