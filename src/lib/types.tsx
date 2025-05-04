import { ReactNode } from "react"; // Reqired type for declaring children prop

// Represents a clip date with its associated properties
export interface ClipDate {
    id: number; // The DB side id for that row
    date: string; // ISO format date YYYY-MM-DD
    source_id: number; // The source_id of the clip
}

export interface FullClipDate {
    id: number; // The DB side id for that row
    date: string; // ISO format date YYYY-MM-DD
    source: ClipSource; // The source object
}

// Represents a clip with its associated properties
export interface Clip {
    id: number; // Unique identifier for the clip
    time: string; // The time the clip was uploaded
    date_id: number; // The date_id of a row with the date of the clip in ISO format (YYYY-MM-DD)
    tone_processed?: boolean; // Whether the clip has been processed for tones
    tones_id?: number; // The ID of the tone assigned to this clip
}

export interface ClipSource {
    id: number // Unique identifier for the source
    name: string // The name of the source
    shorthand: string // Abbreviation of the source name
    timezone: string // The IANA timezone of the source (e.g., 'America/New_York')
}

export interface Tone {
    id: number;             // Unique identifier for the tone
    name: string;           // Name of the tone (e.g., "ambulance", "fire rescue")
    color: string;          // Hex color code (without # prefix)
    frequencies: string[];  // Array of frequency values
    source_id: number;      // The source this tone belongs to
}

// Represents the properties for the loading screen
export interface LoadingScreenProps {
    loadingText: string; // The text to display while loading
}

// Props for passing clip and date state data to child components 
export interface ClipDateStateDataProp {
    clip_id: number;
    date_id: number;
    selectedDateFullData: FullClipDate;
    setSelectedDateFullData: React.Dispatch<React.SetStateAction<FullClipDate>>;
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