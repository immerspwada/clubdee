'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Calendar, Clock, MapPin, Users, CheckCircle, XCircle } from 'lucide-react';
import { QRCodeScanner } from './QRCodeScanner';
import { registerForActivity, cancelRegistration } from '@/lib/activity/actions';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

interface Activity {
  id: string;
  title: string;
  description?: string;
  activity_type: string;
  activity_date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants?: number;
  requires_registration: boolean;
  status: string;
  coaches?: {
    first_name: string;
    last_name: string;
  };
  activity_registrations?: Array<{
    id: string;
    status: string;
    athlete_id: string;
  }>;
  activity_checkins?: Array<{
    id: string;
    status: string;
    checked_in_at: string;
    checked_out_at?: string;
    athlete_id: string;
  }>;
}

interface Registration {
  id: string;
  status: string;
  athlete_notes?: string;
  coach_notes?: string;
  rejection_reason?: string;
  registered_at: string;
}

interface ActivityListProps {
  activities: Activity[];
  athleteId: string;
  registrations?: Registration[];
  type: 'upcoming' | 'registrations' | 'past';
}

const activityTypeLabels: Record<string, string> = {
  training: 'ฝึกซ้อม',
  competition: 'แข่งขัน',
  practice: 'ทดสอบ',
  other: 'อื่นๆ',
};

const activityTypeColors: Record<string, string> = {
  training: 'bg-gray-100 text-gray-900 border border-gray-300',
  competition: 'bg-gray-900 text-white border border-gray-900',
  practice: 'bg-white text-gray-900 border border-gray-900',
  other: 'bg-gray-200 text-gray-900 border border-gray-400',
};

const registrationStatusLabels: Record<string, string> = {
  pending: 'รอการอนุมัติ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ไม่อนุมัติ',
  cancelled: 'ยกเลิกแล้ว',
};

const registrationStatusColors: Record<string, string> = {
  pending: 'bg-white text-gray-900 border border-gray-400',
  approved: 'bg-gray-900 text-white border border-gray-900',
  rejected: 'bg-gray-100 text-gray-900 border border-gray-300',
  cancelled: 'bg-gray-200 text-gray-600 border border-gray-300',
};

