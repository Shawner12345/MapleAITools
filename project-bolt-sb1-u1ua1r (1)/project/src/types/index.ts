export interface ProcessedStep {
  id: string;
  number: number;
  content: string;
  keywords: string[];
  notes?: string;
}

export interface Node {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: { 
    label: string;
    notes?: string;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
}

export interface SavedProcess {
  id: string;
  title: string;
  createdAt: string;
  steps: ProcessedStep[];
  nodes: Node[];
  edges: Edge[];
}

export interface SopData {
  steps: ProcessedStep[];
  nodes: Node[];
  edges: Edge[];
}

export interface FAQ {
  question: string;
  answer: string;
}