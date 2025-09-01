import { useBoardStore } from '@/store/boardStore';
import { 
  FaSun, 
  FaRegMoon
} from 'react-icons/fa';
import { RiRefreshFill } from 'react-icons/ri';

export function Header() {
  const { loadInitialData, theme, toggleTheme, searchTerm, setSearchTerm } = useBoardStore();

  return (
    <header className="p-4 flex justify-between items-center bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <input
        type="text"
        placeholder="Search tickets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-2 py-1 rounded border bg-gray-200 dark:bg-gray-700"
      />
      <div className='flex'>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <FaSun className="w-6 h-6" /> : <FaRegMoon className="w-6 h-6" />}
        </button>
        
        <button onClick={loadInitialData} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <RiRefreshFill className="w-7 h-7" />
        </button>
      </div>
    </header>
  );
};