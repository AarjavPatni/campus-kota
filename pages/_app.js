import Layout from "@/components/Layout";
import "@/styles/globals.css";
import '@/components/ui/Carousel/css/sandbox.css'
import '@/components/ui/Carousel/css/embla.css'
import 'flowbite/dist/flowbite.css';

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
