import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 5 MB!"); // Show error toast
        setSelectedFile(null); // Reset the file
      } else {
        setSelectedFile(file); // Set the selected file
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("No file selected!"); // Show error toast if no file is selected
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3001/files/upload", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      toast.success("File uploaded successfully!"); // Show success toast
      console.log(result);
    } catch (error) {
      toast.error("Error uploading file: " + error.message); // Show error toast
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer /> {/* Add the ToastContainer here */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Upload Your Photo
        </h2>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select a photo to upload:
          </label>
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={handleFileChange}
            id="file-upload"
            className="block w-full text-sm text-gray-500 
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-500 file:text-white
            hover:file:bg-blue-600"
          />
          <button
            type="submit"
            className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md 
            hover:bg-blue-600 transition-colors duration-200"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadFile;
