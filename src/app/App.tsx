import React, { useEffect, useState } from 'react';
import { ProjectManager } from './ProjectManager';
import { Editor } from './Editor';
import { useProjectStore } from '../store/useProjectStore';
import { useDocumentStore } from '../store/useDocumentStore';
import { ImportModal } from '../components/dialogs/ImportModal';
import { ConfirmModal } from '../components/dialogs/ConfirmModal';

export const App: React.FC = () => {
  const { activeProjectId, openProject } = useProjectStore();
  const setDocument = useDocumentStore((s) => s.setDocument);
  const [currentView, setCurrentView] = useState<'manager' | 'editor'>('manager');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function init() {
      if (activeProjectId) {
        const doc = await openProject(activeProjectId);
        if (doc) {
          setDocument(doc);
          setCurrentView('editor');
        }
      }
      setIsInitializing(false);
    }
    init();
  }, []);

  const handleOpenEditor = () => {
    setCurrentView('editor');
  };

  const handleBackToProjects = () => {
    setCurrentView('manager');
  };

  if (isInitializing) {
    return (
      <div className="chigma-loading-screen">
        <div className="loading-spinner" />
        <span>Loading Chigma...</span>
      </div>
    );
  }

  return (
    <div className="chigma-app-root">
      {currentView === 'manager' ? (
        <>
          <ProjectManager onOpenEditor={handleOpenEditor} />
          <ImportModal />
          <ConfirmModal />
        </>
      ) : (
        <Editor onBackToProjects={handleBackToProjects} />
      )}
    </div>
  );
};

export default App;
