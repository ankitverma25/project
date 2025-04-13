import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const Backbar = () => {
  const router = useRouter();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-all 
                      duration-300 group px-3 py-2 rounded-lg hover:bg-emerald-50"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline-block text-sm font-medium">Back</span>
          </button>
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-emerald-700 font-bold text-xl sm:text-2xl tracking-tight">
                REVIVO
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Backbar;