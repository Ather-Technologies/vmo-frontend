import React, { useState } from 'react';
import Modal from './BaseComponents/Modal';

interface NavigationHeaderProps {
  // Define any props you need here
}

const NavigationHeader: React.FC<NavigationHeaderProps> = () => {
  const [showSubModal, setShowSubModal] = useState(false);

  return ( 
    <nav className="bg-gray-900 text-white flex justify-between items-center px-4 py-2 w-full">
      {/* Link container */}
      <div className="flex items-center">
        {/* Add more navigation items here as needed */}
        <h2 className="text-xl font-semibold cursor-pointer text-gray-300" onClick={() => setShowSubModal(true)}>Subscription Management</h2>
      </div>
      { // Subscription management modal
      showSubModal && (
        <Modal title="Manage Your Subscription" colorMode="dark" onClose={() => setShowSubModal(false)}>
          <div>
            <p>Hello, here you can manage your subscription!</p>
            {/* Place modal content here */}
          </div>
        </Modal>
      )}
    </nav>
  );
};

export default NavigationHeader;