'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { createAuditLog } from '@/lib/audit/actions';
import { Database } from '@/types/database.types';

/**
 * Update athlete profile information
 * Allows updating: nickname, phone_number, health_notes, profile_picture
 * Prevents updating: club_id, first_name, last_name, email, date_of_birth, gender
 */
export async function updateAthleteProfile(
  athleteId: string,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'ไม่ได้รับอนุญาต: กรุณาเข้าสู่ระบบ' };
    }

    // Verify the athlete belongs to the current user
    const athleteQuery = await supabase
      .from('athletes')
      .select('*')
      .eq('id', athleteId)
      .maybeSingle();

    if (athleteQuery.error || !athleteQuery.data) {
      return { error: 'ไม่พบข้อมูลนักกีฬา' };
    }

    const athlete = athleteQuery.data as Database['public']['Tables']['athletes']['Row'];

    if (athlete.user_id !== user.id) {
      return { error: 'ไม่ได้รับอนุญาต: คุณไม่สามารถแก้ไขโปรไฟล์ของผู้อื่นได้' };
    }

    // Extract allowed fields from form data
    const nickname = formData.get('nickname') as string | null;
    const phoneNumber = formData.get('phone_number') as string;
    const healthNotes = formData.get('health_notes') as string | null;
    const profilePictureFile = formData.get('profile_picture') as File | null;

    // Validate required fields
    if (!phoneNumber) {
      return { error: 'กรุณากรอกเบอร์โทรศัพท์' };
    }

    // Validate phone number format (Thai phone number)
    const phoneRegex = /^[0-9]{9,10}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[-\s]/g, ''))) {
      return { error: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง' };
    }

    let profilePictureUrl = null;

    // Handle profile picture upload if provided
    if (profilePictureFile && profilePictureFile.size > 0) {
      // Validate file type
      if (!profilePictureFile.type.startsWith('image/')) {
        return { error: 'กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น' };
      }

      // Validate file size (max 5MB)
      if (profilePictureFile.size > 5 * 1024 * 1024) {
        return { error: 'ขนาดไฟล์ต้องไม่เกิน 5MB' };
      }

      // Generate unique filename
      const fileExt = profilePictureFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, profilePictureFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return { error: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ' };
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      profilePictureUrl = publicUrl;
    }

    // Prepare update data (only allowed fields)
    const updateData: Database['public']['Tables']['athletes']['Update'] = {
      nickname: nickname || null,
      phone_number: phoneNumber,
      health_notes: healthNotes || null,
    };

    // Add profile picture URL if uploaded
    if (profilePictureUrl) {
      updateData.profile_picture_url = profilePictureUrl;
    }

    // Update athlete profile
    const { error: updateError } = await supabase
      .from('athletes')
      // @ts-ignore - TypeScript has issues with the update type inference
      .update(updateData)
      .eq('id', athleteId);

    if (updateError) {
      console.error('Update error:', updateError);
      return { error: 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์' };
    }

    // Log audit event
    await createAuditLog({
      userId: user.id,
      actionType: 'athlete.update',
      entityType: 'athlete',
      entityId: athleteId,
      details: updateData,
    });

    // Revalidate the profile page
    revalidatePath('/dashboard/athlete/profile');
    revalidatePath('/dashboard/athlete/profile/edit');

    return { success: true };
  } catch (error) {
    console.error('Unexpected error in updateAthleteProfile:', error);
    return { error: 'เกิดข้อผิดพลาดที่ไม่คาดคิด' };
  }
}

/**
 * Get athlete profile by user ID
 */
export async function getAthleteProfile(userId: string) {
  try {
    const supabase = await createClient();

    const { data: athlete, error } = await supabase
      .from('athletes')
      .select(
        `
        *,
        clubs (
          id,
          name,
          description,
          sport_type
        )
      `
      )
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching athlete profile:', error);
      return { error: 'ไม่พบข้อมูลโปรไฟล์' };
    }

    return { data: athlete };
  } catch (error) {
    console.error('Unexpected error in getAthleteProfile:', error);
    return { error: 'เกิดข้อผิดพลาดที่ไม่คาดคิด' };
  }
}
