import Provider from "./components/Provider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { Router } from "next/router";

function FacebookPixel() {
  useEffect(() => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(process.env.FACEBOOKPIXEL_ID);
        ReactPixel.pageView();

        Router.events.on("routeChangeComplete", () => {
          ReactPixel.pageView();
        });
      });
  });
  return null;
}
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pro Peak AI",
  description: "Pro Peak AI - A simple tool for creating contextual marketing materials",
  icons: {
    icon: {
      url: "/favicon.ico",
      type: "image/icon",
    },
  },
  shortcut: {
    url: "/favicon.svg",
    type: "image/svg",
  },
};

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
