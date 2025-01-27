import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageUploader from '../ImageUploader';
import LabelEditor from '../LabelEditor';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

const MODEL_NAME = 'gemini-pro-vision';

function TemplateCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [labels, setLabels] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

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
    setUploading(true); // Start uploading
    const storage = getStorage();
    const storageRef = ref(storage, `templates/${id}/${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setImage(downloadURL);

      console.log('Image uploaded successfully. URL:', downloadURL); // Log successful upload

      // Process the image with Gemini
      await processImageWithGemini(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false); // End uploading (whether successful or not)
    }
  };

  const processImageWithGemini = async (file) => {
    setGenerating(true); // Start Gemini processing
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 4096,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const parts = [
      {
        text: 'Parse text from this image and return it as a list of label-value pairs. Each line should contain a label followed by a colon and the value. For example:\n\nLabel1: Value1\nLabel2: Value2\nLabel3: Value3\n\nDo not provide any conversational responses or additional information, only the label-value pairs.',
      },
      {
        fileData: {
          mimeType: file.type,
          data: Buffer.from(await file.arrayBuffer()).toString('base64'),
        },
      },
    ];

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig,
        safetySettings,
      });

      const response = result.response;
      const generatedText = response.text();
      console.log('Gemini processing successful. Response:', generatedText); // Log Gemini response

      const parsedLabels = parseGeminiResponse(generatedText);
      console.log('Parsed labels:', parsedLabels); // Log the parsed labels

      setLabels((prevLabels) => [...prevLabels, ...parsedLabels]);
    } catch (error) {
      console.error('Error processing image with Gemini:', error);
    } finally {
      setGenerating(false); // End Gemini processing
    }
  };

  const parseGeminiResponse = (text) => {
    const lines = text.split('\n');
    const parsedLabels = [];

    for (const line of lines) {
      // Look for the first colon to split the label and value
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const label = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        if (label && value) {
          parsedLabels.push({ label, value });
        }
      }
    }

    return parsedLabels;
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

export default TemplateCreate; // Add this line if it's missing
