import Layout from "@/components/Layout";
import "@/styles/globals.css";
import '@/components/ui/Carousel/css/sandbox.css'
import '@/components/ui/Carousel/css/embla.css'
import 'flowbite/dist/flowbite.css';
import { StudentProvider } from '@/context/StudentContext';
import { SessionProvider } from '@/context/SessionContext';

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider>
      <Layout>
        <StudentProvider>
          <Component {...pageProps} />
        </StudentProvider>
      </Layout>
    </SessionProvider>
  );
}
