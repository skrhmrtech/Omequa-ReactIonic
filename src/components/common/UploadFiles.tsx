import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import LuUpload from "../../assets/chat/Upload.png";

interface UploadFilesProps {
    allowedTypes?: string[];
    maxSize?: number;
    disabled?: boolean;
    onFileUpload: (base64String: string | null) => void;
}

const defaultType = [
    "image/png",         // PNG
    "image/jpeg",        // JPG / JPEG
    "image/jpg",         // JPG (alternative)
    "image/gif",         // GIF
    "image/bmp",         // BMP
    "image/webp",        // WebP
    "image/svg+xml",     // SVG
    "image/tiff",        // TIFF
    "image/x-icon",      // ICO (Icons)
    "image/heif",        // HEIF (High Efficiency Image Format)
    "image/heic"         // HEIC (Apple's High Efficiency Image Coding)
]

const UploadFiles: React.FC<UploadFilesProps> = ({ allowedTypes = defaultType, maxSize, disabled, onFileUpload }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            if (!allowedTypes.includes(file.type)) {
                toast.error("Invalid file type.", { duration: 3000, style: { fontWeight: 'bold' } });
                return;
            }

            if (maxSize && file.size > maxSize * 1024) {
                toast.error(`File size exceeds ${maxSize}KB.`, { duration: 3000, style: { fontWeight: 'bold' } });
                return;
            }

            // Convert file to Base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => onFileUpload(reader.result as string);
            reader.onerror = () => onFileUpload(null);
        }
    };

    return (
        <React.Fragment>
            {/* Hidden file input */}
            <input
                type="file"
                disabled={disabled}
                ref={fileInputRef}
                accept={allowedTypes.join(", ")}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            {/* Upload Button */}
            <span
                className={`w-full text-[#0f5999] text-sm bg-[#edf6ff] px-2 py-2.5 rounded-xl flex gap-3 justify-center items-center text-center select-none ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => fileInputRef.current?.click()}
            >
                <img src={LuUpload} alt="" className='w-6' />
                <span>Upload Photo</span>
            </span>
        </React.Fragment>
    );
};

export default UploadFiles;
