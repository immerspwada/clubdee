'use client';

import { useEffect } from 'react';
import { simpleSignOut } from '@/lib/auth/simple-actions';

export default function LogoutPage() {
  useEffect(() => {
    simpleSignOut();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">กำลังออกจากระบบ...</p>
      </div>
    </div>
  );
}
