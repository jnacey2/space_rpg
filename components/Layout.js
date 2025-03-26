import Head from 'next/head';
import { motion } from 'framer-motion';

const Layout = ({ children, title = 'Space Collectors RPG' }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content="A sci-fi space RPG where you collect characters and battle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="bg-space-black p-4 border-b border-neon-green">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto flex justify-between items-center"
        >
          <h1 className="text-2xl md:text-4xl font-futuristic text-neon-green">
            <span className="text-white">SPACE</span> COLLECTORS
          </h1>
          <nav className="flex gap-4">
            <a href="/" className="text-white hover:text-neon-green transition-colors duration-200">Home</a>
            <a href="/collection" className="text-white hover:text-neon-green transition-colors duration-200">Collection</a>
            <a href="/battle" className="text-white hover:text-neon-green transition-colors duration-200">Battle</a>
          </nav>
        </motion.div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      
      <footer className="bg-space-black p-4 border-t border-neon-green text-center text-white">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Space Collectors RPG</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 