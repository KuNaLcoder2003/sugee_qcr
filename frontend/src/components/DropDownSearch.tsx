
import React, { useState } from "react";
import type { Customer } from "../types";
import { useDebounce } from "../hooks/useDebouce"; // adjust path as needed

interface Props {
  items: Customer[];
}

const DropdownSearch: React.FC<Props> = ({ items }) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedWord = useDebounce(searchTerm, 200);

  const filteredItems = items.filter(
    (item) =>
      item.account_number.includes(debouncedWord) ||
      item.cif_number.includes(debouncedWord)
  );

  const handleSelect = (item: Customer) => {
    setSearchTerm(item.name);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search by account number or CIF number..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {showDropdown && filteredItems.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-t-0 border-gray-300 rounded-b-md max-h-48 overflow-y-auto shadow-lg">
          {filteredItems.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100"
            >
              {item.name} ({item.account_number})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownSearch;

