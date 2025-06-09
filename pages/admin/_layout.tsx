import { Layout, Button, Space } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import type { NextPage } from "next";

const { Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: NextPage<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <Layout>
      <Content style={{ padding: 0, minHeight: '100vh', background: '#f5f5f5' }}>
        <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <Space size="middle">
              <Link href="/admin/students">
                <Button type={router.pathname === '/admin/students' ? 'primary' : 'default'}>
                  Student Details
                </Button>
              </Link>
              <Link href="/admin/billing">
                <Button type={router.pathname === '/admin/billing' ? 'primary' : 'default'}>
                  Billing
                </Button>
              </Link>
              <Link href="/admin/collection">
                <Button type={router.pathname === '/admin/collection' ? 'primary' : 'default'}>
                  Collection
                </Button>
              </Link>
            </Space>
          </div>
          <div className="bg-white rounded-lg shadow" style={{ padding: 0 }}>
            {children}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AdminLayout; 