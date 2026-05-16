import { Link, useLocation } from 'react-router-dom';
import { Cloud, LayoutDashboard, UploadCloud } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="h-20 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <Cloud className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter">
            RESILIENT<span className="text-primary">CLOUD</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-4">
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive('/') ? 'bg-primary/10 text-primary font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard size={18} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link 
            to="/upload" 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              isActive('/upload') ? 'bg-primary/10 text-primary font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UploadCloud size={18} />
            <span className="hidden sm:inline">Upload</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
