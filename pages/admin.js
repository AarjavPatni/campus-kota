import AdminButtons from "@/components/AdminButtons";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from '@/context/SessionContext';

export default function AdminPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useSession();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <AdminButtons />;
}