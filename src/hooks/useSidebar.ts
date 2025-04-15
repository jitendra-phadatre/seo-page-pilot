
import { useState } from 'react';

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(prevState => !prevState);
  };

  return { isOpen, toggleSidebar };
};
