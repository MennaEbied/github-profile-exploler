/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';

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

interface Repository {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  forks_count: number;
}

interface ComparisonData {
  user1: UserProfile | null;
  user2: UserProfile | null;
  repos1: Repository[];
  repos2: Repository[];
  loading: boolean;
  error: string | null;
}

export default function ComparePage() {
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');
  const [comparisonData, setComparisonData] = useState<ComparisonData>({
    user1: null,
    user2: null,
    repos1: [],
    repos2: [],
    loading: false,
    error: null
  });

  const handleCompare = async () => {
    setComparisonData(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      // fetch data for both users
      const [user1Response, user2Response] = await Promise.allSettled([
        fetch(`https://api.github.com/users/${username1}`),
        fetch(`https://api.github.com/users/${username2}`)
      ]);

      if (user1Response.status === 'rejected' || user2Response.status === 'rejected') {
        throw new Error('Failed to fetch user data');
      }

      const [user1Result, user2Result] = await Promise.allSettled([
        user1Response.value.json(),
        user2Response.value.json()
      ]);

      if (user1Result.status === 'rejected' || user2Result.status === 'rejected') {
        throw new Error('Failed to process user data');
      }

      const user1 = user1Result.value as UserProfile;
      const user2 = user2Result.value as UserProfile;

      // Fetch repos for both users
      const [repos1Response, repos2Response] = await Promise.allSettled([
        fetch(`https://api.github.com/users/${username1}/repos`),
        fetch(`https://api.github.com/users/${username2}/repos`)
      ]);

      if (repos1Response.status === 'rejected' || repos2Response.status === 'rejected') {
        throw new Error('Failed to fetch repositories');
      }

      const [repos1Result, repos2Result] = await Promise.allSettled([
        repos1Response.value.json(),
        repos2Response.value.json()
      ]);

      if (repos1Result.status === 'rejected' || repos2Result.status === 'rejected') {
        throw new Error('Failed to process repositories');
      }

      const repos1FromAPI = repos1Result.value;
      const repos2FromAPI = repos2Result.value;
      const repos1: Repository[] = repos1FromAPI.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
        html_url: repo.html_url,
        forks_count: repo.forks_count
      }));
      const repos2: Repository[] = repos2FromAPI.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
        html_url: repo.html_url,
        forks_count: repo.forks_count
      }));

      // Calculate aggregate metrics
      const totalstargazers1 = repos1.reduce((acc, repo) => acc + repo.stargazers_count, 0);
      const totalForks1 = repos1.reduce((acc, repo) => acc + (repo.forks_count || 0), 0);
      const avgstargazers1 = repos1.length > 0 ? totalstargazers1 / repos1.length : 0;

      const totalstargazers2 = repos2.reduce((acc, repo) => acc + repo.stargazers_count, 0);
      const totalForks2 = repos2.reduce((acc, repo) => acc + (repo.forks_count || 0), 0);
      const avgstargazers2 = repos2.length > 0 ? totalstargazers2 / repos2.length : 0;

      setComparisonData({
        user1,
        user2,
        repos1,
        repos2,
        loading: false,
        error: null
      });
      setCalculatedMetrics({
        totalstargazers1: totalstargazers1,
        totalstargazers2: totalstargazers2,
        totalForks1,
        totalForks2,
        avgstargazers1: avgstargazers1,
        avgstargazers2: avgstargazers2
      });
    } catch (err) {
      setComparisonData(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'An unknown error occurred'
      }));
    }
  };

  const [calculatedMetrics, setCalculatedMetrics] = useState({
    totalstargazers1: 0,
    totalstargazers2: 0,
    totalForks1: 0,
    totalForks2: 0,
    avgstargazers1: 0,
    avgstargazers2: 0
  });

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Compare GitHub Profiles</h1>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="username1" className="block text-sm font-medium text-gray-700 mb-1">
                First Username
              </label>
              <input
                type="text"
                id="username1"
                value={username1}
                onChange={(e) => setUsername1(e.target.value)}
                placeholder="Enter GitHub username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-700 text-gray-900 placeholder-gray-700"
              />
            </div>
            <div>
              <label htmlFor="username2" className="block text-sm font-medium text-gray-700 mb-1">
                Second Username
              </label>
              <input
                type="text"
                id="username2"
                value={username2}
                onChange={(e) => setUsername2(e.target.value)}
                placeholder="Enter GitHub username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-700 text-gray-900 placeholder-gray-700"
              />
            </div>
          </div>
          <button
            onClick={handleCompare}
            disabled={comparisonData.loading || !username1 || !username2}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              comparisonData.loading || !username1 || !username2
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {comparisonData.loading ? 'Comparing...' : 'Compare Users'}
          </button>
        </div>

        {comparisonData.error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {comparisonData.error}
          </div>
        )}

        {comparisonData.loading && (
          <div className="mt-6 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
          </div>
        )}

        {comparisonData.user1 && comparisonData.user2 && !comparisonData.loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/*first user */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={comparisonData.user1.avatar_url}
                    alt={`${comparisonData.user1.login}'s avatar`}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {comparisonData.user1.name || comparisonData.user1.login}
                    </h2>
                    <p className="text-gray-800">@{comparisonData.user1.login}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-lg font-bold text-gray-800">{comparisonData.user1.public_repos}</p>
                    <p className="text-xs text-gray-600">Repos</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-lg font-bold text-gray-800">{comparisonData.user1.followers}</p>
                    <p className="text-xs text-gray-600">Followers</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-lg font-bold text-gray-800">{comparisonData.user1.following}</p>
                    <p className="text-xs text-gray-600">Following</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Repository Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-800">Total stargazers:</span>
                      <span className="font-medium text-gray-900">{calculatedMetrics.totalstargazers1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Total Forks:</span>
                      <span className="font-medium text-gray-900">{calculatedMetrics.totalForks1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Avg stargazers/Repo:</span>
                      <span className="font-medium text-gray-900">{calculatedMetrics.avgstargazers1.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* second user */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={comparisonData.user2.avatar_url}
                    alt={`${comparisonData.user2.login}'s avatar`}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {comparisonData.user2.name || comparisonData.user2.login}
                    </h2>
                    <p className="text-gray-800">@{comparisonData.user2.login}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-lg font-bold text-gray-800">{comparisonData.user2.public_repos}</p>
                    <p className="text-xs text-gray-600">Repos</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-lg font-bold text-gray-800">{comparisonData.user2.followers}</p>
                    <p className="text-xs text-gray-600">Followers</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-lg font-bold text-gray-800">{comparisonData.user2.following}</p>
                    <p className="text-xs text-gray-600">Following</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Repository Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-800">Total stargazers:</span>
                      <span className="font-medium text-gray-900">{calculatedMetrics.totalstargazers2}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Total Forks:</span>
                      <span className="font-medium text-gray-900">{calculatedMetrics.totalForks2}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800">Avg stargazers/Repo:</span>
                      <span className="font-medium text-gray-900">{calculatedMetrics.avgstargazers2.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}