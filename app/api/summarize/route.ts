/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { user, repos } = await request.json();
    const languages = repos
      .filter((repo: any) => repo.language)
      .map((repo: any) => repo.language)
      .filter((lang: string, index: number, arr: string[]) => arr.indexOf(lang) === index) 
      .slice(0, 3) // limit to first 3
      .join(', ') || 'various technologies';
      
    const totalStars = repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
    const mostStarredRepo = repos.length > 0 
      ? repos.reduce((max: any, repo: any) => repo.stargazers_count > max.stargazers_count ? repo : max, repos[0])
      : null;

    const summary = `This GitHub user has ${user.public_repos} public repositories and ${user.followers} followers. ` +
      `They primarily work with ${languages}. ` +
      `Their most popular repository is ${mostStarredRepo ? mostStarredRepo.name : 'N/A'} with ${mostStarredRepo ? mostStarredRepo.stargazers_count : 0} stars. ` +
      `In total, their repositories have accumulated ${totalStars} stars, indicating a moderate level of community engagement. ` +
      `Their profile suggests activity in ${repos.length > 0 ? 'software development' : 'various projects'} across multiple programming domains.`;

    return new Response(
      JSON.stringify({ 
        summary 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error generating AI summary:', error);
        const fallbackSummary = `This user has public repositories with followers. Their profile shows activity in various projects, contributing to the open-source community with diverse technologies and programming languages. The user maintains an active presence on GitHub with regular contributions to their repositories.`;
    return new Response(
      JSON.stringify({ 
        summary: fallbackSummary
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}