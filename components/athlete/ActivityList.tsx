'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { QrCode, Calendar, Clock, MapPin, Users, CheckCircle, XCircle, Search, Filter, Info } from 'lucide-react';
import { QRCodeScanner } from './QRCodeScanner';
import { registerForActivity, cancelRegistration } from '@/lib/activity/actions';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  training: 'bg-white text-black border border-gray-300',
  competition: 'bg-black text-white border border-black',
  practice: 'bg-white text-black border border-black',
  other: 'bg-gray-100 text-black border border-gray-300',
};

const registrationStatusLabels: Record<string, string> = {
  pending: 'รอการอนุมัติ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ไม่อนุมัติ',
  cancelled: 'ยกเลิกแล้ว',
};

const registrationStatusColors: Record<string, string> = {
  pending: 'bg-white text-black border border-gray-400',
  approved: 'bg-black text-white border border-black',
  rejected: 'bg-gray-100 text-gray-600 border border-gray-300',
  cancelled: 'bg-gray-50 text-gray-500 border border-gray-200',
};

// Helper function to calculate duration
function calculateDuration(startTime: string, endTime: string): string {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const durationMinutes = endMinutes - startMinutes;
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (hours > 0 && minutes > 0) {
    return `${hours} ชม. ${minutes} นาที`;
  } else if (hours > 0) {
    return `${hours} ชั่วโมง`;
  } else {
    return `${minutes} นาที`;
  }
}

