import { StudentList } from "@/components/StudentList";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/supabaseClient';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/auth/login');
    };
    checkSession();
  }, []);

  return (
    <div>
      <StudentList />
    </div>
  );
}
