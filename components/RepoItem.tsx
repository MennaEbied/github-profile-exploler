interface Repository {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

interface RepoItemProps {
  repo: Repository;
}

export default function RepoItem({ repo }: RepoItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start min-h-[24px]">
        <h4 className="text-base font-semibold text-gray-900 flex-1 mr-2">
          <a 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline truncate"
          >
            {repo.name}
          </a>
        </h4>
        <div className="flex items-center gap-1 min-w-0">
          <span className="flex items-center text-gray-700 text-sm">
            <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {repo.stargazers_count}
          </span>
          {repo.language && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex-shrink-0 truncate">
              {repo.language}
            </span>
          )}
        </div>
      </div>
      
      {repo.description && (
        <p className="text-gray-700 text-sm mt-1.5 flex-grow truncate">{repo.description}</p>
      )}
    </div>
  );
}

export type { Repository };