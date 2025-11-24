'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createPerformanceRecord } from '@/lib/coach/performance-actions';
import { Loader2 } from 'lucide-react';

interface Athlete {
  id: string;
  first_name: string;
  last_name: string;
  nickname: string | null;
}

interface PerformanceRecordFormProps {
  athletes: Athlete[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Common test types for sports
const TEST_TYPES = [
  'ความเร็ว (Speed)',
  'ความแข็งแรง (Strength)',
  'ความอดทน (Endurance)',
  'ความยืดหยุ่น (Flexibility)',
  'ความคล่องแคล่ว (Agility)',
  'ทักษะเฉพาะ (Skill)',
  'อื่นๆ (Other)',
];

// Common units
const UNITS = [
  'วินาที (seconds)',
  'นาที (minutes)',
  'เมตร (meters)',
  'กิโลกรัม (kg)',
  'ครั้ง (reps)',
  'คะแนน (points)',
  'เซนติเมตร (cm)',
  'อื่นๆ (other)',
];

export function PerformanceRecordForm({
  athletes,
  onSuccess,
  onCancel,
}: PerformanceRecordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    athleteId: '',
    testType: '',
    testName: '',
    score: '',
    unit: '',
    testDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.athleteId) {
      setError('กรุณาเลือกนักกีฬา');
      return;
    }
    if (!formData.testType) {
      setError('กรุณาเลือกประเภทการทดสอบ');
      return;
    }
    if (!formData.testName.trim()) {
      setError('กรุณากรอกชื่อการทดสอบ');
      return;
    }
    if (!formData.score || isNaN(parseFloat(formData.score))) {
      setError('กรุณากรอกผลคะแนนที่ถูกต้อง');
      return;
    }
    if (!formData.unit) {
      setError('กรุณาเลือกหน่วย');
      return;
    }
    if (!formData.testDate) {
      setError('กรุณาเลือกวันที่ทดสอบ');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createPerformanceRecord({
        athleteId: formData.athleteId,
        testType: formData.testType,
        testName: formData.testName.trim(),
        score: parseFloat(formData.score),
        unit: formData.unit,
        testDate: formData.testDate,
        notes: formData.notes.trim() || undefined,
      });

      if (result.success) {
        // Reset form
        setFormData({
          athleteId: '',
          testType: '',
          testName: '',
          score: '',
          unit: '',
          testDate: new Date().toISOString().split('T')[0],
          notes: '',
        });
        onSuccess?.();
      } else {
        setError(result.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (err) {
      console.error('Error submitting performance record:', err);
      setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Athlete Selection */}
      <div className="space-y-2">
        <Label htmlFor="athlete">นักกีฬา *</Label>
        <Select
          value={formData.athleteId}
          onValueChange={(value) =>
            setFormData({ ...formData, athleteId: value })
          }
        >
          <SelectTrigger id="athlete">
            <SelectValue placeholder="เลือกนักกีฬา" />
          </SelectTrigger>
          <SelectContent>
            {athletes.map((athlete) => (
              <SelectItem key={athlete.id} value={athlete.id}>
                {athlete.first_name} {athlete.last_name}
                {athlete.nickname && ` (${athlete.nickname})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Test Type */}
      <div className="space-y-2">
        <Label htmlFor="testType">ประเภทการทดสอบ *</Label>
        <Select
          value={formData.testType}
          onValueChange={(value) =>
            setFormData({ ...formData, testType: value })
          }
        >
          <SelectTrigger id="testType">
            <SelectValue placeholder="เลือกประเภทการทดสอบ" />
          </SelectTrigger>
          <SelectContent>
            {TEST_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Test Name */}
      <div className="space-y-2">
        <Label htmlFor="testName">ชื่อการทดสอบ *</Label>
        <Input
          id="testName"
          type="text"
          placeholder="เช่น วิ่ง 100 เมตร, ดันพื้น, ฯลฯ"
          value={formData.testName}
          onChange={(e) =>
            setFormData({ ...formData, testName: e.target.value })
          }
          required
        />
      </div>

      {/* Score and Unit */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="score">ผลคะแนน *</Label>
          <Input
            id="score"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.score}
            onChange={(e) =>
              setFormData({ ...formData, score: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">หน่วย *</Label>
          <Select
            value={formData.unit}
            onValueChange={(value) =>
              setFormData({ ...formData, unit: value })
            }
          >
            <SelectTrigger id="unit">
              <SelectValue placeholder="เลือกหน่วย" />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Test Date */}
      <div className="space-y-2">
        <Label htmlFor="testDate">วันที่ทดสอบ *</Label>
        <Input
          id="testDate"
          type="date"
          value={formData.testDate}
          onChange={(e) =>
            setFormData({ ...formData, testDate: e.target.value })
          }
          max={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">หมายเหตุ</Label>
        <Textarea
          id="notes"
          placeholder="บันทึกเพิ่มเติม (ถ้ามี)"
          value={formData.notes}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              กำลังบันทึก...
            </>
          ) : (
            'บันทึกผลการทดสอบ'
          )}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            ยกเลิก
          </Button>
        )}
      </div>
    </form>
  );
}
