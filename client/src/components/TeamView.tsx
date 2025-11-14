import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, Award, LogOut } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import type { User } from '@shared/schema';

interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  joinedAt: Date;
  user: User;
}

interface TeamLog {
  id: string;
  userId: string;
  exerciseName: string;
  emoji: string;
  difficulty: string;
  status: string;
  completedAt: Date;
  user: User;
}

interface TeamStats {
  userId: string;
  name: string;
  total: number;
  streak: number;
  profileImageUrl?: string;
}

interface TeamViewProps {
  teamId: string;
  teamName: string;
  onLeave: () => void;
}

export default function TeamView({ teamId, teamName, onLeave }: TeamViewProps) {
  const { toast } = useToast();

  const { data: members = [] } = useQuery<TeamMember[]>({
    queryKey: ['/api/teams', teamId, 'members'],
  });

  const { data: logs = [] } = useQuery<TeamLog[]>({
    queryKey: ['/api/teams', teamId, 'logs'],
  });

  // Calculate stats for each member
  const memberStats: TeamStats[] = members.map(member => {
    const memberLogs = logs.filter(log => log.userId === member.userId);
    const completed = memberLogs.filter(log => log.status === 'completed');
    
    // Calculate streak
    const uniqueDates = Array.from(new Set(
      completed.map(log => new Date(log.completedAt).toDateString())
    ));
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      if (uniqueDates.includes(checkDate.toDateString())) {
        streak++;
      } else {
        break;
      }
    }

    const displayName = member.user.firstName && member.user.lastName
      ? `${member.user.firstName} ${member.user.lastName}`
      : member.user.email || 'Team Member';

    return {
      userId: member.userId,
      name: displayName,
      total: completed.length,
      streak,
      profileImageUrl: member.user.profileImageUrl || undefined,
    };
  }).sort((a, b) => b.total - a.total);

  const handleLeave = async () => {
    try {
      await apiRequest('DELETE', `/api/teams/${teamId}/leave`);
      toast({
        title: "Left team",
        description: "You've successfully left the team",
      });
      onLeave();
    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to leave team",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6" data-testid="view-team">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center">
            <Users className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold" data-testid="text-team-name">{teamName}</h2>
            <p className="text-sm text-muted-foreground">{members.length} members</p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleLeave} className="gap-2" data-testid="button-leave-team">
          <LogOut className="w-4 h-4" />
          Leave Team
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-4">
                {memberStats.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No team members yet</p>
                  </div>
                ) : (
                  memberStats.map((stat, index) => (
                    <Card key={stat.userId} className="hover-elevate" data-testid={`card-member-${index}`}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="text-2xl font-heading font-bold text-muted-foreground w-8">
                          #{index + 1}
                        </div>
                        <Avatar>
                          <AvatarImage src={stat.profileImageUrl} className="object-cover" />
                          <AvatarFallback>{stat.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold" data-testid="text-member-name">{stat.name}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{stat.total} exercises</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {stat.streak} day streak
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-4">
                {logs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No activity yet</p>
                  </div>
                ) : (
                  logs.slice(0, 50).map((log) => {
                    const displayName = log.user.firstName && log.user.lastName
                      ? `${log.user.firstName} ${log.user.lastName}`
                      : log.user.email || 'Team Member';
                    
                    return (
                      <Card key={log.id} className="hover-elevate" data-testid={`log-${log.id}`}>
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="text-3xl">{log.emoji}</div>
                          <div className="flex-1">
                            <p className="font-semibold" data-testid="text-log-exercise">{log.exerciseName}</p>
                            <p className="text-sm text-muted-foreground">{displayName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.completedAt).toLocaleString()}
                            </p>
                          </div>
                          <Badge 
                            variant={log.status === 'completed' ? 'default' : 'secondary'}
                            data-testid={`badge-log-status-${log.status}`}
                          >
                            {log.status}
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
