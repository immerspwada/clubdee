'use client';

/**
 * Test Page for SportSelection Component
 * 
 * This page allows you to test the SportSelection component
 * without going through the full registration flow.
 * 
 * Access: http://localhost:3000/test-sport-selection
 */

import { useState } from 'react';
import { SportSelection } from '@/components/membership/SportSelection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestSportSelectionPage() {
  const [selectedClubId, setSelectedClubId] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              🧪 ทดสอบหน้าเลือกชมรม (Sport Selection)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              นี่คือหน้าจอที่นักกีฬาจะเห็นในขั้นตอนที่ 3 ของการสมัครสมาชิก
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>หมายเหตุ:</strong> นี่เป็นหน้าทดสอบเท่านั้น 
                ในการใช้งานจริง หน้านี้จะอยู่ในขั้นตอนที่ 3 ของ /register-membership
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Selected Club Display */}
        {selectedClubId && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <p className="text-green-800 font-medium">
                ✅ คุณเลือกชมรมแล้ว: <code className="bg-green-100 px-2 py-1 rounded">{selectedClubId}</code>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Sport Selection Component */}
        <Card>
          <CardHeader>
            <CardTitle>เลือกกีฬาที่ต้องการสมัคร</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                🏆 เลือกกีฬาที่คุณต้องการสมัคร (เลือกได้ 1 กีฬา)
              </p>
              <p className="text-xs text-blue-700 mt-2">
                โค้ชจะได้รับมอบหมายให้คุณหลังจากการอนุมัติใบสมัคร
              </p>
            </div>

            <SportSelection
              onSelect={setSelectedClubId}
              selectedClubId={selectedClubId}
            />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>วิธีใช้งาน</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </span>
              <p className="text-gray-700">
                <strong>ค้นหาชมรม:</strong> ใช้ช่องค้นหาด้านบนเพื่อกรองชมรมตามชื่อหรือประเภทกีฬา
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </span>
              <p className="text-gray-700">
                <strong>เลือกชมรม:</strong> คลิกที่ Card ของชมรมที่ต้องการ (จะมี Ring สีน้ำเงินและ ✓ เลือกแล้ว)
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </span>
              <p className="text-gray-700">
                <strong>ดูข้อมูล:</strong> แต่ละ Card จะแสดง:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>ชื่อชมรม (เช่น "ฟุตบอล")</li>
                  <li>ประเภทกีฬา (เช่น "กีฬาบอล")</li>
                  <li>คำอธิบาย (ถ้ามี)</li>
                  <li>จำนวนสมาชิก</li>
                  <li>จำนวนโค้ช</li>
                </ul>
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </span>
              <p className="text-gray-700">
                <strong>ไม่มีการเลือกโค้ช:</strong> ตามที่ Spec กำหนด นักกีฬาเลือกแค่ชมรม 
                โค้ชจะถูก assign อัตโนมัติหลังจากการอนุมัติ
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
