import { type ProcessedStep } from '../types';

export function generateNodesFromSteps(steps: ProcessedStep[]) {
  const nodes = steps.map((step, index) => ({
    id: step.id,
    type: 'process',
    position: { x: index * 300, y: 0 }, // All nodes on same y-axis for left-to-right flow
    data: { 
      label: step.content,
      notes: step.notes 
    },
  }));

  const edges = steps.slice(1).map((step, index) => ({
    id: `e${index}`,
    source: steps[index].id,
    target: step.id,
    type: 'smoothstep',
  }));

  return { nodes, edges };
}