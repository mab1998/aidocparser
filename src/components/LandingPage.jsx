import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>AI DocParser</h1>
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
        </nav>
      </header>
      <section className="hero">
        <h2>Parse Documents with AI</h2>
        <p>Automate your document workflow with our modern parser.</p>
        <Link className="cta" to="/register">Get Started</Link>
      </section>
    </div>
  );
}

export default LandingPage;
