import { MobileSidebar } from '@/components/athlete/MobileSidebar';
import { BottomNav } from '@/components/athlete/BottomNav';

export default function AthleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MobileSidebar />
      <main className="pt-16 px-4 pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
