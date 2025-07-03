interface FileUploadProps {
  onFileUpload: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileUpload(file); // Pass file to parent
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};
