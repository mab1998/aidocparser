import React, { useState } from 'react';

function ImageUploader({ onImageUpload }) {
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (imageFile) {
      onImageUpload(imageFile);
    }
  };

  return (
    <div>
      <input type='file' onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!imageFile}>
        Upload Image
      </button>
    </div>
  );
}

export default ImageUploader;