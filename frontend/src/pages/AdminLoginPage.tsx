import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { loginAdmin } from '../services/api';

export function AdminLoginPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('safecity123@gmail.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await loginAdmin({ email, password });
      localStorage.setItem('accessToken', response.accessToken);
      navigate('/admin-dashboard');
    } catch (err) {
      setError(language === 'en' ? 'Invalid credentials' : 'ልክ ያልሆነ መረጃ');
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold">{language === 'en' ? 'Admin login' : 'የአስተዳደር መግቢያ'}</h1>
      <p className="mt-3 text-sm text-slate-600">{language === 'en' ? 'Use the temporary credentials provided in the documentation.' : 'በሰነዱ ውስጥ የተሰጡትን ጊዜያዊ መለያዎች ይጠቀሙ።'}</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" placeholder={language === 'en' ? 'Password' : 'የይለፍ ቃል'} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" className="rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white">
          {language === 'en' ? 'Sign in' : 'ግባ'}
        </button>
      </form>
    </div>
  );
}
