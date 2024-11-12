import React, { useState } from 'react';
import { type ProcessedStep } from '../types';
import { CheckCircle, PencilIcon, Save, X, GripVertical, Plus } from 'lucide-react';
import { useSopStore } from '../store/sopStore';

interface StepsListProps {
  steps: ProcessedStep[];
}

export function StepsList({ steps }: StepsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedNotes, setEditedNotes] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStepContent, setNewStepContent] = useState('');
  const [newStepNotes, setNewStepNotes] = useState('');
  const { updateStep, reorderSteps, addStep } = useSopStore();

  const handleEdit = (step: ProcessedStep) => {
    setEditingId(step.id);
    setEditedContent(step.content);
    setEditedNotes(step.notes || '');
  };

  const handleSave = () => {
    if (editingId) {
      updateStep(editingId, editedContent, editedNotes);
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleAddStep = () => {
    if (!newStepContent.trim()) return;
    
    addStep({
      content: newStepContent.trim(),
      notes: newStepNotes.trim() || undefined
    });
    
    setNewStepContent('');
    setNewStepNotes('');
    setIsAddingStep(false);
  };

  const handleDragStart = (e: React.DragEvent, stepId: string) => {
    e.dataTransfer.setData('text/plain', stepId);
    setDraggedId(stepId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId !== targetId) {
      reorderSteps(sourceId, targetId);
    }
    setDraggedId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Process Steps</h2>
          <button
            onClick={() => setIsAddingStep(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-maple-orange/10 text-maple-orange rounded-lg hover:bg-maple-orange/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>
        </div>

        {isAddingStep && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-3">
              <textarea
                value={newStepContent}
                onChange={(e) => setNewStepContent(e.target.value)}
                placeholder="Enter step description..."
                className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-maple-blue"
                rows={2}
              />
              <textarea
                value={newStepNotes}
                onChange={(e) => setNewStepNotes(e.target.value)}
                placeholder="Add notes (optional)..."
                className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-maple-blue"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsAddingStep(false);
                    setNewStepContent('');
                    setNewStepNotes('');
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStep}
                  disabled={!newStepContent.trim()}
                  className="px-3 py-1.5 text-sm bg-maple-orange text-white rounded-md hover:bg-maple-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Step
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {steps.map((step) => (
            <div 
              key={step.id}
              draggable
              onDragStart={(e) => handleDragStart(e, step.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, step.id)}
              className={`relative group p-4 bg-gray-50 rounded-lg transition-colors ${
                draggedId === step.id ? 'opacity-50' : 'hover:bg-gray-100'
              }`}
            >
              {editingId === step.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-maple-blue"
                    rows={2}
                  />
                  <textarea
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    placeholder="Add notes..."
                    className="w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-maple-blue"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancel}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSave}
                      className="p-2 text-maple-orange hover:text-maple-orange-dark"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div 
                    className="flex-shrink-0 mt-1 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-maple-orange" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">Step {step.number}</span>
                    <p className="text-gray-700 mt-1">{step.content}</p>
                    {step.notes && (
                      <p className="text-gray-500 text-sm mt-2 italic">{step.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleEdit(step)}
                    className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-maple-orange"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}