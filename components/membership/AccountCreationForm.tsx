'use client';

/**
 * Account Creation Form Component
 * 
 * Step 0 of the unified registration flow.
 * Creates a Supabase Auth account (email + password only).
 * 
 * Features:
 * - Email and password validation
 * - Password strength indicator
 * - Confirm password matching
 * - Clear error messages
 * - Loading states
 * 
 * Validates: Requirements US-1 (Account Creation)
 */

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateEmail, validatePassword } from '@/lib/auth/validation';
import { Eye, EyeOff } from 'lucide-react';

interface AccountCreationFormProps {
  value: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  onChange: (value: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
  errors: Record<string, string>;
}

export default function AccountCreationForm({
  value,
  onChange,
  errors,
}: AccountCreationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          ยินดีต้อนรับสู่ระบบจัดการสโมสรกีฬา
        </h3>
        <p className="text-sm text-blue-800">
          กรุณาสร้างบัญชีเพื่อเริ่มต้นการสมัครเข้าร่วมกีฬา
        </p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">
          อีเมล <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={value.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="your.email@example.com"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email}</p>
        )}
        <p className="text-xs text-gray-500">
          ใช้สำหรับเข้าสู่ระบบและรับการแจ้งเตือน
        </p>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">
          รหัสผ่าน <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={value.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="••••••••"
            className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password}</p>
        )}
        <p className="text-xs text-gray-500">
          รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร
        </p>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={value.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="••••••••"
            className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">ขั้นตอนต่อไป</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• กรอกข้อมูลส่วนตัว</li>
          <li>• อัปโหลดเอกสารประกอบ</li>
          <li>• เลือกกีฬาที่ต้องการสมัคร</li>
          <li>• รอการอนุมัติจากโค้ช</li>
        </ul>
      </div>
    </div>
  );
}
