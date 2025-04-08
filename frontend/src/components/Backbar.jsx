import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Backbar = () => {
  const router = useRouter();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Back Button */}
          <button 
            onClick={() => router.back()} 
            className="text-gray-700 hover:text-emerald-600 cursor-pointer transition-all duration-300 hover:scale-105"
          >
            ⬅ Back
          </button>
          
          {/* Logo */}
          <h1 className="text-green-700 font-extrabold text-2xl">REVIVO</h1>
        </div>
      </div>
    </nav>
  );
};

export default Backbar;
