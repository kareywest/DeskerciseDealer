export type DifficultyLevel = 'easy' | 'intense' | 'silent';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  difficulty: DifficultyLevel;
  emoji: string;
}

export const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Neck Rolls',
    description: 'Slowly roll your head in a circle, 5 times clockwise, then 5 times counterclockwise. Feel the tension melt away.',
    difficulty: 'silent',
    emoji: '🔄'
  },
  {
    id: '2',
    name: 'Shoulder Shrugs',
    description: 'Lift both shoulders up toward your ears, hold for 3 seconds, then release. Repeat 10 times.',
    difficulty: 'easy',
    emoji: '💪'
  },
  {
    id: '3',
    name: 'Desk Push-Ups',
    description: 'Place hands on desk edge, step back, and do 15 push-ups against your desk. Feel that upper body burn!',
    difficulty: 'intense',
    emoji: '🏋️'
  },
  {
    id: '4',
    name: 'Seated Spinal Twist',
    description: 'Sit tall, place right hand on left knee, twist gently to the left. Hold 15 seconds. Repeat on the other side.',
    difficulty: 'silent',
    emoji: '🌀'
  },
  {
    id: '5',
    name: 'Standing Quad Stretch',
    description: 'Stand up, grab your right ankle behind you, pull gently for 20 seconds. Switch legs. Balance optional!',
    difficulty: 'easy',
    emoji: '🦵'
  },
  {
    id: '6',
    name: 'Chair Squats',
    description: 'Stand in front of your chair, lower yourself until almost seated, then stand back up. Do 20 reps!',
    difficulty: 'intense',
    emoji: '⬇️'
  },
  {
    id: '7',
    name: 'Wrist Circles',
    description: 'Extend arms forward, make fists, rotate wrists in circles 10 times each direction. Perfect for keyboard warriors.',
    difficulty: 'silent',
    emoji: '👊'
  },
  {
    id: '8',
    name: 'Arm Circles',
    description: 'Extend arms out to sides, make small circles forward for 15 seconds, then backward for 15 seconds.',
    difficulty: 'easy',
    emoji: '🔃'
  },
  {
    id: '9',
    name: 'High Knees',
    description: 'March in place, bringing knees up high. Do this for 30 seconds. Get that heart rate up!',
    difficulty: 'intense',
    emoji: '🏃'
  },
  {
    id: '10',
    name: 'Ankle Rolls',
    description: 'Lift one foot slightly off ground, rotate ankle clockwise 10 times, then counterclockwise. Switch feet.',
    difficulty: 'silent',
    emoji: '👣'
  },
  {
    id: '11',
    name: 'Overhead Reach',
    description: 'Interlace fingers, flip palms up, reach toward ceiling. Hold for 15 seconds. Feel that stretch!',
    difficulty: 'easy',
    emoji: '🙆'
  },
  {
    id: '12',
    name: 'Jumping Jacks',
    description: 'Do 25 jumping jacks right there! Arms up, legs out. Classic cardio energy boost.',
    difficulty: 'intense',
    emoji: '🤸'
  },
  {
    id: '13',
    name: 'Eye Exercises',
    description: 'Look far away for 10 seconds, then at something close for 10 seconds. Repeat 5 times. Your eyes will thank you.',
    difficulty: 'silent',
    emoji: '👀'
  },
  {
    id: '14',
    name: 'Calf Raises',
    description: 'Stand behind your chair, hold for balance, rise up on toes. Lower slowly. Do 20 reps.',
    difficulty: 'easy',
    emoji: '🦿'
  },
  {
    id: '15',
    name: 'Burpees',
    description: 'Squat down, kick feet back to plank, do a push-up, jump feet forward, jump up! Do 10. Yes, really.',
    difficulty: 'intense',
    emoji: '💥'
  }
];
