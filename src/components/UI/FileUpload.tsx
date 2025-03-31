import React, { useRef } from 'react';
import { Plus } from 'lucide-react';

interface FileUploadProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null; // Parent passes the selected file (object or null)
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onChange,
  selectedFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file input programmatically
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 space-y-2">
      <label className="label">{label}</label>

      <div
        className="border-[1.5px] border-dashed border-gray-300 p-6 text-center rounded-xl hover:bg-gray-50 cursor-pointer"
        onClick={triggerFileInput}
      >
        {/* Display selected image or placeholder */}
        {selectedFile ? (
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Selected"
            className="w-32 h-32 mx-auto object-cover"
          />
        ) : (
          <div className="flex justify-center items-center">
            <Plus className="w-10 h-10 text-gray-500 mb-2" strokeWidth={1} />
          </div>
        )}

        {/* Text to prompt user to select a file */}
        <span className="text-sm text-gray-500">
          {selectedFile ? 'Change Image' : 'Click to upload'}
        </span>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={onChange}
        accept=".jpg,.jpeg,.png,.webp"
      />
    </div>
  );
};

export default FileUpload;
