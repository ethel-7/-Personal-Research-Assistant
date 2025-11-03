export interface Document {
  id: string;
  name: string;
}

export interface DocumentChunk {
  id: string;
  source: string;
  content: string;
}

export type MessageRole = 'user' | 'model';

export interface Message {
  role: MessageRole;
  content: string;
}

export interface DriveFile {
    id: string;
    name: string;
}
