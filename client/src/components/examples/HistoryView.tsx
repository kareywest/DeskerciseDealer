import HistoryView from '../HistoryView';

const mockHistory = [
  {
    id: '1',
    exerciseName: 'Desk Push-Ups',
    emoji: '🏋️',
    timestamp: new Date(),
    status: 'completed' as const
  },
  {
    id: '2',
    exerciseName: 'Neck Rolls',
    emoji: '🔄',
    timestamp: new Date(Date.now() - 3600000),
    status: 'completed' as const
  },
  {
    id: '3',
    exerciseName: 'High Knees',
    emoji: '🏃',
    timestamp: new Date(Date.now() - 7200000),
    status: 'skipped' as const
  },
  {
    id: '4',
    exerciseName: 'Shoulder Shrugs',
    emoji: '💪',
    timestamp: new Date(Date.now() - 86400000),
    status: 'completed' as const
  }
];

export default function HistoryViewExample() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <HistoryView 
          history={mockHistory}
          totalExercises={12}
          streak={3}
        />
      </div>
    </div>
  );
}
