import React, { useState } from 'react';
import { Mic, FileText, Sparkles, LayoutDashboard, Save, FileQuestion, Brain, Code, FolderOpen, CreditCard, Trash2 } from 'lucide-react';
import { VoiceRecorder } from './components/VoiceRecorder';
import { StepsList } from './components/StepsList';
import { MindMap } from './components/MindMap';
import { ExportButton } from './components/ExportButton';
import { SaveProcessModal } from './components/SaveProcessModal';
import { SavedRecordings } from './components/SavedRecordings';
import { TranscriptionEditor } from './components/TranscriptionEditor';
import { MarkdownConverter } from './components/MarkdownConverter';
import { TrainingManual } from './components/TrainingManual';
import { FAQGenerator } from './components/FAQGenerator';
import { RootCauseAnalysis } from './components/RootCauseAnalysis';
import { HTMLConverter } from './components/HTMLConverter';
import { Pricing } from './components/Pricing';
import { useSopStore } from './store/sopStore';
import { processTranscriptionWithAI } from './services/openai';
import { generateNodesFromSteps } from './utils/mindMapUtils';

function App() {
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessedSteps, setHasProcessedSteps] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSavedSOPs, setShowSavedSOPs] = useState(false);
  const [activeView, setActiveView] = useState<'sop' | 'markdown' | 'training' | 'faq' | 'rootcause' | 'html' | 'pricing'>('sop');
  const { sopData, setSteps, setNodes, setEdges } = useSopStore();

  const handleProcessSteps = async () => {
    if (!transcription) return;

    setIsProcessing(true);
    setError(null);

    try {
      const steps = await processTranscriptionWithAI(transcription);
      setSteps(steps);

      const { nodes, edges } = generateNodesFromSteps(steps);
      setNodes(nodes);
      setEdges(edges);
      setHasProcessedSteps(true);
    } catch (error) {
      console.error('Error processing steps:', error);
      setError('Failed to process steps. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearAll = () => {
    setTranscription('');
    setHasProcessedSteps(false);
    setError(null);
    setSteps([]);
    setNodes([]);
    setEdges([]);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'sop':
        return (
          <main className="p-8">
            {showSavedSOPs ? (
              <div className="mb-6">
                <button
                  onClick={() => setShowSavedSOPs(false)}
                  className="mb-4 flex items-center gap-2 text-maple-orange hover:text-maple-orange-dark transition-colors"
                >
                  <span>←</span> Back to SOP/Mind Map Creator
                </button>
                <SavedRecordings onNavigateToCreate={() => setShowSavedSOPs(false)} />
              </div>
            ) : (
              <div className="grid gap-6">
                {/* Voice Recording Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-maple-orange/10 rounded-lg">
                          <Mic className="w-6 h-6 text-maple-orange" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Record Process</h3>
                          <p className="text-gray-600 mb-4">Record or type your process steps below.</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleClearAll}
                          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Clear All
                        </button>
                        <button
                          onClick={() => setShowSavedSOPs(true)}
                          className="flex items-center gap-2 px-4 py-2 text-maple-orange hover:bg-maple-orange/10 rounded-lg transition-colors"
                        >
                          <FolderOpen className="w-4 h-4" />
                          Saved SOPs
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <VoiceRecorder 
                        onTranscriptionChange={setTranscription}
                        onStatusChange={setIsTranscribing}
                      />

                      {transcription && !isTranscribing && (
                        <>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Transcription
                            </label>
                            <textarea
                              value={transcription}
                              onChange={(e) => setTranscription(e.target.value)}
                              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-maple-orange focus:border-maple-orange"
                            />
                          </div>

                          <TranscriptionEditor
                            transcription={transcription}
                            onTranscriptionChange={setTranscription}
                          />

                          <button
                            onClick={handleProcessSteps}
                            disabled={isProcessing}
                            className="mt-4 flex items-center gap-2 px-4 py-2 bg-maple-orange text-white rounded-lg hover:bg-maple-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isProcessing ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4" />
                                Process Steps
                              </>
                            )}
                          </button>
                        </>
                      )}

                      {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                          {error}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Steps List and Mind Map - Only show after processing */}
                {hasProcessedSteps && (
                  <>
                    {sopData.steps.length > 0 && (
                      <StepsList steps={sopData.steps} />
                    )}

                    {sopData.nodes.length > 0 && (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-maple-orange/10 rounded-lg">
                              <Brain className="w-5 h-5 text-maple-orange" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Process Mind Map</h3>
                          </div>
                          <div className="h-[600px] w-full">
                            <MindMap />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </main>
        );
      case 'markdown':
        return <MarkdownConverter />;
      case 'training':
        return <TrainingManual />;
      case 'faq':
        return <FAQGenerator />;
      case 'rootcause':
        return <RootCauseAnalysis />;
      case 'html':
        return <HTMLConverter />;
      case 'pricing':
        return <Pricing />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#1E88E5] text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Maple AI</h1>
          <p className="text-blue-100 text-sm mt-1">Process Documentation</p>
        </div>
        <nav className="mt-6">
          {[
            { id: 'sop', label: 'SOP/Mind Map Creator', icon: LayoutDashboard },
            { id: 'markdown', label: 'Markdown Converter', icon: FileText },
            { id: 'training', label: 'Training Manual', icon: Sparkles },
            { id: 'faq', label: 'FAQ Generator', icon: FileQuestion },
            { id: 'rootcause', label: 'Root Cause Analysis', icon: Brain },
            { id: 'html', label: 'Convert HTML', icon: Code },
            { id: 'pricing', label: 'Pricing', icon: CreditCard },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveView(id as typeof activeView);
                setShowSavedSOPs(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-blue-100 ${
                activeView === id ? 'bg-[#1976D2] border-l-4 border-maple-orange' : 'hover:bg-[#1976D2]'
              } transition-colors`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-8 py-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {activeView === 'sop' && (showSavedSOPs ? 'Saved SOPs' : 'SOP/Mind Map Creator')}
              {activeView === 'markdown' && 'Markdown Converter'}
              {activeView === 'training' && 'Training Manual Generator'}
              {activeView === 'faq' && 'FAQ Generator'}
              {activeView === 'rootcause' && 'Root Cause Analysis'}
              {activeView === 'html' && 'HTML Converter'}
              {activeView === 'pricing' && 'Pricing Plans'}
            </h2>
            {activeView === 'sop' && hasProcessedSteps && !showSavedSOPs && (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-maple-orange hover:bg-maple-orange/10 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <ExportButton />
              </div>
            )}
          </div>
        </header>

        {renderContent()}

        {showSaveModal && (
          <SaveProcessModal onClose={() => setShowSaveModal(false)} />
        )}
      </div>
    </div>
  );
}

export default App;