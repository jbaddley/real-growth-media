import Provider from "./components/Provider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pro Peak AI",
  description: "Pro Peak AI - A simple tool for creating contextual marketing materials",
  icons: {
    icon: {
      url: "/assets/favicon.ico",
      type: "image/icon",
    },
  },
  shortcut: {
    url: "/assets/favicon.svg",
    type: "image/svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={`${inter.className} h-full scroll-smooth antialiased`}>
      <head>
        <link rel='icon' href='/assets/favicon.ico' sizes='any' />
      </head>
      <body className='flex h-full flex-col'>
        <Provider>
          <Header />
          <main className='container my-8 grow'>{children}</main>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
