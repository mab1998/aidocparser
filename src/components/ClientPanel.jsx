import React from 'react';
import './ClientPanel.css';

function ClientPanel() {
  const mockStats = {
    documentsProcessed: 125,
    pendingDocuments: 3,
    lastLogin: '2025-06-16',
  };

  const mockDocs = [
    {
      id: 1,
      name: 'Invoice 001',
      status: 'Processed',
      date: '2025-06-15',
    },
    {
      id: 2,
      name: 'Invoice 002',
      status: 'Pending',
      date: '2025-06-16',
    },
    {
      id: 3,
      name: 'Invoice 003',
      status: 'Failed',
      date: '2025-06-16',
    },
  ];

  return (
    <div className="client-dashboard">
      <h1>Client Dashboard</h1>
      <div className="stats">
        <div className="stat">
          <span className="stat-value">{mockStats.documentsProcessed}</span>
          <span className="stat-label">Documents Processed</span>
        </div>
        <div className="stat">
          <span className="stat-value">{mockStats.pendingDocuments}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat">
          <span className="stat-value">{mockStats.lastLogin}</span>
          <span className="stat-label">Last Login</span>
        </div>
      </div>
      <h2>Recent Documents</h2>
      <table className="documents-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {mockDocs.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.name}</td>
              <td>{doc.status}</td>
              <td>{doc.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientPanel;
