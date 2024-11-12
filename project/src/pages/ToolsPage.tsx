import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VoiceRecorder } from '../components/tools/VoiceRecorder';
import { StepsList } from '../components/tools/StepsList';
import { MindMap } from '../components/tools/MindMap';
import { useSopStore } from '../components/tools/store/sopStore';

export default function ToolsPage() {
  const { sopData } = useSopStore();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-primary py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-brand-accent mb-2">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span>Tools</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Maple AI Tools</h1>
          <p className="text-xl text-brand-secondary mt-2">
            AI-powered tools for process optimization and documentation
          </p>
        </div>
      </div>

      {/* Tools Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6">
          {/* Voice Recording Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Process Documentation</h2>
              <VoiceRecorder 
                onTranscriptionChange={(text) => console.log(text)}
                onStatusChange={(status) => console.log(status)}
              />
            </div>
          </div>

          {/* Steps List */}
          {sopData.steps.length > 0 && (
            <StepsList steps={sopData.steps} />
          )}

          {/* Mind Map */}
          {sopData.nodes.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Process Mind Map</h2>
                <div className="h-[600px]">
                  <MindMap />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}