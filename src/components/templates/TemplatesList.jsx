import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../../firebase';

function TemplatesList() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'templates'), (snapshot) => {
      const templatesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTemplates(templatesData);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'templates', id));
  };

  return (
    <div>
      <h1>Templates</h1>
      <Link to='/templates/create'>
        <button>New Template</button>
      </Link>
      <ul>
        {templates.map((template) => (
          <li key={template.id}>
            <Link to={`/templates/${template.id}`}>
              {template.name || 'Unnamed Template'}
            </Link>{' '}
            -
            <Link to={`/templates/edit/${template.id}`}>
              <button>Edit</button>
            </Link>
            <button onClick={() => handleDelete(template.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TemplatesList;