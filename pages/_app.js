import Layout from "@/components/Layout";
import "@/styles/globals.css";
import '@/components/ui/Carousel/css/sandbox.css'
import '@/components/ui/Carousel/css/embla.css'
import 'flowbite/dist/flowbite.css';
import { StudentProvider } from '@/context/StudentContext';
import RequireAuth from '@/components/RequireAuth';

export default function App({ Component, pageProps }) {
  const isPublic = Component.publicPage;
  return (
      <StudentProvider>
        {isPublic ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <RequireAuth>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </RequireAuth>
        )}
      </StudentProvider>
  );
}
