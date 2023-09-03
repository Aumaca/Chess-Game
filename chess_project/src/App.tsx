import './App.css'
import { Square } from './components/chessboard';

function App() {

  const generateSquares = () => {
    const chessboard = [];
    const colors = ["white", "black"];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        let color: string;
        if ((row + col) % 2 === 0) {
          color = colors[0];
        } else {
          color = colors[1];
        }

        let piece: string = "";
        if (row === 6) {
          piece = "pawn";
        }

        chessboard.push(<Square key={`${row}-${col}`} piece={piece} color={color} onSquareClick={() => console.log("top")} />)
      }
    }

    return chessboard;
  }

  return (
    <>
      <div className="chessboard">
        {generateSquares()}
      </div>
    </>
  )
}

export default App
