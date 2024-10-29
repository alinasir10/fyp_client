'use client';

import {useUserStore} from "@/store/userStore";

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Badge} from '@/components/ui/badge';
import LogoutButton from "@/components/auth/logout";

export default function Home() {
  const user = useUserStore(state => state.user)

  const getInitials = (name: string | undefined) => {
    if (!name) {
      return 'CN'
    }
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-blue-400'>
      <Card className="w-full max-w-xs p-2 rounded-lg">
        <CardHeader className="p-2">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profileUrl} alt={`${user?.username}'s profile`} />
              <AvatarFallback className="text-sm">
                {getInitials(user?.username)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-medium truncate">{user?.username}</h2>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <Badge
              variant={user?.isVerified ? 'success' : 'destructive'}
              className="text-[10px] py-0.5 px-1.5"
            >
              {user?.isVerified ? 'Verified' : 'Not Verified'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-2">
          <div className="space-x-4 flex items-center">
            <div className="flex items-center text-xs">
              <span className="text-gray-500">Provider:</span>
              <Badge variant="secondary" className="ml-1 text-[10px] py-0.5 px-1.5">
                {user?.oauthProvider}
              </Badge>
            </div>
            <div className="flex items-center text-xs">
              <span className="text-gray-500">ID:</span>
              <code className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">
                {user?.id}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
      <LogoutButton/>
    </div>
  );
}
