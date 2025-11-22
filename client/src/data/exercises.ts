export type DifficultyLevel = 'easy' | 'intense' | 'silent';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  difficulty: DifficultyLevel;
  emoji: string;
  durationSeconds: number;
}

export const exercises: Exercise[] = [
  // Silent Mode Exercises (8 exercises - desk-friendly, discreet)
  {
    id: '1',
    name: 'Neck Rolls',
    description: 'Slowly roll your head in a circle, 5 times clockwise, then 5 times counterclockwise. Feel the tension melt away.',
    difficulty: 'silent',
    emoji: '🔄',
    durationSeconds: 30
  },
  {
    id: '2',
    name: 'Seated Spinal Twist',
    description: 'Sit tall, place right hand on left knee, twist gently to the left. Hold 15 seconds. Repeat on the other side.',
    difficulty: 'silent',
    emoji: '🌀',
    durationSeconds: 30
  },
  {
    id: '3',
    name: 'Wrist Circles',
    description: 'Extend arms forward, make fists, rotate wrists in circles 10 times each direction. Perfect for keyboard warriors.',
    difficulty: 'silent',
    emoji: '👊',
    durationSeconds: 30
  },
  {
    id: '4',
    name: 'Ankle Rolls',
    description: 'Lift one foot slightly off ground, rotate ankle clockwise 10 times, then counterclockwise. Switch feet.',
    difficulty: 'silent',
    emoji: '👣',
    durationSeconds: 30
  },
  {
    id: '5',
    name: 'Eye Exercises',
    description: 'Look far away for 10 seconds, then at something close for 10 seconds. Repeat 5 times. Your eyes will thank you.',
    difficulty: 'silent',
    emoji: '👀',
    durationSeconds: 60
  },
  {
    id: '6',
    name: 'Seated Leg Extensions',
    description: 'Sit upright, extend one leg straight out, hold for 5 seconds, lower slowly. Alternate legs. Do 10 each side.',
    difficulty: 'silent',
    emoji: '🦴',
    durationSeconds: 45
  },
  {
    id: '7',
    name: 'Finger Stretches',
    description: 'Spread fingers wide, hold for 5 seconds, then make a fist. Repeat 10 times. Great for preventing strain!',
    difficulty: 'silent',
    emoji: '✋',
    durationSeconds: 30
  },
  {
    id: '8',
    name: 'Seated Cat-Cow Stretch',
    description: 'Sit on edge of chair, arch back and look up, then round spine and look down. Flow between 10 times.',
    difficulty: 'silent',
    emoji: '🐱',
    durationSeconds: 40
  },
  {
    id: '25',
    name: 'Shoulder Blade Squeezes',
    description: 'Sit upright, squeeze shoulder blades together, hold for 5 seconds, release. Repeat 12 times. Perfect posture practice!',
    difficulty: 'silent',
    emoji: '🤝',
    durationSeconds: 45
  },
  {
    id: '26',
    name: 'Seated Hip Stretch',
    description: 'Sit, cross right ankle over left knee, gently press right knee down. Hold 20 seconds. Switch sides.',
    difficulty: 'silent',
    emoji: '🧘',
    durationSeconds: 40
  },
  {
    id: '27',
    name: 'Desk Shoulder Rolls',
    description: 'Roll shoulders forward in circles 10 times, then backward 10 times. Release that tension!',
    difficulty: 'silent',
    emoji: '🔄',
    durationSeconds: 30
  },

  // Easy Exercises (11 exercises - light movement, low impact)
  {
    id: '9',
    name: 'Shoulder Shrugs',
    description: 'Lift both shoulders up toward your ears, hold for 3 seconds, then release. Repeat 10 times.',
    difficulty: 'easy',
    emoji: '💪',
    durationSeconds: 30
  },
  {
    id: '10',
    name: 'Standing Quad Stretch',
    description: 'Stand up, grab your right ankle behind you, pull gently for 20 seconds. Switch legs. Balance optional!',
    difficulty: 'easy',
    emoji: '🦵',
    durationSeconds: 40
  },
  {
    id: '11',
    name: 'Arm Circles',
    description: 'Extend arms out to sides, make small circles forward for 15 seconds, then backward for 15 seconds.',
    difficulty: 'easy',
    emoji: '🔃',
    durationSeconds: 30
  },
  {
    id: '12',
    name: 'Overhead Reach',
    description: 'Interlace fingers, flip palms up, reach toward ceiling. Hold for 15 seconds. Feel that stretch!',
    difficulty: 'easy',
    emoji: '🙆',
    durationSeconds: 15
  },
  {
    id: '13',
    name: 'Calf Raises',
    description: 'Stand behind your chair, hold for balance, rise up on toes. Lower slowly. Do 20 reps.',
    difficulty: 'easy',
    emoji: '🦿',
    durationSeconds: 40
  },
  {
    id: '14',
    name: 'Side Bends',
    description: 'Stand with feet hip-width apart, reach right arm overhead and lean left. Hold 10 seconds. Switch sides. Repeat 5 times.',
    difficulty: 'easy',
    emoji: '🤸',
    durationSeconds: 45
  },
  {
    id: '15',
    name: 'Hip Circles',
    description: 'Stand with hands on hips, make large circles with your hips. 10 circles clockwise, 10 counterclockwise.',
    difficulty: 'easy',
    emoji: '⭕',
    durationSeconds: 35
  },
  {
    id: '16',
    name: 'Wall Push-Aways',
    description: 'Stand arm\'s length from wall, place palms on wall, lean in and push away. Do 15 gentle reps.',
    difficulty: 'easy',
    emoji: '🧱',
    durationSeconds: 35
  },
  {
    id: '28',
    name: 'Torso Twists',
    description: 'Stand with feet shoulder-width apart, arms out to sides. Twist torso left and right. Do 20 twists total.',
    difficulty: 'easy',
    emoji: '🌪️',
    durationSeconds: 40
  },
  {
    id: '29',
    name: 'Knee Lifts',
    description: 'Stand tall, lift right knee to hip height, lower. Alternate legs. Do 10 lifts each leg.',
    difficulty: 'easy',
    emoji: '🦶',
    durationSeconds: 35
  },
  {
    id: '30',
    name: 'Chest Opener Stretch',
    description: 'Clasp hands behind back, straighten arms, lift gently. Hold for 20 seconds. Feel your chest open up!',
    difficulty: 'easy',
    emoji: '💝',
    durationSeconds: 25
  },

  // Intense Exercises (11 exercises - cardio, strength)
  {
    id: '17',
    name: 'Desk Push-Ups',
    description: 'Place hands on desk edge, step back, and do 15 push-ups against your desk. Feel that upper body burn!',
    difficulty: 'intense',
    emoji: '🏋️',
    durationSeconds: 45
  },
  {
    id: '18',
    name: 'Chair Squats',
    description: 'Stand in front of your chair, lower yourself until almost seated, then stand back up. Do 20 reps!',
    difficulty: 'intense',
    emoji: '⬇️',
    durationSeconds: 60
  },
  {
    id: '19',
    name: 'High Knees',
    description: 'March in place, bringing knees up high. Do this for 30 seconds. Get that heart rate up!',
    difficulty: 'intense',
    emoji: '🏃',
    durationSeconds: 30
  },
  {
    id: '20',
    name: 'Jumping Jacks',
    description: 'Do 25 jumping jacks right there! Arms up, legs out. Classic cardio energy boost.',
    difficulty: 'intense',
    emoji: '🤸',
    durationSeconds: 45
  },
  {
    id: '21',
    name: 'Burpees',
    description: 'Squat down, kick feet back to plank, do a push-up, jump feet forward, jump up! Do 10. Yes, really.',
    difficulty: 'intense',
    emoji: '💥',
    durationSeconds: 60
  },
  {
    id: '22',
    name: 'Mountain Climbers',
    description: 'Start in plank position, alternate driving knees toward chest quickly. Keep going for 30 seconds!',
    difficulty: 'intense',
    emoji: '⛰️',
    durationSeconds: 30
  },
  {
    id: '23',
    name: 'Plank Hold',
    description: 'Get into plank position on forearms, keep body straight from head to heels. Hold for 45 seconds. You got this!',
    difficulty: 'intense',
    emoji: '📏',
    durationSeconds: 45
  },
  {
    id: '24',
    name: 'Lunge Pulses',
    description: 'Step into a lunge, pulse up and down 15 times. Switch legs. Feel those quads and glutes working!',
    difficulty: 'intense',
    emoji: '🦾',
    durationSeconds: 50
  },
  {
    id: '31',
    name: 'Standing Oblique Crunches',
    description: 'Stand, hands behind head, lift right knee to right elbow. Alternate sides. Do 20 total crunches!',
    difficulty: 'intense',
    emoji: '🔥',
    durationSeconds: 40
  },
  {
    id: '32',
    name: 'Tricep Dips',
    description: 'Sit on chair edge, hands gripping edge, slide forward, lower and raise body. Do 15 dips. Feel the burn!',
    difficulty: 'intense',
    emoji: '💺',
    durationSeconds: 45
  },
  {
    id: '33',
    name: 'Speed Skaters',
    description: 'Leap side to side, landing on alternating feet like a speed skater. Keep it up for 30 seconds!',
    difficulty: 'intense',
    emoji: '⛸️',
    durationSeconds: 30
  }
];
