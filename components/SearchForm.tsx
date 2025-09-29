'use client';

import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (username: string) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-700 text-gray-900 placeholder-gray-700"
          disabled={loading}
        />
        <button
          type="submit"
          className={`px-6 py-2 rounded-lg text-white font-medium ${
            loading 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gray-900 hover:bg-gray-800'
          }`}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}