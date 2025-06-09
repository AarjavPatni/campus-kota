import { AppProps } from "next/app";
import { RefineProvider } from "@/app/refine";
import Layout from "@/components/Layout";
import "@refinedev/antd/dist/reset.css";
import "@/styles/globals.css";
import '@/components/ui/Carousel/css/sandbox.css';
import '@/components/ui/Carousel/css/embla.css';
import 'flowbite/dist/flowbite.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RefineProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RefineProvider>
  );
}

export default MyApp; 