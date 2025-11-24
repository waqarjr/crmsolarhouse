'use client';
import React from 'react';
import { X, Download, FileText } from 'lucide-react';

const PDFDownloadModal = ({ isOpen, onClose, pdfUrl, fileName = 'solar-quotation.pdf' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <FileText size={32} />
            <div>
              <h2 className="text-2xl font-bold">PDF Generated!</h2>
              <p className="text-blue-100 text-sm">Your quotation is ready to download</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              ✓ Your solar quotation PDF has been generated successfully!
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-gray-600 text-sm">
              <strong>File Name:</strong> {fileName}
            </p>
            <p className="text-gray-600 text-sm">
              The PDF includes all quotation items, warranty details, and production information.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Close
          </button>
          <a
            href={pdfUrl}
            download={fileName}
            onClick={() => {
              setTimeout(onClose, 500);
            }}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
};

export default PDFDownloadModal;
