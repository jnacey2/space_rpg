import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Layout = ({ children, title = 'Stellar Vanguard' }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Stellar Vanguard: An epic sci-fi tactical RPG" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="bg-space-black p-4 shadow-lg">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-futuristic text-neon-green hover:text-neon-green/80">
            Stellar Vanguard
          </Link>
          <div className="space-x-4">
            <Link href="/collection" className="text-white hover:text-neon-green">
              Collection
            </Link>
            <Link href="/battle" className="text-white hover:text-neon-green">
              Battle
            </Link>
          </div>
        </nav>
      </header>
      
      <main className="flex-grow bg-space-black text-white">
        {children}
      </main>
      
      <footer className="bg-space-black text-gray-400 p-4 text-center border-t border-white/10">
        <p>© {new Date().getFullYear()} Stellar Vanguard</p>
      </footer>
    </div>
  );
};

export default Layout; 