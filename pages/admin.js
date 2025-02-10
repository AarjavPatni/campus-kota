import AdminButtons from "@/components/AdminButtons";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/supabaseClient';

export default function BillingListPage() {
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (!session) router.push('/auth/login');
        };
        checkSession();
    }, []);

    return <AdminButtons />
}