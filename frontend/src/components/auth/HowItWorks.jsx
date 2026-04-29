import React from "react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <>
      <div className="hiw-page">
        <div className="hiw-container">
          <Link to="/login-success" className="hiw-back-link">
            Back to Dashboard
          </Link>
          <h1>The Intelligence Behind the Art</h1>
          <p className="hiw-intro">
            Our pipeline uses a multi-modal AI approach to turn vocal vibrations into
            visual masterpieces.
          </p>

          <div className="hiw-step">
            <h3>1. Signal Acquisition</h3>
            <p>
              Your voice is captured and converted into a WAV format. We analyze
              frequency, pitch, and tempo - the prosody of your speech - to detect
              emotional markers beyond just the words spoken.
            </p>
          </div>

          <div className="hiw-step">
            <h3>2. Emotional Inference</h3>
            <p>
              Using a fine-tuned transformer model, the system categorizes audio into
              primary emotions and assigns a confidence score to each.
            </p>
          </div>

          <div className="hiw-step">
            <h3>3. Latent Diffusion Generation</h3>
            <p>
              The detected emotion and transcription are fed into an image generation
              engine. It applies your chosen art style as a global prompt modifier to
              create the final visual output.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .hiw-page {
          font-family: Inter, Arial, sans-serif;
          background: #0f111a;
          color: #e0e0e0;
          min-height: 100vh;
          padding: 50px 24px;
          line-height: 1.6;
        }

        .hiw-container {
          max-width: 860px;
          margin: 0 auto;
        }

        .hiw-back-link {
          color: #7c4dff;
          text-decoration: none;
          font-size: 0.95rem;
          margin-bottom: 20px;
          display: inline-block;
          font-weight: 600;
        }

        .hiw-container h1 {
          font-family: Poppins, Arial, sans-serif;
          font-size: 2.5rem;
          margin-bottom: 26px;
          background: linear-gradient(to right, #00e5ff, #7c4dff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hiw-intro {
          margin-bottom: 20px;
          color: #b4b9c8;
        }

        .hiw-step {
          background: rgba(255, 255, 255, 0.05);
          padding: 25px;
          border-radius: 15px;
          margin-bottom: 20px;
          border-left: 4px solid #7c4dff;
        }

        .hiw-step h3 {
          margin-top: 0;
          color: #fff;
        }
      `}</style>
    </>
  );
}
