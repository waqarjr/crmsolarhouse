'use client';
import React from 'react';
import { X, Download, FileText } from 'lucide-react';

const PDFDownloadModal = ({ isOpen, onClose, pdfUrl, fileName = 'solar-quotation.pdf' }) => {
  if (!isOpen) return null;

  // Close modal when clicking outside
  const handleBackgroundClick = (e) => {
    if (e.target.id === "pdf-modal-bg") {
      onClose();
    }
  };

  return (
    <div
      id="pdf-modal-bg"
      onClick={handleBackgroundClick}
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: '1rem', animation: 'fadeIn 0.2s ease-out forwards',
      }} >
      <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)', borderRadius: '1rem', maxWidth: '28rem', width: '100%', overflow: 'hidden',
          transform: 'scale(0.9)', animation: 'scaleIn 0.25s ease-out forwards',
          border: '1px solid #e5e7eb', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        }}>
        {/* Header */}
        <div style={{ backgroundColor: 'rgba(37,99,235,0.9)', padding: '1.5rem', position: 'relative', color: 'white' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer',
            }}>
            <X size={20} color="white" />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={36} color="white" />
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>PDF Ready!</h2>
              <p style={{ fontSize: '0.875rem', color: '#dbeafe' }}>Download your quotation file</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(220,252,231,0.8)', border: '2px solid #bbf7d0', borderRadius: '0.75rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#166534', fontWeight: '500' }}>✓ PDF generated successfully!</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#374151' }}><strong>File Name:</strong> {fileName}</p>
            <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
              Your PDF contains quotation items, warranty details, and production summary.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1.5rem', backgroundColor: 'rgba(243,244,246,0.7)', backdropFilter: 'blur(4px)', display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.75rem', border: '2px solid #d1d5db', borderRadius: '0.5rem', backgroundColor: 'white', color: '#374151', fontWeight: '600', cursor: 'pointer',
            }}>
            Close
          </button>

          <a href={pdfUrl} download={fileName} onClick={() => setTimeout(onClose, 500)} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', cursor: 'pointer',
            }}>
            <Download size={18} />
            Download PDF
          </a>
        </div>
      </div>

      {/* Inline keyframe animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PDFDownloadModal;
