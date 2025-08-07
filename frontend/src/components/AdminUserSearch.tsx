import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import type { Member } from '../types';

interface SearchBarDropdownProps {
    placeholder?: string;
    items: Member[];
    setSearchValue: React.Dispatch<React.SetStateAction<string>>
}


const SearchBarDropdown: React.FC<SearchBarDropdownProps> = ({
    placeholder = 'Search...',
    items,
    setSearchValue
}) => {
    const [query, setQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState<Member[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFilteredItems(
            items.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase())
            )
        );
    }, [query, items]);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className='w-[50%] flex items-center justify-between'>

            <div className="relative w-full max-w-md mx-auto" ref={containerRef}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                        setSearchValue(e.target.value)
                    }}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out shadow-sm"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />

                {showDropdown && filteredItems.length > 0 && (
                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto transition-all duration-200 ease-in-out">
                        {filteredItems.map((item, idx) => (
                            <li
                                key={idx}
                                className="px-4 py-2 hover:bg-green-100 cursor-pointer text-sm text-gray-700 rounded-md"
                                onClick={() => {
                                    setQuery(item.name);
                                    setSearchValue(item.name)
                                    setShowDropdown(false);
                                }}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {
                showDropdown ? <div className='flex items-center justify-center'>
                    <X className='cursor-pointer' onClick={()=>setShowDropdown(false)} />
                </div> : null
            }
        </div>
    );
};

export default SearchBarDropdown;

