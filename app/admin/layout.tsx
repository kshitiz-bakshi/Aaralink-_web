'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const nav = [
  { href: '/admin/referrals', label: 'Referrals' },
  { href: '/admin/partners', label: 'AaraPartners' },
  { href: '/admin/payouts', label: 'Payouts' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [adminName, setAdminName] = useState('');

  const isLoginPage = path === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/admin/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type, full_name')
        .eq('id', session.user.id)
        .single();

      if (profile?.user_type !== 'admin') {
        await supabase.auth.signOut();
        router.replace('/admin/login');
        return;
      }

      setAdminName(profile.full_name || session.user.email || 'Admin');
      setChecking(false);
    };

    check();
  }, [path, isLoginPage, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  // Login page renders without the shell
  if (isLoginPage) return <>{children}</>;

  // Show nothing while verifying auth
  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Verifying access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-blue-600">Aaralink</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-500">Admin Console</span>
        </div>
        <nav className="flex gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                path.startsWith(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{adminName}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Sign Out
          </button>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
