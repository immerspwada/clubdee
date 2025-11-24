'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { approveRegistration, rejectRegistration, removeAthleteFromActivity } from '@/lib/activity/actions';
import { useToast } from '@/components/ui/toast';

interface Activity {
  id: string;
  title: string;
  activity_registrations?: Array<{
    id: string;
    status: string;
    athlete_id: string;
    athlete_notes?: string;
    coach_notes?: string;
    rejection_reason?: string;
    registered_at: string;
    athletes: {
      first_name: string;
      last_name: string;
    };
  }>;
}

const statusLabels: Record<string, string> = {
  pending: 'รอการอนุมัติ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ไม่อนุมัติ',
  cancelled: 'ยกเลิกแล้ว',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export function RegistrationManagement({ activity, onClose }: { activity: Activity; onClose: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { addToast } = useToast();

  const handleApprove = async (registrationId: string) => {
    setLoading(registrationId);
    const result = await approveRegistration(registrationId);
    setLoading(null);

    if (result.error) {
      addToast({
        title: 'เกิดข้อผิดพลาด',
        description: result.error,
        variant: 'error',
      });
    } else {
      addToast({
        title: 'อนุมัติสำเร็จ',
        description: 'อนุมัติการลงทะเบียนเรียบร้อยแล้ว',
        variant: 'success',
      });
      onClose();
    }
  };

  const handleReject = async (registrationId: string) => {
    if (!rejectionReason.trim()) {
      addToast({
        title: 'กรุณาระบุเหตุผล',
        description: 'กรุณาระบุเหตุผลที่ไม่อนุมัติ',
        variant: 'error',
      });
      return;
    }

    setLoading(registrationId);
    const result = await rejectRegistration(registrationId, rejectionReason);
    setLoading(null);

    if (result.error) {
      addToast({
        title: 'เกิดข้อผิดพลาด',
        description: result.error,
        variant: 'error',
      });
    } else {
      addToast({
        title: 'ไม่อนุมัติสำเร็จ',
        description: 'ไม่อนุมัติการลงทะเบียนเรียบร้อยแล้ว',
        variant: 'success',
      });
      setRejectingId(null);
      setRejectionReason('');
      onClose();
    }
  };

  const handleRemove = async (registrationId: string) => {
    if (!confirm('คุณต้องการลบนักกีฬาออกจากกิจกรรมนี้ใช่หรือไม่?')) {
      return;
    }

    setLoading(registrationId);
    const result = await removeAthleteFromActivity(registrationId);
    setLoading(null);

    if (result.error) {
      addToast({
        title: 'เกิดข้อผิดพลาด',
        description: result.error,
        variant: 'error',
      });
    } else {
      addToast({
        title: 'ลบสำเร็จ',
        description: 'ลบนักกีฬาออกจากกิจกรรมเรียบร้อยแล้ว',
        variant: 'success',
      });
      onClose();
    }
  };

  const registrations = activity.activity_registrations || [];
  const pendingRegistrations = registrations.filter(r => r.status === 'pending');
  const approvedRegistrations = registrations.filter(r => r.status === 'approved');
  const otherRegistrations = registrations.filter(r => !['pending', 'approved'].includes(r.status));

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>จัดการการลงทะเบียน - {activity.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pending Registrations */}
          {pendingRegistrations.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                รอการอนุมัติ
                <Badge className="bg-yellow-100 text-yellow-800">
                  {pendingRegistrations.length}
                </Badge>
              </h3>
              <div className="space-y-3">
                {pendingRegistrations.map((reg) => (
                  <div key={reg.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">
                          {reg.athletes.first_name} {reg.athletes.last_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          ลงทะเบียนเมื่อ: {new Date(reg.registered_at).toLocaleString('th-TH')}
                        </div>
                      </div>
                      <Badge className={statusColors[reg.status]}>
                        {statusLabels[reg.status]}
                      </Badge>
                    </div>

                    {reg.athlete_notes && (
                      <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
                        <div className="font-medium text-gray-700">เหตุผลที่ต้องการเข้าร่วม:</div>
                        <div className="text-gray-600">{reg.athlete_notes}</div>
                      </div>
                    )}

                    {rejectingId === reg.id ? (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="ระบุเหตุผลที่ไม่อนุมัติ..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setRejectingId(null);
                              setRejectionReason('');
                            }}
                          >
                            ยกเลิก
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(reg.id)}
                            disabled={loading === reg.id}
                          >
                            ยืนยันไม่อนุมัติ
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(reg.id)}
                          disabled={loading === reg.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          อนุมัติ
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRejectingId(reg.id)}
                          disabled={loading === reg.id}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          ไม่อนุมัติ
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approved Registrations */}
          {approvedRegistrations.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                อนุมัติแล้ว
                <Badge className="bg-green-100 text-green-800">
                  {approvedRegistrations.length}
                </Badge>
              </h3>
              <div className="space-y-2">
                {approvedRegistrations.map((reg) => (
                  <div key={reg.id} className="border rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {reg.athletes.first_name} {reg.athletes.last_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        อนุมัติเมื่อ: {new Date(reg.registered_at).toLocaleString('th-TH')}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemove(reg.id)}
                      disabled={loading === reg.id}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Registrations */}
          {otherRegistrations.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">อื่นๆ</h3>
              <div className="space-y-2">
                {otherRegistrations.map((reg) => (
                  <div key={reg.id} className="border rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {reg.athletes.first_name} {reg.athletes.last_name}
                      </div>
                      <Badge className={statusColors[reg.status]}>
                        {statusLabels[reg.status]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {registrations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              ยังไม่มีการลงทะเบียน
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
