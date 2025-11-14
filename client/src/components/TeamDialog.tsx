import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, LogIn, Copy } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';

interface TeamDialogProps {
  onTeamCreated: () => void;
}

export default function TeamDialog({ onTeamCreated }: TeamDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const { toast } = useToast();

  const createTeamMutation = useMutation({
    mutationFn: async (name: string) => {
      return await apiRequest('POST', '/api/teams', { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      toast({
        title: "Team created",
        description: "Your team has been created successfully",
      });
      setTeamName('');
      setIsOpen(false);
      onTeamCreated();
    },
    onError: (error: any) => {
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
        description: "Failed to create team",
        variant: "destructive",
      });
    },
  });

  const joinTeamMutation = useMutation({
    mutationFn: async (code: string) => {
      return await apiRequest('POST', '/api/teams/join', { inviteCode: code });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      toast({
        title: "Joined team",
        description: "You've successfully joined the team",
      });
      setInviteCode('');
      setIsOpen(false);
      onTeamCreated();
    },
    onError: (error: any) => {
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
        description: "Failed to join team. Check your invite code.",
        variant: "destructive",
      });
    },
  });

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim()) {
      createTeamMutation.mutate(teamName.trim());
    }
  };

  const handleJoinTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteCode.trim()) {
      joinTeamMutation.mutate(inviteCode.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" data-testid="button-open-team-dialog">
          <Users className="w-4 h-4" />
          Teams
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" data-testid="dialog-team">
        <DialogHeader>
          <DialogTitle className="font-heading">Manage Teams</DialogTitle>
          <DialogDescription>
            Create a new team or join an existing one with an invite code
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" data-testid="tab-create-team">Create Team</TabsTrigger>
            <TabsTrigger value="join" data-testid="tab-join-team">Join Team</TabsTrigger>
          </TabsList>
          <TabsContent value="create" className="space-y-4">
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  placeholder="My Awesome Team"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  data-testid="input-team-name"
                />
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="w-full gap-2"
                  disabled={createTeamMutation.isPending}
                  data-testid="button-create-team"
                >
                  <Plus className="w-4 h-4" />
                  Create Team
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          <TabsContent value="join" className="space-y-4">
            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-code">Invite Code</Label>
                <Input
                  id="invite-code"
                  placeholder="Enter invite code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  data-testid="input-invite-code"
                />
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="w-full gap-2"
                  disabled={joinTeamMutation.isPending}
                  data-testid="button-join-team-submit"
                >
                  <LogIn className="w-4 h-4" />
                  Join Team
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
