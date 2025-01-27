import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageUploader from '../ImageUploader';
import LabelEditor from '../LabelEditor';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function TemplateCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [labels, setLabels] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      if (id) {
        const docRef = doc(db, 'templates', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTemplateName(data.name || '');
          setLabels(data.labels || []);
          if (data.imageUrl) {
            setImage(data.imageUrl);
          }
        }
      }
    };

    fetchTemplate();
  }, [id]);

  const handleImageUpload = async (file) => {
    setUploading(true);

    // Upload to Firebase as before
    const storage = getStorage();
    const storageRef = ref(storage, `templates/${id}/${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setImage(downloadURL);
      console.log('Image uploaded successfully. URL:', downloadURL);

      // Now send the image to the backend for Gemini processing
      await processImageWithBackend(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const processImageWithBackend = async (file) => {
    setGenerating(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:3001/api/process-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Gemini processing successful. Response:', result);

      setLabels((prevLabels) => [...prevLabels, ...result.labels]);
    } catch (error) {
      console.error('Error processing image with backend:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleLabelChange = (newLabels) => {
    setLabels(newLabels);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const templateData = {
      name: templateName,
      labels,
      imageUrl: image,
    };

    if (id) {
      const docRef = doc(db, 'templates', id);
      await updateDoc(docRef, templateData);
      navigate(`/templates/${id}`);
    } else {
      const newDocRef = doc(collection(db, 'templates'));
      await setDoc(newDocRef, templateData);
      navigate(`/templates/${newDocRef.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='templateName'>Template Name:</label>
        <input
          type='text'
          id='templateName'
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <LabelEditor labels={labels} onChange={handleLabelChange} />
        </div>
        <div style={{ flex: 1 }}>
          {!image && !uploading && !generating && (
            <ImageUploader onImageUpload={handleImageUpload} />
          )}
          {uploading && <p>Uploading image...</p>}
          {generating && <p>Processing image with Gemini...</p>}
          {/* Add a success message when both uploading and generating are done */}
          {!uploading && !generating && image && (
            <p>Image uploaded and processed successfully!</p>
          )}
        </div>
      </div>
      <button type='submit' disabled={uploading || generating}>
        {id ? 'Update' : 'Create'} Template
      </button>
    </form>
  );
}

export default TemplateCreate;