import AdminButtons from "@/components/AdminButtons";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <>
      <p className="text-white text-center mt-4">Welcome {user.name}</p>
      <AdminButtons />
    </>
  );
}