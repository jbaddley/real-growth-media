import Provider from "./components/Provider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Inter } from "next/font/google";
import "./globals.css";
import FacebookPixel from "./components/FacebookPixel";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={`${inter.className} h-full scroll-smooth antialiased`}>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <FacebookPixel />
      </head>
      <Provider>
        <body className='flex h-full flex-col'>
          <Header />
          <main className='m-4 grow overflow-auto'>{children}</main>
          <Footer />
        </body>
      </Provider>
    </html>
  );
}
