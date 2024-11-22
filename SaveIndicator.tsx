import React from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

interface SaveIndicatorProps {
  saving: boolean;
}

const SaveIndicator: React.FC<SaveIndicatorProps> = ({ saving }) => {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
      {saving ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          All changes saved
        </>
      )}
    </span>
  );
}

export default SaveIndicator;