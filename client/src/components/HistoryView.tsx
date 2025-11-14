import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Award } from 'lucide-react';

interface ExerciseHistoryItem {
  id: string;
  exerciseName: string;
  emoji: string;
  timestamp: Date;
  status: 'completed' | 'skipped';
}

interface HistoryViewProps {
  history: ExerciseHistoryItem[];
  totalExercises: number;
  streak: number;
}

export default function HistoryView({ history, totalExercises, streak }: HistoryViewProps) {
  const today = new Date().toDateString();
  const todayHistory = history.filter(item => item.timestamp.toDateString() === today);
  
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - 7);
  const weekHistory = history.filter(item => item.timestamp >= thisWeekStart);

  const renderHistoryList = (items: ExerciseHistoryItem[]) => (
    <ScrollArea className="h-[400px]">
      <div className="space-y-3 pr-4">
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No exercises yet. Start your first deskercise!</p>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="hover-elevate" data-testid={`history-item-${item.id}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="text-3xl">{item.emoji}</div>
                <div className="flex-1">
                  <p className="font-semibold" data-testid="text-history-exercise-name">{item.exerciseName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <Badge 
                  variant={item.status === 'completed' ? 'default' : 'secondary'}
                  data-testid={`badge-status-${item.status}`}
                >
                  {item.status}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  );

  return (
    <div className="space-y-6" data-testid="view-history">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Exercises</p>
              <p className="text-2xl font-heading font-bold" data-testid="text-total-exercises">{totalExercises}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-accent flex items-center justify-center">
              <Award className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-heading font-bold" data-testid="text-streak">{streak} days</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-chart-2 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-heading font-bold" data-testid="text-week-total">{weekHistory.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Exercise History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" data-testid="tab-all">All Time</TabsTrigger>
              <TabsTrigger value="week" data-testid="tab-week">This Week</TabsTrigger>
              <TabsTrigger value="today" data-testid="tab-today">Today</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {renderHistoryList(history)}
            </TabsContent>
            <TabsContent value="week" className="mt-4">
              {renderHistoryList(weekHistory)}
            </TabsContent>
            <TabsContent value="today" className="mt-4">
              {renderHistoryList(todayHistory)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
