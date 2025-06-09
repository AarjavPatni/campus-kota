import { useEffect } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import AdminLayout from "./_layout";

const AdminPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/students");
  }, [router]);

  return (
    <AdminLayout>
      <div>Redirecting to students page...</div>
    </AdminLayout>
  );
};

export default AdminPage; 