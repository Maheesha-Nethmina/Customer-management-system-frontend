import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  
  const isActive = (path) => {
    return location.pathname === path 
      ? 'text-primary font-semibold border-b-2 border-primary' 
      : 'text-slate-500 hover:text-primary border-b-2 border-transparent transition-colors duration-200';
  };

  return (
    <nav className="bg-surface shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo & Navigation Links */}
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

          

        </div>
      </div>
    </nav>
  );
};

export default Navbar;