
import React from 'react';
import { Search } from 'lucide-react';

export const SearchButton = () => {
  const handleSearch = () => {
    // Placeholder for search functionality
    console.log('Search clicked');
  };

  return (
    <button 
      onClick={handleSearch} 
      className="text-muted-foreground hover:text-primary"
    >
      <Search className="h-5 w-5" />
    </button>
  );
};
