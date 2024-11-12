import React, { useState, useCallback } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useSopStore } from '../store/sopStore';
import { PencilIcon, Save, X } from 'lucide-react';

export function ProcessNode({ data, id }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(data.label);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(data.notes || '');
  const { updateNodeData } = useSopStore();

  const handleSave = useCallback(() => {
    updateNodeData(id, { label: editedLabel, notes });
    setIsEditing(false);
  }, [id, editedLabel, notes, updateNodeData]);

  const handleCancel = useCallback(() => {
    setEditedLabel(data.label);
    setNotes(data.notes || '');
    setIsEditing(false);
  }, [data.label, data.notes]);

  return (
    <div className="relative group">
      <div className="px-4 py-3 shadow-lg rounded-lg bg-white border-2 border-maple-blue-light max-w-[250px] transition-shadow hover:shadow-xl">
        <Handle 
          type="target" 
          position={Position.Left}
          className="w-2 h-2 !bg-maple-orange" 
        />
        
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedLabel}
              onChange={(e) => setEditedLabel(e.target.value)}
              className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-maple-blue"
              rows={2}
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-maple-blue"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                className="p-1 text-maple-orange hover:text-maple-orange-dark"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-sm font-medium text-gray-700">
              {data.label}
            </div>
            {data.notes && (
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="mt-2 text-xs text-maple-orange hover:text-maple-orange-dark"
              >
                {showNotes ? 'Hide notes' : 'Show notes'}
              </button>
            )}
            {showNotes && data.notes && (
              <div className="mt-2 text-xs text-gray-500 border-t pt-2">
                {data.notes}
              </div>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-maple-orange"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <Handle 
          type="source" 
          position={Position.Right}
          className="w-2 h-2 !bg-maple-orange" 
        />
      </div>
    </div>
  );
}