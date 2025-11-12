import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface PatientSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function PatientSearch({
  onSearch,
  placeholder = 'Search by name, patient ID, or phone...',
}: PatientSearchProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Debounce search to avoid excessive filtering
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
