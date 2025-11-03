import React, { useState, useCallback } from 'react';
import { DocumentManager } from './components/DocumentManager';
import { ChatInterface } from './components/ChatInterface';
import { Header } from './components/Header';
import { getAnswerFromGemini } from './services/geminiService';
import { Document, Message, DocumentChunk, DriveFile } from './types';
import { readFileContent, parseGoogleDriveFile } from './utils/fileParser';
import { downloadDriveFile } from './services/googleDriveService';


const App: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentChunks, setDocumentChunks] = useState<DocumentChunk[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Hello! I am your personal research assistant. Please upload some documents to get started.',
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Thinking...');
  const [error, setError] = useState<string | null>(null);

  const processAndAddDocumentContent = useCallback((name: string, content: string) => {
    const newDoc: Document = { id: `${name}-${Date.now()}`, name };
    setDocuments(prevDocs => {
      // Avoid adding duplicate documents
      if (prevDocs.some(doc => doc.name === name)) {
        setMessages(prev => [...prev, { role: 'model', content: `Document "${name}" has already been added.` }]);
        return prevDocs;
      }
      return [...prevDocs, newDoc];
    });

    const chunks = content.split(/\n\s*\n/).filter(chunk => chunk.trim() !== '');
    const newChunks: DocumentChunk[] = chunks.map((chunk, index) => ({
      source: name,
      content: chunk,
      id: `${newDoc.id}-${index}`
    }));
    setDocumentChunks(prevChunks => [...prevChunks, ...newChunks]);

    setMessages(prev => [...prev, { role: 'model', content: `Successfully processed and chunked "${name}". Ready for questions.` }]);
  }, []);

  const handleAddFiles = useCallback(async (files: FileList) => {
    setLoadingMessage('Processing documents...');
    setIsLoading(true);
    setError(null);
    for (const file of Array.from(files)) {
      try {
        const { name, content } = await readFileContent(file);
        processAndAddDocumentContent(name, content);
      } catch (err: any) {
        setError(`Failed to process ${file.name}: ${err.message}`);
      }
    }
    setIsLoading(false);
  }, [processAndAddDocumentContent]);
  
  const handleAddGoogleDriveFiles = useCallback(async (driveFiles: DriveFile[]) => {
    setLoadingMessage('Downloading from Google Drive...');
    setIsLoading(true);
    setError(null);
    for (const driveFile of driveFiles) {
        try {
            const fileData = await downloadDriveFile(driveFile.id);
            const { name, content } = await parseGoogleDriveFile(fileData);
            processAndAddDocumentContent(name, content);
        } catch(err: any) {
            setError(`Failed to process ${driveFile.name} from Google Drive: ${err.message}`);
        }
    }
    setIsLoading(false);
  }, [processAndAddDocumentContent]);


  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    setError(null);
    setLoadingMessage('Thinking...');
    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);

    try {
      if (documentChunks.length === 0) {
        throw new Error("Please upload a document before asking questions.");
      }

      // Simple RAG retrieval: keyword matching
      const userKeywords = userInput.toLowerCase().split(/\s+/).filter(kw => kw.length > 2);
      const relevantChunks = documentChunks
        .map(chunk => {
          const contentLower = chunk.content.toLowerCase();
          const score = userKeywords.reduce((acc, kw) => acc + (contentLower.includes(kw) ? 1 : 0), 0);
          return { ...chunk, score };
        })
        .filter(chunk => chunk.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Take top 5 relevant chunks

      if (relevantChunks.length === 0) {
        setMessages(prev => [...prev, { role: 'model', content: "I couldn't find any relevant information in your documents to answer that question. Please try rephrasing or asking something else." }]);
        setIsLoading(false);
        return;
      }
      
      const context = relevantChunks.map(chunk => `Source: ${chunk.source}\nContent: ${chunk.content}`).join('\n\n---\n\n');
      
      const answer = await getAnswerFromGemini(userInput, context);
      
      const modelMessage: Message = { role: 'model', content: answer };
      setMessages(prev => [...prev, modelMessage]);

    } catch (err: any) {
      const errorMessage = `Error: ${err.message || 'An unexpected error occurred.'}`;
      setError(errorMessage);
      setMessages(prev => [...prev, { role: 'model', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  }, [documentChunks]);

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-1/3 md:w-1/4 h-full bg-gray-800 p-4 overflow-y-auto border-r border-gray-700">
          <DocumentManager 
            documents={documents} 
            onAddFiles={handleAddFiles} 
            onAddGoogleDriveFiles={handleAddGoogleDriveFiles}
          />
        </aside>
        <main className="flex-1 flex flex-col h-full bg-gray-900">
          <ChatInterface messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} loadingMessage={loadingMessage} />
          {error && <div className="p-4 bg-red-800 text-white text-center">{error}</div>}
        </main>
      </div>
    </div>
  );
};

export default App;