
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  PlusCircle, 
  User, 
  LogOut, 
  PenTool,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Feed', path: '/feed', icon: Globe },
    { label: 'My Diary', path: '/dashboard', icon: BookOpen },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  if (!isAuthenticated) return <div className="min-h-screen bg-gray-50">{children}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20 md:pb-0">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 glass-effect border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">SoulJournal</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path 
                    ? 'text-indigo-600 bg-indigo-50 font-medium' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          <Link 
            to="/create"
            className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
          >
            <PlusCircle className="w-4 h-4" />
            New Entry
          </Link>
          
          <Link to="/profile" className="md:hidden">
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
               {user?.username[0].toUpperCase()}
             </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-effect border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50">
        <Link to="/feed" className={`flex flex-col items-center gap-1 ${location.pathname === '/feed' ? 'text-indigo-600' : 'text-gray-500'}`}>
          <Globe className="w-6 h-6" />
          <span className="text-[10px]">Feed</span>
        </Link>
        <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${location.pathname === '/dashboard' ? 'text-indigo-600' : 'text-gray-500'}`}>
          <BookOpen className="w-6 h-6" />
          <span className="text-[10px]">Diary</span>
        </Link>
        <Link to="/create" className="relative -top-6">
          <div className="bg-indigo-600 p-4 rounded-full text-white shadow-lg shadow-indigo-200 border-4 border-gray-50">
            <PlusCircle className="w-7 h-7" />
          </div>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center gap-1 ${location.pathname === '/profile' ? 'text-indigo-600' : 'text-gray-500'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px]">Profile</span>
        </Link>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-gray-500">
          <LogOut className="w-6 h-6" />
          <span className="text-[10px]">Exit</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
