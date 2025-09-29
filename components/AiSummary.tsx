'use client';

import { useState, useEffect } from 'react';
import { Repository } from './RepoItem';

interface UserProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface AiSummaryProps {
  user: UserProfile;
  repos: Repository[];
}

export default function AiSummary({ user, repos }: AiSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && repos.length > 0) {
      generateSummary();
    }
  }, [user, repos]);

  const generateSummary = async () => {
    if (!user || repos.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            name: user.name,
            bio: user.bio,
            followers: user.followers,
            public_repos: user.public_repos,
          },
          repos: repos.slice(0, 16), // Limit to first 16 repos 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate AI summary');
      }
      
      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Profile Summary</h3>
      {loading && (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 mr-3 border-b-2 border-gray-500"></div>
          <p>Generating AI summary...</p>
        </div>
      )}
      {error && (
        <div className="text-red-600">
          {error}. Please try again later.
        </div>
      )}
      {summary && !loading && (
        <div className="prose max-w-none">
          <p className="text-gray-700">{summary}</p>
        </div>
      )}
    </div>
  );
}