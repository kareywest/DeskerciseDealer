import CardDeck from '../CardDeck';

export default function CardDeckExample() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <CardDeck 
        onDrawCard={() => console.log('Drawing card...')}
        cardsRemaining={15}
      />
    </div>
  );
}
