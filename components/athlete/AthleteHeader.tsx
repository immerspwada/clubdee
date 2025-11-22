'use client';

import { User, LogOut, Menu } from 'lucide-react';
import { simpleSignOut } from '@/lib/auth/simple-actions';
import { useState } from 'react';
import Link from 'next/link';

interface AthleteHeaderProps {
  firstName: string;
  lastName: string;
  nickname?: string;
  clubName?: string;
  profilePictureUrl?: string;
}

export default function AthleteHeader({
  firstName,
  lastName,
  nickname,
  clubName,
  profilePictureUrl,
}: AthleteHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    if (confirm('ต้องการออกจากระบบหรือไม่?')) {
      await simpleSignOut();
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="mx-auto max-w-7xl p-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/athlete" className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt={`${firstName} ${lastName}`}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                สวัสดี, {nickname || firstName}!
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                {clubName || 'นักกีฬา'}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-lg p-3 hover:bg-white/10 transition-colors lg:hidden"
              title="เมนู"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg p-3 hover:bg-white/10 transition-colors"
              title="ออกจากระบบ"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="mt-4 rounded-lg bg-white/10 p-4 lg:hidden">
            <nav className="space-y-2">
              <Link
                href="/dashboard/athlete"
                className="block rounded-lg px-4 py-2 hover:bg-white/10"
              >
                หน้าหลัก
              </Link>
              <Link
                href="/dashboard/athlete/profile"
                className="block rounded-lg px-4 py-2 hover:bg-white/10"
              >
                โปรไฟล์
              </Link>
              <Link
                href="/dashboard/athlete/schedule"
                className="block rounded-lg px-4 py-2 hover:bg-white/10"
              >
                ตารางการฝึกซ้อม
              </Link>
              <Link
                href="/dashboard/athlete/attendance"
                className="block rounded-lg px-4 py-2 hover:bg-white/10"
              >
                ประวัติการเข้าร่วม
              </Link>
              <Link
                href="/dashboard/athlete/performance"
                className="block rounded-lg px-4 py-2 hover:bg-white/10"
              >
                ผลการทดสอบ
              </Link>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
