import React, { useState } from 'react';

function LabelEditor({ labels, onChange }) {
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleLabelChange = (index, value, field) => {
    const updatedLabels = [...labels];
    updatedLabels[index][field] = value;
    onChange(updatedLabels);
  };

  const handleAddLabel = () => {
    onChange([...labels, { label: newLabel, value: newValue }]);
    setNewLabel('');
    setNewValue('');
  };

  const handleDeleteLabel = (index) => {
    const updatedLabels = labels.filter((_, i) => i !== index);
    onChange(updatedLabels);
  };

  return (
    <div>
      {labels.map((labelObj, index) => (
        <div key={index}>
          <input
            type='text'
            value={labelObj.label}
            onChange={(e) => handleLabelChange(index, e.target.value, 'label')}
            placeholder='Label'
          />
          <input
            type='text'
            value={labelObj.value}
            onChange={(e) => handleLabelChange(index, e.target.value, 'value')}
            placeholder='Value'
          />
          <button onClick={() => handleDeleteLabel(index)}>Delete</button>
        </div>
      ))}
      <div>
        <input
          type='text'
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder='New Label'
        />
        <input
          type='text'
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder='New Value'
        />
        <button onClick={handleAddLabel}>Add Label</button>
      </div>
    </div>
  );
}

export default LabelEditor;