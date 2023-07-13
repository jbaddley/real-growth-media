import Provider from './components/Provider'
import Header from './components/Header'
import Footer from './components/Footer'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Simply Put',
  description: 'Simply Put online magazine all about health, wellness, wealth creation, music and lifestyle.',
  icons: {
    icon: {
      url: '/favicon.ico',
      type: 'image/icon'
    }
  },
  shortcut: {
    url: '/favicon.svg',
    type: 'image/svg'
  }
}

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      className={`${inter.className} h-full scroll-smooth antialiased`}
    >
      <body className='flex h-full flex-col'>
        <Provider>
          <Header />
          <main className='grow'>{children}</main>
          <Footer />
        </Provider>
      </body>
    </html>
  )
}
