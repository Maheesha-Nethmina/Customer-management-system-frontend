import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components
import Navbar from './Components/Navbar';
import Dashboard from './pages/Dashboard';
import CustomerForm from './pages/CustomerForm';
import CustomerView from './pages/CustomerView';

function App() {
  return (
    <Router>
      {/* Wrapper to ensure the background covers the full screen height */}
      <div className="min-h-screen flex flex-col bg-background font-sans text-slate-800">
        
        {/* The sticky navigation bar we built */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            {/* Setting path="/" makes this the Index/Home page. 
              When the app loads, it immediately shows the Dashboard.
            */}
            <Route path="/" element={<Dashboard />} />
           
            <Route path="/add-customer" element={<CustomerForm />} />
            <Route path="/edit-customer/:id" element={<CustomerForm />} />
            <Route path="/view-customer/:id" element={<CustomerView />} />
          </Routes>
        </main>

        {/* A clean, minimal footer */}
        <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 mt-auto bg-surface">
          Customer Management System &copy; {new Date().getFullYear()}
        </footer>

      </div>
    </Router>
  );
}

export default App;