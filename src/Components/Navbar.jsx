import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // Helper function to highlight the active tab
  const isActive = (path) => {
    return location.pathname === path 
      ? 'text-primary font-semibold border-b-2 border-primary' 
      : 'text-slate-500 hover:text-primary border-b-2 border-transparent transition-colors duration-200';
  };

  return (
    <nav className="bg-surface shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Left Side: Logo & Navigation Links */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-slate-800 tracking-tight">
                <span className="text-primary">CMS</span>
              </Link>
            </div>
            
            <div className="hidden md:flex space-x-8 h-full items-center pt-1">
              <Link to="/" className={`h-full flex items-center ${isActive('/')}`}>
                Dashboard
              </Link>
              <Link to="/add-customer" className={`h-full flex items-center ${isActive('/add-customer')}`}>
                Add Customer
              </Link>
            </div>
          </div>

          {/* Right Side: User Profile Area */}
          <div className="flex items-center">
            {/* Soft pill-shaped container with subtle hover lift */}
            <div className="flex items-center space-x-3 bg-slate-50 py-1.5 px-4 rounded-full border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default">
              
              {/* Avatar Circle */}
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold shadow-inner">
                MN
              </div>
              
              {/* Animated Name Display */}
              <span className="text-sm font-medium text-slate-700 name-glow tracking-wide">
                Maheesha Nethmina
              </span>
              
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;