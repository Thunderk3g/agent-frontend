import React, { useState } from 'react';
import ChatInterface from './components/Chat/ChatInterface';
import ProductSidebar from './components/Layout/ProductSidebar';
import FormWizard from './components/Forms/FormWizard';
import { useStore } from './store/useStore';
import './App.css';

function App() {
  const [viewMode, setViewMode] = useState<'chat' | 'form'>('chat');
  const { sessionState, currentStep } = useStore();

  // Auto-switch to form mode for certain states
  React.useEffect(() => {
    if (['product_selection', 'addon_riders', 'payment_initiated'].includes(sessionState)) {
      setViewMode('form');
    }
  }, [sessionState]);

  const handleFormComplete = () => {
    setViewMode('chat');
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'chat' ? 'form' : 'chat');
  };

  return (
    <div className="app-shell">
      <main className="main">
        {/* View Toggle Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={toggleViewMode}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
          >
            {viewMode === 'chat' ? 'Switch to Forms' : 'Switch to Chat'}
          </button>
        </div>

        {viewMode === 'chat' ? (
          <ChatInterface />
        ) : (
          <FormWizard onComplete={handleFormComplete} initialStep={currentStep} />
        )}
      </main>
      <ProductSidebar />
    </div>
  );
}

export default App;
