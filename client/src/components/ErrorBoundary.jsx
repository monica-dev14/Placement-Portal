import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SIT Portal Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-10">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-b-8 border-red-500 text-center max-w-md">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-4">Something went wrong</h2>
            <p className="text-slate-500 font-bold mb-8">Don't worry Monica, just refresh the page or check the backend connection.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-10 py-4 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
            >
              Refresh Portal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;