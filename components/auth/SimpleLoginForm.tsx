'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth/actions';
import Link from 'next/link';

const TEST_USERS = {
  admin: { email: 'admin@test.com', password: 'Admin123!' },
  coach: { email: 'coach@test.com', password: 'Coach123!' },
  athlete: { email: 'athlete@test.com', password: 'Athlete123!' },
};

const STORAGE_KEY = 'sports_club_login';

export function SimpleLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTestCredentials, setShowTestCredentials] = useState(false);

  // Load saved credentials on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { email: savedEmail, password: savedPassword } = JSON.parse(saved);
        setEmail(savedEmail || '');
        setPassword(savedPassword || '');
        setRememberMe(true);
      }
    } catch (err) {
      // Ignore errors
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (!result.success) {
        setError(result.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        setLoading(false);
        return;
      }

      // Save or clear credentials based on rememberMe
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }

      const role = (result.data as { role?: string })?.role || 'athlete';
      const redirectUrl = role === 'admin' ? '/dashboard/admin' : 
                         role === 'coach' ? '/dashboard/coach' : 
                         '/dashboard/athlete';
      router.push(redirectUrl);
      router.refresh();
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      setLoading(false);
    }
  };

  const fillCredentials = (type: keyof typeof TEST_USERS) => {
    setEmail(TEST_USERS[type].email);
    setPassword(TEST_USERS[type].password);
    setError('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            เข้าสู่ระบบ
          </h1>
          <p className="text-sm text-gray-600">
            ระบบจัดการสโมสรกีฬา
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 active:text-gray-600 p-1 touch-manipulation"
                disabled={loading}
                aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
              จดจำรหัสผ่าน
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-base bg-blue-600 text-white font-medium rounded-lg active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?{' '}
          <Link href="/register" className="text-blue-600 active:text-blue-700 font-medium touch-manipulation">
            สมัครสมาชิก
          </Link>
        </div>

        {/* Test Credentials */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowTestCredentials(!showTestCredentials)}
            className="w-full text-xs text-gray-500 active:text-gray-700 font-medium py-2 touch-manipulation"
          >
            {showTestCredentials ? '▼' : '▶'} ข้อมูลทดสอบ
          </button>
          
          {showTestCredentials && (
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="w-full px-3 py-3 text-sm bg-gray-50 active:bg-gray-100 border border-gray-200 rounded-lg transition-colors touch-manipulation"
              >
                👨‍💼 Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('coach')}
                className="w-full px-3 py-3 text-sm bg-gray-50 active:bg-gray-100 border border-gray-200 rounded-lg transition-colors touch-manipulation"
              >
                🏃‍♂️ Coach
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('athlete')}
                className="w-full px-3 py-3 text-sm bg-gray-50 active:bg-gray-100 border border-gray-200 rounded-lg transition-colors touch-manipulation"
              >
                🏅 Athlete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