export function ActivityList({ activities, athleteId, registrations, type }: ActivityListProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const { addToast } = useToast();
  const router = useRouter();

  const handleRegister = async (activityId: string) => {
    setLoading(activityId);
    const result = await registerForActivity(activityId);
    setLoading(null);

    if (result.error) {
      addToast({
        title: 'เกิดข้อผิดพลาด',
        description: result.error,
        variant: 'error',
      });
    } else {
      addToast({
        title: 'ลงทะเบียนสำเร็จ',
        description: 'รอการอนุมัติจากโค้ช',
        variant: 'success',
      });
      router.refresh();
    }
  };

  const handleCancelRegistration = async (registrationId: string) => {
    setLoading(registrationId);
    const result = await cancelRegistration(registrationId);
    setLoading(null);

    if (result.error) {
      addToast({
        title: 'เกิดข้อผิดพลาด',
        description: result.error,
        variant: 'error',
      });
    } else {
      addToast({
        title: 'ยกเลิกสำเร็จ',
        description: 'ยกเลิกการลงทะเบียนเรียบร้อยแล้ว',
        variant: 'success',
      });
      router.refresh();
    }
  };

  const handleScanQR = (activityId: string) => {
    setSelectedActivity(activityId);
    setShowScanner(true);
  };

  const getMyRegistration = (activity: Activity) => {
    return activity.activity_registrations?.find(r => r.athlete_id === athleteId);
  };

  const getMyCheckin = (activity: Activity) => {
    return activity.activity_checkins?.find(c => c.athlete_id === athleteId);
  };

  if (activities.length === 0) {
    const emptyMessages = {
      upcoming: {
        icon: '📅',
        title: 'ไม่มีกิจกรรมที่กำลังจะมาถึง',
        description: 'ยังไม่มีกิจกรรมใหม่ในขณะนี้',
      },
      registrations: {
        icon: '📝',
        title: 'ยังไม่มีการลงทะเบียน',
        description: 'คุณยังไม่ได้ลงทะเบียนกิจกรรมใดๆ',
      },
      past: {
        icon: '✅',
        title: 'ไม่มีกิจกรรมที่ผ่านมา',
        description: 'ยังไม่มีประวัติกิจกรรม',
      },
    };

    const message = emptyMessages[type];

    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
        <div className="text-5xl mb-4">{message.icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{message.title}</h3>
        <p className="text-sm text-gray-600">{message.description}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {activities.map((activity) => {
          const myRegistration = getMyRegistration(activity);
          const myCheckin = getMyCheckin(activity);
          const registration = registrations?.find(r => 
            r.id === myRegistration?.id
          );

          return (
            <Card key={activity.id} className="p-4 shadow-sm border-0 hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        myCheckin ? 'bg-green-500' : 
                        myRegistration?.status === 'approved' ? 'bg-blue-500' :
                        myRegistration?.status === 'pending' ? 'bg-yellow-500' :
                        'bg-gray-300'
                      }`} />
                      <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge className={`${activityTypeColors[activity.activity_type]} text-xs`}>
                        {activityTypeLabels[activity.activity_type]}
                      </Badge>
                      {myRegistration && (
                        <Badge className={`${registrationStatusColors[myRegistration.status]} text-xs`}>
                          {registrationStatusLabels[myRegistration.status]}
                        </Badge>
                      )}
                      {myCheckin && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          เช็คอินแล้ว
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {activity.description && (
                  <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                )}

                <div className="space-y-2 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(activity.activity_date).toLocaleDateString('th-TH', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {activity.start_time} - {activity.end_time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {activity.location}
                  </div>
                </div>

                {myCheckin && (
                  <div className={`mb-3 p-3 rounded-lg ${
                    myCheckin.status === 'on_time' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        myCheckin.status === 'on_time' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        {myCheckin.status === 'on_time' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`text-xs font-medium ${
                          myCheckin.status === 'on_time' ? 'text-green-900' : 'text-yellow-900'
                        }`}>
                          {myCheckin.status === 'on_time' ? 'มาตรงเวลา' : 'มาสาย'}
                        </div>
                        <div className={`text-xs ${
                          myCheckin.status === 'on_time' ? 'text-green-700' : 'text-yellow-700'
                        }`}>
                          เช็คอิน {new Date(myCheckin.checked_in_at).toLocaleTimeString('th-TH', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {registration && registration.rejection_reason && (
                  <div className="mb-3 p-3 bg-red-50 rounded-lg">
                    <div className="text-xs text-red-900">
                      <div className="font-medium">เหตุผล:</div>
                      <div className="mt-1">{registration.rejection_reason}</div>
                    </div>
                  </div>
                )}

                {type === 'upcoming' && !myCheckin && (
                  <div className="flex gap-2">
                    {activity.requires_registration ? (
                      <>
                        {!myRegistration && (
                          <Button
                            onClick={() => handleRegister(activity.id)}
                            disabled={loading === activity.id}
                            size="sm"
                            className="flex-1"
                          >
                            ลงทะเบียน
                          </Button>
                        )}
                        {myRegistration?.status === 'pending' && (
                          <Button
                            variant="outline"
                            onClick={() => handleCancelRegistration(myRegistration.id)}
                            disabled={loading === myRegistration.id}
                            size="sm"
                            className="flex-1"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            ยกเลิก
                          </Button>
                        )}
                        {myRegistration?.status === 'approved' && (
                          <Button 
                            onClick={() => handleScanQR(activity.id)}
                            size="sm"
                            className="flex-1"
                          >
                            <QrCode className="w-4 h-4 mr-1" />
                            สแกน QR
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button 
                        onClick={() => handleScanQR(activity.id)}
                        size="sm"
                        className="flex-1"
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        สแกน QR
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {showScanner && selectedActivity && (
        <QRCodeScanner
          activityId={selectedActivity}
          onClose={() => {
            setShowScanner(false);
            setSelectedActivity(null);
          }}
          onSuccess={() => {
            setShowScanner(false);
            setSelectedActivity(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
