import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ className = "" }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2 className="w-8 h-8 text-accentViolet animate-spin" />
    </div>
  );
}
