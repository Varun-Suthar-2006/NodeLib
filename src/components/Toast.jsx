import React from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();

  return (
    <div className={`toast-floating ${toast.show ? 'show' : ''}`}>
      {toast.message}
    </div>
  );
}
