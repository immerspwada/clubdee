# แก้ปัญหา "Database error querying schema" ขั้นสุดท้าย

## สาเหตุ
Supabase Auth API ไม่สามารถ query database schema ได้ เนื่องจาก:
1. Database schema ไม่สมบูรณ์
2. RLS policies บล็อกการเข้าถึง
3. Auth schema มีปัญหา

## วิธีแก้ (เลือก 1 วิธี)

### วิธีที่ 1: Reset Supabase Project (แนะนำ)
1. ไปที่ Supabase Dashboard
2. Settings → General → Danger Zone
3. คลิก "Pause project" แล้ว "Resume project"
4. หรือสร้าง project ใหม่เลย

### วิธีที่ 2: ใช้ Supabase CLI Reset
```bash
cd sports-club-management
npx supabase db reset --linked
```

### วิธีที่ 3: ลบ RLS Policies ทั้งหมด
รัน SQL นี้ใน Supabase Dashboard:

```sql
-- ลบ RLS policies ทั้งหมด
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(r.schemaname) || '.' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY';
    END LOOP;
END $$;

-- ตรวจสอบ
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

### วิธีที่ 4: ใช้ Service Role Key
แก้ไข `lib/supabase/server.ts` ให้ใช้ service role:

```typescript
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // ใช้ service role แทน anon key
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

## หลังจากแก้แล้ว
1. รีสตาร์ท dev server
2. ลอง login อีกครั้ง
3. ถ้ายังไม่ได้ ให้สร้าง Supabase project ใหม่
