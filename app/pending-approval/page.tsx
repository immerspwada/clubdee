import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAthleteAccessStatus } from '@/lib/auth/access-control';
import { Clock, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

/**
 * Pending Approval Page
 * 
 * Validates: Requirements AC5, AC6
 * - AC5: Rejection Handling - Show rejection reason and allow reapplication
 * - AC6: Pending State Restrictions - Show pending status and prevent access
 * 
 * This page is shown to athletes who don't have active membership status.
 * It displays different content based on membership_status:
 * - pending: Show waiting message with application details
 * - rejected: Show rejection reason and reapply button
 * - suspended: Show suspension message
 * - null: Show registration prompt
 */
export default async function PendingApprovalPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get detailed access status
  const accessStatus = await getAthleteAccessStatus(user.id);

  // If user has access (active membership), redirect to dashboard
  if (accessStatus.hasAccess) {
    redirect('/dashboard/athlete');
  }

  // Get user role to check if they're an athlete
  const { data: userRoleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  const userRole = (userRoleData as any)?.role || 'athlete';

  // Non-athletes shouldn't see this page
  if (userRole !== 'athlete') {
    redirect('/dashboard');
  }

  // Render based on membership status
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-2xl w-full">
        {accessStatus.membershipStatus === 'pending' && (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Clock className="w-16 h-16 text-yellow-500" />
              </div>
              <CardTitle className="text-2xl">รอการอนุมัติ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-gray-600">
                  คำขอสมัครของคุณกำลังรอการพิจารณาจากโค้ช
                </p>
                {accessStatus.clubName && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-500">ชมรม:</span>
                    <Badge variant="secondary">{accessStatus.clubName}</Badge>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  ขั้นตอนต่อไป
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• โค้ชจะตรวจสอบข้อมูลและเอกสารของคุณ</li>
                  <li>• คุณจะได้รับการแจ้งเตือนเมื่อมีการตัดสินใจ</li>
                  <li>• กรุณาตรวจสอบอีเมลเป็นประจำ</li>
                </ul>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Link href="/dashboard/athlete/applications">
                  <Button variant="outline">ดูสถานะใบสมัคร</Button>
                </Link>
                <Link href="/logout">
                  <Button variant="ghost">ออกจากระบบ</Button>
                </Link>
              </div>
            </CardContent>
          </>
        )}

        {accessStatus.membershipStatus === 'rejected' && (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl">คำขอถูกปฏิเสธ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-gray-600">
                  คำขอสมัครของคุณไม่ได้รับการอนุมัติ
                </p>
                {accessStatus.clubName && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-500">ชมรม:</span>
                    <Badge variant="secondary">{accessStatus.clubName}</Badge>
                  </div>
                )}
              </div>

              {accessStatus.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 mb-2">
                    เหตุผลในการปฏิเสธ
                  </h3>
                  <p className="text-sm text-red-800">
                    {accessStatus.rejectionReason}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  ต้องการสมัครใหม่?
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  คุณสามารถแก้ไขข้อมูลและสมัครใหม่ได้ หรือเลือกชมรมอื่น
                </p>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Link href="/register-membership">
                  <Button>สมัครใหม่</Button>
                </Link>
                <Link href="/dashboard/athlete/applications">
                  <Button variant="outline">ดูประวัติใบสมัคร</Button>
                </Link>
                <Link href="/logout">
                  <Button variant="ghost">ออกจากระบบ</Button>
                </Link>
              </div>
            </CardContent>
          </>
        )}

        {accessStatus.membershipStatus === 'suspended' && (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-16 h-16 text-orange-500" />
              </div>
              <CardTitle className="text-2xl">บัญชีถูกระงับ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-gray-600">
                  บัญชีของคุณถูกระงับชั่วคราว
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">
                  ติดต่อผู้ดูแลระบบ
                </h3>
                <p className="text-sm text-orange-800">
                  กรุณาติดต่อโค้ชหรือผู้ดูแลระบบเพื่อสอบถามข้อมูลเพิ่มเติม
                </p>
              </div>
            </CardContent>
          </>
        )}

        {!accessStatus.membershipStatus && (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-blue-500" />
              </div>
              <CardTitle className="text-2xl">ยินดีต้อนรับ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-gray-600">
                  กรุณาสมัครสมาชิกเพื่อเข้าใช้งานระบบ
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  ขั้นตอนการสมัคร
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• เลือกชมรมที่ต้องการสมัคร</li>
                  <li>• กรอกข้อมูลส่วนตัวและอัปโหลดเอกสาร</li>
                  <li>• รอการอนุมัติจากโค้ช</li>
                  <li>• เริ่มใช้งานระบบได้ทันทีหลังอนุมัติ</li>
                </ul>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Link href="/register-membership">
                  <Button size="lg">สมัครสมาชิก</Button>
                </Link>
                <Link href="/logout">
                  <Button size="lg" variant="ghost">ออกจากระบบ</Button>
                </Link>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
