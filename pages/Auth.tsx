
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PenTool, Mail, Lock, User, ArrowRight, AlertCircle, Loader2, CheckCircle2, Key } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      if (result.unverified) {
        setError('Please verify your email address before logging in. Check your inbox!');
      } else {
        setError(result.error || 'Invalid email or password');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-indigo-600 p-3 rounded-2xl text-white mb-6 shadow-xl shadow-indigo-100">
             <PenTool className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">SoulJournal</h1>
          <p className="text-gray-500">Welcome back! Your diary awaits.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-gray-200 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100 animate-shake">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-2xl outline-none transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-2xl outline-none transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-gray-500">
          Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
};

export const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  
  const { signup, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const result = await signup(username, email, password);
    if (result.success) {
      if (result.needsVerification) {
        setSuccess(true);
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error || 'Email already exists or invalid data');
    }
    setIsLoading(false);
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpToken.length < 6) return;
    
    setIsVerifyingOtp(true);
    setError('');
    const result = await verifyOtp(email, otpToken);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid verification code');
    }
    setIsVerifyingOtp(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 text-center shadow-2xl border border-gray-100">
          <div className="inline-flex items-center justify-center bg-green-100 p-4 rounded-full text-green-600 mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Check your email</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            We've sent a verification link to <strong>{email}</strong>.
          </p>

          {showOtpInput ? (
            <form onSubmit={handleOtpVerify} className="space-y-6 animate-slide-up">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Enter 6-Digit Code</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 rounded-2xl outline-none transition-all text-center text-2xl font-black tracking-[0.5em]"
                    value={otpToken}
                    onChange={(e) => setOtpToken(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                  />
                </div>
              </div>
              
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <button 
                type="submit"
                disabled={isVerifyingOtp || otpToken.length < 6}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isVerifyingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
              </button>
              
              <button 
                type="button"
                onClick={() => setShowOtpInput(false)}
                className="text-sm text-gray-400 hover:text-indigo-600 transition-colors"
              >
                Back to email link
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <button 
                onClick={() => setShowOtpInput(true)}
                className="w-full bg-gray-50 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
              >
                Enter code manually
              </button>
              <Link 
                to="/login"
                className="block w-full text-indigo-600 font-bold py-4"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center bg-indigo-600 p-3 rounded-2xl text-white mb-6 shadow-xl shadow-indigo-100">
             <PenTool className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Create Account</h1>
          <p className="text-gray-500">Join the SoulJournal community today.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-gray-200 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="janesoul"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-2xl outline-none transition-all font-medium"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-2xl outline-none transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="password" 
                  placeholder="Minimum 6 characters"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-2xl outline-none transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-gray-500">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
