import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Team } from '@shared/schema';

interface TeamListProps {
  teams: Team[];
  onSelectTeam: (team: Team) => void;
  selectedTeamId?: string;
}

export default function TeamList({ teams, onSelectTeam, selectedTeamId }: TeamListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const copyInviteCode = async (code: string, teamId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(teamId);
      toast({
        title: "Copied!",
        description: "Invite code copied to clipboard",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy invite code",
        variant: "destructive",
      });
    }
  };

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">No teams yet</p>
        <p className="text-sm text-muted-foreground">Create or join a team to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {teams.map((team) => (
        <Card 
          key={team.id} 
          className={`hover-elevate cursor-pointer ${selectedTeamId === team.id ? 'ring-2 ring-primary' : ''}`}
          onClick={() => onSelectTeam(team)}
          data-testid={`card-team-${team.id}`}
        >
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" data-testid="text-team-list-name">{team.name}</p>
                <p className="text-sm text-muted-foreground font-mono truncate">
                  Code: {team.inviteCode}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                copyInviteCode(team.inviteCode, team.id);
              }}
              data-testid={`button-copy-code-${team.id}`}
            >
              {copiedId === team.id ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
