// src/Hooks/UseAuth.js
// src/Hooks/UseAuth.js
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  }
  return context;
}