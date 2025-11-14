import ExerciseCard from '../ExerciseCard';
import { exercises } from '@/data/exercises';

export default function ExerciseCardExample() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <ExerciseCard 
        exercise={exercises[2]}
        onRepeat={() => console.log('Repeat exercise')}
        onSkip={() => console.log('Skip exercise')}
        onDrawNew={() => console.log('Draw new card')}
        onBack={() => console.log('Back to deck')}
        isFlipped={true}
      />
    </div>
  );
}
