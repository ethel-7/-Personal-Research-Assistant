import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, DriveFile } from '../types';
import {
  DocumentIcon,
  PlusIcon,
  GoogleDriveIcon,
  UploadCloudIcon
} from './icons';
import {
  initGoogleClient,
  handleAuthClick,
  showPicker
} from '../services/googleDriveService';

interface DocumentManagerProps {
  documents: Document[];
  onAddFiles: (files: FileList) => void;
  onAddGoogleDriveFiles: (files: DriveFile[]) => void;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  onAddFiles,
  onAddGoogleDriveFiles
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [error, setError] = useState('');
  const [isGapiReady, setIsGapiReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initGoogleClient(setIsSignedIn)
      .then(() => {
        setIsGapiReady(true);
      })
      .catch((err) => {
        console.error("Could not initialize Google Client:", err.message);
        // Keep the button disabled if initialization fails
        setIsGapiReady(false); 
      });
  }, []);

  const handleAddClick = () => {
    setError('');
    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Please select at least one file to upload.');
      return;
    }
    onAddFiles(selectedFiles);
    setSelectedFiles(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    // FIX: Corrected typo in function name from setIsModalОpen to setIsModalOpen
    setIsModalOpen(false);
  };

  const handleGoogleDriveClick = () => {
    if (!isSignedIn) {
      handleAuthClick(setIsSignedIn);
    } else {
      showPicker(onAddGoogleDriveFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
      setError('');
    }
  };

  return (
    <div className="flex flex-col h-full text-gray-100">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        My Documents
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-semibold text-white
          bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600
          transition-all duration-300 shadow-lg shadow-cyan-800/30"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Upload Documents
        </button>

        <button
          onClick={handleGoogleDriveClick}
          disabled={!isGapiReady}
          className="flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-semibold
          bg-gray-800 hover:bg-gray-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white
          transition-all duration-300 border border-gray-700 shadow-md"
        >
          <GoogleDriveIcon className="w-5 h-5 mr-2 text-green-400" />
          {isGapiReady ? (isSignedIn ? 'Select from Drive' : 'Connect Google Drive') : 'Loading Drive...'}
        </button>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {documents.length === 0 ? (
          <p className="text-gray-400 italic text-center mt-6">
            No documents uploaded yet.
          </p>
        ) : (
          documents.map((doc) => (
            <motion.div
              key={doc.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex items-center p-3 rounded-lg bg-gray-800/60 backdrop-blur-md border border-gray-700 hover:border-cyan-500/50 group"
            >
              <DocumentIcon className="w-6 h-6 mr-3 text-cyan-400 group-hover:text-cyan-300 transition" />
              <span className="truncate flex-1 text-gray-200">{doc.name}</span>
            </motion.div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900/90 border border-gray-700 rounded-2xl p-8 w-full max-w-lg shadow-2xl backdrop-blur-md"
            >
              <h3 className="text-xl font-bold mb-4 text-white">
                Upload Documents
              </h3>
              {error && (
                <p className="text-red-400 text-sm mb-3 bg-red-900/30 p-2 rounded">
                  {error}
                </p>
              )}

              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800/60 hover:bg-gray-700/60 transition-all"
              >
                <UploadCloudIcon className="w-10 h-10 mb-3 text-gray-400" />
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, TXT, or MD files
                </p>
                <input
                  id="file-upload"
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileSelect}
                  accept=".pdf,.txt,.md"
                />
              </label>

              {selectedFiles && selectedFiles.length > 0 && (
                <div className="mt-4 text-sm text-gray-300">
                  <p>Selected files:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-0.5">
                    {Array.from(selectedFiles).map((file) => (
                      <li key={file.name}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddClick}
                  disabled={!selectedFiles?.length}
                  className="px-6 py-2.5 rounded-lg font-semibold text-white
                  bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600
                  disabled:opacity-50 transition-all"
                >
                  Add Documents
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};