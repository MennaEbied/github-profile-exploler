/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import UserProfileCard from '@/components/UserProfileCard';
import RepoList from '@/components/RepoList';
import NotesSection from '@/components/NotesSection';
import AiSummary from '@/components/AiSummary';

interface Repository {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

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

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (username: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch user profile
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          throw new Error('User not found');
        }
        throw new Error('Failed to fetch user data');
      }
      const userData: UserProfile = await userResponse.json();
      setUser(userData);

      // Fetch user repositories
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!reposResponse.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const reposDataFromAPI = await reposResponse.json();
      const reposData: Repository[] = reposDataFromAPI.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
        html_url: repo.html_url
      }));
      setRepos(reposData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">GitHub Profile Explorer</h1>
        
        <SearchForm onSearch={handleSearch} loading={loading} />
        
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {loading && (
          <div className="mt-6 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
          </div>
        )}
        
        {user && !loading && (
          <>
            <UserProfileCard user={user} />
            <NotesSection username={user.login} />
            <AiSummary user={user} repos={repos} />
            <RepoList repos={repos} />
          </>
        )}
      </div>
    </div>
  );
}