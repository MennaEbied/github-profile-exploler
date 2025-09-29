import Image from 'next/image';

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

interface UserProfileCardProps {
  user: UserProfile;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div className="p-6">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <Image
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
              width={120}
              height={120}
              className="rounded-full border-4 border-gray-200"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {user.name || user.login}
              </h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                View Profile
              </a>
            </div>
            
            <p className="text-gray-600 mt-1">@{user.login}</p>
            
            {user.bio && <p className="mt-3 text-gray-700">{user.bio}</p>}
            
            <div className="mt-4 flex gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{user.public_repos}</p>
                <p className="text-sm text-gray-600">Public Repos</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{user.followers}</p>
                <p className="text-sm text-gray-600">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800">{user.following}</p>
                <p className="text-sm text-gray-600">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}