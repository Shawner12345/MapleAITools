import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useSopStore } from '../store/sopStore';
import { ProcessNode } from './ProcessNode';

const nodeTypes = {
  process: ProcessNode,
};

function MindMapContent() {
  const { sopData, reorderSteps } = useSopStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(sopData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(sopData.edges);

  // Update node positions whenever steps order changes
  useEffect(() => {
    const updatedNodes = sopData.steps.map((step, index) => ({
      ...sopData.nodes.find(n => n.id === step.id)!,
      position: { x: index * 300, y: 0 }
    }));
    setNodes(updatedNodes);
  }, [sopData.steps, setNodes]);

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const onNodeDragStop = useCallback((event: any, node: any, nodes: any[]) => {
    const overlappingNode = nodes.find(n => 
      n.id !== node.id && 
      Math.abs(n.position.y - node.position.y) < 100 &&
      Math.abs(n.position.x - node.position.x) < 150
    );

    if (overlappingNode) {
      reorderSteps(node.id, overlappingNode.id);
    }
  }, [reorderSteps]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      nodeTypes={nodeTypes}
      fitView
      className="bg-gray-50"
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}

export function MindMap() {
  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <MindMapContent />
      </ReactFlowProvider>
    </div>
  );
}