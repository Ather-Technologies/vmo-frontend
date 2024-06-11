import { ReactNode } from "react"; // Reqired type for declaring children prop

// Represents a clip date with its associated properties
export interface ClipDate {
    id: number; // The DB side id for that row
    agency: string; // The agency of the clip group i.e. "Sanders County Sheriff's Office"
    date: string; // Returns ISO format date YYYY-MM-DD
    clipCount: number; // Number of clips in the group
    outageStatus: string; // If set this means there was an outage detected on the date    
}

// Represents a clip with its associated properties
export interface Clip {
    id: number; // Unique identifier for the clip
    source: string; // The source of the clip, e.g., "Sanders County Sheriff's Office"
    date: string; // The date of the clip in ISO format (YYYY-MM-DD)
    time: string; // The time the clip was uploaded
}

// Represents the properties for the loading screen
export interface LoadingScreenProps {
    loadingText: string; // The text to display while loading
}

// Props for the DatesNavigation component 
export interface ClipDateStateDataProp {
    clip_id: number;
    date_id: number;
    setClipID: React.Dispatch<React.SetStateAction<number>>;
    setDateID: React.Dispatch<React.SetStateAction<number>>;
}

// Represents the properties for the pagination component
export interface PaginationProps {
    setCurrentItems: React.Dispatch<React.SetStateAction<any[]>>; // Function to set the current items
    items: any[]; // The items to paginate
    tableRowRef: React.RefObject<HTMLTableRowElement>; // Reference to the table row element
    paginationTag?: string | null;
}

// Represents the properties for the modal component
export interface ModalProps {
    title?: string; // The title of the modal
    colorMode?: string; // The color mode of the modal (e.g., 'light' or 'dark')
    showCloseButton?: boolean; // Whether to show the close button
    showSaveButton?: boolean; // Whether to show the save button
    onClose?: () => void; // Function to call when the modal is closed
    onSave?: () => void; // Function to call when the save button is clicked
    children: ReactNode; // The child elements to render inside the modal
};