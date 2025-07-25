// components/LightboxViewer.js
import React from 'react';
import './LightboxViewer.css';

const LightboxViewer = ({ fileList, lightboxIndex, setLightboxIndex }) => {
  if (lightboxIndex === null) return null;

  return (
    <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
      <div className="lightbox-main" onClick={(e) => e.stopPropagation()}>
        <button
          className="lightbox-btn left"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxIndex((prev) => (prev > 0 ? prev - 1 : fileList.length - 1));
          }}
        >
          ◀
        </button>

        <div
          className="lightbox-image"
          style={{
            backgroundImage: `url(http://localhost:9093/diary/storage/${fileList[lightboxIndex]})`
          }}
        />

        <button
          className="lightbox-btn right"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxIndex((prev) => (prev < fileList.length - 1 ? prev + 1 : 0));
          }}
        >
          ▶
        </button>
      </div>

      <div className="lightbox-thumbnails" onClick={(e) => e.stopPropagation()}>
        {fileList.map((filename, idx) => (
          <img
            key={idx}
            src={`http://localhost:9093/diary/storage/${filename}`}
            alt={`썸네일 ${idx + 1}`}
            onClick={() => setLightboxIndex(idx)}
            className={`lightbox-thumb ${idx === lightboxIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>
        ✕
      </button>
    </div>
  );
};

export default LightboxViewer;