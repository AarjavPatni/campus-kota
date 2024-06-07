import Head from "next/head"
import Footer from "./ui/Footer"
import Navbar from "./ui/Navbar"
import Script from "next/script"

const Layout = ({ children }) => {
    return (
        <>
            <Head>
                <title>Campus Kota</title>
                <meta name='description' content="A student hostel located in India's education hub with close proximity to the Allen coaching center. We ensure the best living experience for your child." />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <Script id="crisp-chat" strategy="afterInteractive">
                {`
                    window.$crisp=[];
                    window.CRISP_WEBSITE_ID="29d8c83f-6022-4b41-87ad-e2e9c5a18bf4";
                    (
                        function(){
                            d=document;
                            s=d.createElement("script");
                            s.src="https://client.crisp.chat/l.js";
                            s.async=1;d.getElementsByTagName("head")[0].appendChild(s);
                            }
                    )();
                `}
            </Script>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    )
}

export default Layout