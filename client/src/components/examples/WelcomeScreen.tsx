import WelcomeScreen from '../WelcomeScreen';

export default function WelcomeScreenExample() {
  return (
    <WelcomeScreen 
      onStart={(interval, difficulty) => {
        console.log('Started with interval:', interval, 'difficulty:', difficulty);
      }} 
    />
  );
}