export function ActivityList({ activities, athleteId, registrations, type }: ActivityListProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const { addToast } = useToast();
  const router = useRouter();

  // Filter and search activities
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(a => a.activity_type === filterType);
    }

    // Search by title, description, or location
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query) ||
        a.location.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activities, filterType, searchQuery]);

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

  const emptyMessages = {
    upcoming: {
      title: 'ไม่มีกิจกรรมที่กำลังจะมาถึง',
      description: 'ยังไม่มีกิจกรรมใหม่ในขณะนี้',
    },
    registrations: {
      title: 'ยังไม่มีการลงทะเบียน',
      description: 'คุณยังไม่ได้ลงทะเบียนกิจกรรมใดๆ',
    },
    past: {
      title: 'ไม่มีกิจกรรมที่ผ่านมา',
      description: 'ยังไม่มีประวัติกิจกรรม',
    },
  };

  if (activities.length === 0) {
    const message = emptyMessages[type];

    return (
      <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-base font-semibold text-black mb-1">{message.title}</h3>
        <p className="text-sm text-gray-600">{message.description}</p>
      </div>
    );
  }

  return (
    <>
      {/* Minimal Search and Filter */}
      {activities.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="ค้นหา..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full bg-white border-gray-300">
              <SelectValue placeholder="ประเภท" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="training">ฝึกซ้อม</SelectItem>
              <SelectItem value="competition">แข่งขัน</SelectItem>
              <SelectItem value="practice">ทดสอบ</SelectItem>
              <SelectItem value="other">อื่นๆ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Results count */}
      {filteredActivities.length !== activities.length && (
        <div className="mb-3 text-xs text-gray-500">
          {filteredActivities.length} / {activities.length}
        </div>
      )}

      {/* Empty search results */}
      {filteredActivities.length === 0 && activities.length > 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-sm font-semibold text-black mb-1">ไม่พบกิจกรรม</h3>
          <p className="text-xs text-gray-600">ลองค้นหาด้วยคำอื่น</p>
        </div>
      )}

      <div className="space-y-3">
        {filteredActivities.map((activity) => {
          const myRegistration = getMyRegistration(activity);
          const myCheckin = getMyCheckin(activity);
          const registration = registrations?.find(r => 
            r.id === myRegistration?.id
          );

          // Calculate days until activity
          const daysUntil = Math.ceil(
            (new Date(activity.activity_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          const isToday = daysUntil === 0;
          const isTomorrow = daysUntil === 1;

          return (
            <Card key={activity.id} className="p-4 border border-gray-300 hover:border-black transition-colors">
              <div>
                {/* Minimal Header */}
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-black text-base flex-1">{activity.title}</h3>
                    {isToday && !myCheckin && (
                      <span className="text-xs font-bold">วันนี้</span>
                    )}
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
                      <Badge className="bg-black text-white text-xs">
                        เช็คอินแล้ว
                      </Badge>
                    )}
                  </div>
                </div>

                {activity.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
                )}

                {/* Minimal Details */}
                <div className="space-y-1.5 mb-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {new Date(activity.activity_date).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {daysUntil > 0 && daysUntil <= 7 && (
                        <span className="text-gray-500 ml-2">({daysUntil} วัน)</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{activity.start_time} - {activity.end_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{activity.location}</span>
                  </div>
                  {activity.coaches && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span>โค้ช {activity.coaches.first_name}</span>
                    </div>
                  )}
                </div>

                {/* Minimal Check-in status */}
                {myCheckin && (
                  <div className="mb-3 p-3 bg-gray-50 border border-gray-300 rounded">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <div className="flex-1">
                        <span className="font-medium">
                          {myCheckin.status === 'on_time' ? 'มาตรงเวลา' : 'มาสาย'}
                        </span>
                        <span className="text-gray-600 ml-2">
                          {new Date(myCheckin.checked_in_at).toLocaleTimeString('th-TH', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rejection reason */}
                {registration && registration.rejection_reason && (
                  <div className="mb-3 p-3 bg-gray-50 border border-gray-300 rounded">
                    <div className="text-xs text-gray-700">
                      <span className="font-medium">เหตุผล: </span>
                      {registration.rejection_reason}
                    </div>
                  </div>
                )}

                {/* Coach notes */}
                {registration && registration.coach_notes && registration.status === 'approved' && (
                  <div className="mb-3 p-3 bg-gray-50 border border-gray-300 rounded">
                    <div className="text-xs text-gray-700">
                      <span className="font-medium">โค้ช: </span>
                      {registration.coach_notes}
                    </div>
                  </div>
                )}

                {/* Minimal Action buttons */}
                {type === 'upcoming' && !myCheckin && (
                  <div className="flex gap-2 pt-2 border-t border-gray-200 mt-3">
                    {activity.requires_registration ? (
                      <>
                        {!myRegistration && (
                          <Button
                            onClick={() => handleRegister(activity.id)}
                            disabled={loading === activity.id}
                            size="sm"
                            className="flex-1 bg-black hover:bg-gray-800 text-white"
                          >
                            {loading === activity.id ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
                          </Button>
                        )}
                        {myRegistration?.status === 'pending' && (
                          <Button
                            variant="outline"
                            onClick={() => handleCancelRegistration(myRegistration.id)}
                            disabled={loading === myRegistration.id}
                            size="sm"
                            className="flex-1 border-gray-300"
                          >
                            {loading === myRegistration.id ? 'กำลังยกเลิก...' : 'ยกเลิก'}
                          </Button>
                        )}
                        {myRegistration?.status === 'approved' && (
                          <Button 
                            onClick={() => handleScanQR(activity.id)}
                            size="sm"
                            className="flex-1 bg-black hover:bg-gray-800 text-white"
                          >
                            <QrCode className="w-4 h-4 mr-2" />
                            สแกน QR
                          </Button>
                        )}
                        {myRegistration?.status === 'rejected' && (
                          <div className="flex-1 text-center py-2 text-xs text-gray-500">
                            ไม่ได้รับอนุมัติ
                          </div>
                        )}
                      </>
                    ) : (
                      <Button 
                        onClick={() => handleScanQR(activity.id)}
                        size="sm"
                        className="flex-1 bg-black hover:bg-gray-800 text-white"
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        สแกน QR
                      </Button>
                    )}
                  </div>
                )}

                {/* Registration timestamp */}
                {type === 'registrations' && registration && (
                  <div className="pt-2 border-t border-gray-200 mt-3">
                    <div className="text-xs text-gray-500">
                      {new Date(registration.registered_at).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
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
