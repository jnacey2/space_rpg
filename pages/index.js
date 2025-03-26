import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout title="Stellar Vanguard - Home">
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-futuristic mb-6 text-neon-green">
            <span className="text-white">STELLAR</span> VANGUARD
          </h1>
          
          <p className="text-xl mb-8 text-gray-300">
            Explore the cosmos, collect powerful allies, and battle through an expansive sci-fi universe.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="sci-fi-border p-6 bg-space-black/70 backdrop-blur-sm rounded-lg">
              <h3 className="text-xl font-futuristic mb-3 text-alien-orange">COLLECT</h3>
              <p className="text-gray-300">Discover and recruit powerful alien species, androids, and cosmic entities to join your team.</p>
            </div>
            
            <div className="sci-fi-border p-6 bg-space-black/70 backdrop-blur-sm rounded-lg">
              <h3 className="text-xl font-futuristic mb-3 text-stellar-purple">CUSTOMIZE</h3>
              <p className="text-gray-300">Level up your characters, unlock new abilities, and strategically build your ultimate team.</p>
            </div>
            
            <div className="sci-fi-border p-6 bg-space-black/70 backdrop-blur-sm rounded-lg">
              <h3 className="text-xl font-futuristic mb-3 text-cosmic-blue">BATTLE</h3>
              <p className="text-gray-300">Engage in strategic turn-based combat against alien foes and rival factions across the galaxy.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link href="/collection">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-cosmic-blue text-white rounded-md text-xl font-futuristic"
              >
                View Collection
              </motion.button>
            </Link>
            
            <Link href="/battle">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-neon-green text-space-black rounded-md text-xl font-futuristic"
              >
                Start Battle
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
} 