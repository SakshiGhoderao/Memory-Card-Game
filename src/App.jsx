import { useState , useEffect } from 'react'
import './App.css'

const emojis = ["🐶", "🐱", "🐸", "🦊", "🐰", "🐼"];

function App(){
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);

  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);

  //START GMAE
  const startGame = () => {

  //shuffle and duplicate emojis
    const shuffledCards = [...emojis, ...emojis]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji,
    }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTime(0);
    setIsWon(false);
    setIsPlaying(true);
  };

  //TIMER
  useEffect(() => {

    let interval;

    if(isPlaying) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      },1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  //CARD CLICK
  const handleClick = (card) => {
    if(
      isWon ||
      flippedCards.length === 2 ||
      flippedCards.includes(card.id) ||
      matchedCards.includes(card.emoji)
    ) {
      return;
    }
    setFlippedCards([...flippedCards, card.id]);
  };

  //MATCH CHECK
  useEffect(() => {

    if(flippedCards.length === 2){

      setMoves(prev => prev + 1);
      const first = cards.find(c => c.id === flippedCards[0]);
      const second = cards.find(c => c.id === flippedCards[1]);

      if(!first || !second) return;

      if (first.emoji === second.emoji){
        setMatchedCards(prev => [...prev, first.emoji]);
      }

      setTimeout(() => {
        setFlippedCards([]);
      }, 800);
    }
  }, [flippedCards, cards]);

  //WIN CHECK
  useEffect(() => {
    if(matchedCards.length === emojis.length) {
      setIsWon(true);
      setIsPlaying(false);
    }
  }, [matchedCards]);

//START GAME ON LOAD
  useEffect(() => {
    startGame();
  }, []);

  return (

    <div className="container">
      <h1>Memory Game</h1>
      <div className="info">
        <p>Moves: {moves}</p>
        <p>Time: {time}s</p>
      </div>

      {isWon && <h2 className='win'>YOU WON</h2>}

      <button onClick={startGame}>Restart</button>

      <div className='grid'>
        {cards.map(card => (
          <div
           key={card.id}
           className='card'
           onClick={() => handleClick(card)}
          >
            {flippedCards.includes(card.id) ||
            matchedCards.includes(card.emoji)
            ? card.emoji
          : "❓"}
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default App;
