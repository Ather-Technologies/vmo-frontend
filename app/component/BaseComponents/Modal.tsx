import { ModalProps } from '../../lib/types';

const Modal: React.FC<ModalProps> = ({
    title,
    colorMode = 'light',
    showCloseButton = true,
    showSaveButton = false,
    onClose,
    onSave,
    children,
}) => {
    return ( // Z index of 10 is used to make sure the modal is on top of everything else
        /* The modal is centered on the screen using flexbox */
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-10">
            {/* Modal bg and content settings */}
            <div className={(colorMode == 'light' ? "bg-white text-black" : "bg-gray-900 text-gray-300") + " rounded-lg"}>
                {/* Header */}
                <div className="bg-gray-700 text-white p-4 rounded-t-lg">
                    {title && <h2>{title}</h2>}
                </div>
                {/* Body */}
                <div className="p-4 overflow-auto">{children}</div>
                {/* Footer */}
                <div className="bg-gray-700 text-white p-4 rounded-b-lg flex justify-end space-x-2">
                    {showCloseButton && <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded" onClick={onClose}>Close</button>}
                    {showSaveButton && <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={onSave}>Save Changes</button>}
                </div>
            </div>
        </div>
    );
};

export default Modal;