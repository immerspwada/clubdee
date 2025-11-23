'use client';

/**
 * Unified Membership Registration Page
 * 
 * This page handles the COMPLETE registration flow in one place:
 * - Step 1: Create account (email + password)
 * - Step 2: Personal information
 * - Step 3: Upload documents
 * - Step 4: Select sport/club
 * 
 * Features:
 * - No authentication required (creates account in Step 1)
 * - Renders unified RegistrationForm component
 * - Handles success: shows toast and redirects to athlete applications page
 * - Error handling with toast notifications
 * - Checks if user is already logged in (redirects to dashboard)
 * 
 * Validates: Requirements US-1, US-2, NFR-1
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import RegistrationForm from '@/components/membership/RegistrationForm';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function RegisterMembershipPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Already logged in, redirect to dashboard
      setIsLoggedIn(true);
      router.push('/dashboard');
      return;
    }

    setLoading(false);
  }

  function handleSuccess() {
    toast({
      title: 'ส่งใบสมัครสำเร็จ! 🎉',
      description: 'ใบสมัครของคุณถูกส่งเรียบร้อยแล้ว รอการอนุมัติจากโค้ช',
      variant: 'default',
    });

    // Redirect to athlete applications page
    router.push('/dashboard/athlete/applications');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <RegistrationForm onSuccess={handleSuccess} />
    </div>
  );
}
