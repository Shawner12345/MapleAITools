import React from 'react';
import { Trash2, Clock, ArrowRight } from 'lucide-react';
import { useSopStore } from '../store/sopStore';

interface SavedRecordingsProps {
  onNavigateToCreate?: () => void;
}

export function SavedRecordings({ onNavigateToCreate }: SavedRecordingsProps) {
  const { savedProcesses, deleteProcess, loadProcess } = useSopStore();

  const handleLoad = (id: string) => {
    loadProcess(id);
    onNavigateToCreate?.();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (savedProcesses.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No saved processes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start by creating a new process and saving it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="space-y-4">
        {savedProcesses.map((process) => (
          <div
            key={process.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{process.title}</h3>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDate(process.createdAt)}
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {process.steps.length} steps
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => deleteProcess(process.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete process"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleLoad(process.id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  Load
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}