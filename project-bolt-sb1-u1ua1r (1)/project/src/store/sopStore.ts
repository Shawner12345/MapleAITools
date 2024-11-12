import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type ProcessedStep, type Node, type Edge, type SopData, type SavedProcess } from '../types';

interface SopStore {
  sopData: SopData;
  savedProcesses: SavedProcess[];
  setSteps: (steps: ProcessedStep[]) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeData: (id: string, data: { label: string; notes?: string }) => void;
  updateStep: (id: string, content: string, notes?: string) => void;
  reorderSteps: (sourceId: string, targetId: string) => void;
  saveCurrentProcess: (title: string) => void;
  deleteProcess: (id: string) => void;
  loadProcess: (id: string) => void;
  addStep: (step: { content: string; notes?: string }) => void;
}

export const useSopStore = create<SopStore>()(
  persist(
    (set, get) => ({
      sopData: {
        steps: [],
        nodes: [],
        edges: []
      },
      savedProcesses: [],
      setSteps: (steps) => set((state) => {
        const nodes = steps.map((step, index) => ({
          ...state.sopData.nodes.find(n => n.id === step.id) || {
            id: step.id,
            type: 'process',
            data: { label: step.content, notes: step.notes }
          },
          position: { x: index * 300, y: 0 }
        }));

        const edges = steps.slice(1).map((step, index) => ({
          id: `e${index}`,
          source: steps[index].id,
          target: step.id,
          type: 'smoothstep',
        }));

        return { 
          sopData: { 
            ...state.sopData, 
            steps,
            nodes,
            edges
          } 
        };
      }),
      setNodes: (nodes) => set((state) => ({ 
        sopData: { ...state.sopData, nodes } 
      })),
      setEdges: (edges) => set((state) => ({ 
        sopData: { ...state.sopData, edges } 
      })),
      updateNodeData: (id, data) => set((state) => ({
        sopData: {
          ...state.sopData,
          nodes: state.sopData.nodes.map(node =>
            node.id === id ? { ...node, data: { ...node.data, ...data } } : node
          ),
          steps: state.sopData.steps.map(step =>
            step.id === id ? { ...step, content: data.label, notes: data.notes } : step
          )
        }
      })),
      updateStep: (id, content, notes) => set((state) => ({
        sopData: {
          ...state.sopData,
          steps: state.sopData.steps.map(step =>
            step.id === id ? { ...step, content, notes } : step
          ),
          nodes: state.sopData.nodes.map(node =>
            node.id === id ? { ...node, data: { ...node.data, label: content, notes } } : node
          )
        }
      })),
      reorderSteps: (sourceId, targetId) => set((state) => {
        const steps = [...state.sopData.steps];
        const sourceIndex = steps.findIndex(step => step.id === sourceId);
        const targetIndex = steps.findIndex(step => step.id === targetId);
        
        if (sourceIndex === -1 || targetIndex === -1) return state;

        [steps[sourceIndex], steps[targetIndex]] = [steps[targetIndex], steps[sourceIndex]];
        
        steps.forEach((step, index) => {
          step.number = index + 1;
        });

        const nodes = steps.map((step, index) => ({
          ...state.sopData.nodes.find(n => n.id === step.id)!,
          position: { x: index * 300, y: 0 }
        }));

        const edges = steps.slice(1).map((step, index) => ({
          id: `e${index}`,
          source: steps[index].id,
          target: step.id,
          type: 'smoothstep',
        }));

        return {
          sopData: {
            ...state.sopData,
            steps,
            nodes,
            edges
          }
        };
      }),
      addStep: (step) => set((state) => {
        const newStep: ProcessedStep = {
          id: `step-${Date.now()}`,
          number: state.sopData.steps.length + 1,
          content: step.content,
          notes: step.notes,
          keywords: []
        };

        const steps = [...state.sopData.steps, newStep];
        const nodes = steps.map((step, index) => ({
          id: step.id,
          type: 'process',
          position: { x: index * 300, y: 0 },
          data: { label: step.content, notes: step.notes }
        }));

        const edges = steps.slice(1).map((step, index) => ({
          id: `e${index}`,
          source: steps[index].id,
          target: step.id,
          type: 'smoothstep',
        }));

        return {
          sopData: {
            ...state.sopData,
            steps,
            nodes,
            edges
          }
        };
      }),
      saveCurrentProcess: (title) => set((state) => {
        if (state.sopData.steps.length === 0) return state;

        const newProcess: SavedProcess = {
          id: crypto.randomUUID(),
          title,
          createdAt: new Date().toISOString(),
          steps: [...state.sopData.steps],
          nodes: [...state.sopData.nodes],
          edges: [...state.sopData.edges]
        };

        return {
          savedProcesses: [...state.savedProcesses, newProcess]
        };
      }),
      deleteProcess: (id) => set((state) => ({
        savedProcesses: state.savedProcesses.filter(process => process.id !== id)
      })),
      loadProcess: (id) => set((state) => {
        const process = state.savedProcesses.find(p => p.id === id);
        if (!process) return state;

        return {
          sopData: {
            steps: [...process.steps],
            nodes: [...process.nodes],
            edges: [...process.edges]
          }
        };
      })
    }),
    {
      name: 'sop-storage'
    }
  )
);