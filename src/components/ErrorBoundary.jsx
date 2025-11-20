import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error(error); }
  handleReset = () => {
    try { localStorage.clear(); } catch (e) { }
    window.location.reload();
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-[#121212] text-white p-6 text-center font-sans">
          <AlertTriangle size={64} className="text-red-500 mb-4 drop-shadow-lg" />
          <h1 className="text-2xl font-bold mb-2 tracking-tight">Errore di Avvio</h1>
          <p className="text-gray-400 text-xs mb-6">Dati salvati corrotti. Necessario reset.</p>
          <button onClick={this.handleReset} className="px-6 py-3 bg-red-600 rounded-2xl font-bold shadow-lg hover:bg-red-500 transition-colors">Ripara Ora</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
