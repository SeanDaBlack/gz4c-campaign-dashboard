export interface FileUploadProps {
  onFileUpload: (file: File | null) => void;
  uploadedFile: File | null;
  handleClick: () => void;
}
export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, uploadedFile }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileUpload(file); // Pass file to parent
  };

  return (
    <div>

      {!uploadedFile ? <p></p> :
        <input type="file" onChange={handleFileChange} />}
    </div>
  );
};
