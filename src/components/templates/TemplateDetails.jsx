import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

function TemplateDetails() {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      const docRef = doc(db, 'templates', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTemplate(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchTemplate();
  }, [id]);

  if (!template) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{template.name}</h1>
      <img src={template.imageUrl} alt={template.name} />
      <h2>Labels:</h2>
      <ul>
        {template.labels.map((label, index) => (
          <li key={index}>
            {label.label}: {label.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TemplateDetails;