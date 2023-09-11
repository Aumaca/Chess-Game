import { useState, useEffect } from 'react';
import './App.css'
import { Square } from './components/chessboard';

function App() {
  const [clickedSquare, setClickedSquare] = useState<string>("");
  const [chessboard, setChessboard] = useState<SquareInt[]>([]);

  interface SquareInt {
    piece: string,
    color: string,
    coordinate: string,
    selected: boolean,
  }

  useEffect(() => {
    setChessboard(generateSquares());
  }, [])

  // Switch pieces, reset states and square.selected
  const movePiece = (coordinate: string): void => {
    console.log(`beggining to change piece from ${clickedSquare} to ${coordinate}`);
    const newChessboard = chessboard.map((square) => {
      if (square.coordinate === clickedSquare) {
        return {
          ...square,
          piece: "",
          selected: false,
        }
      }
      else if (square.coordinate === coordinate) {
        return {
          ...square,
          piece: chessboard.find((s) => s.coordinate === clickedSquare)?.piece || "",
        }
      }
      return square;
    });

    setClickedSquare("");
    setChessboard(newChessboard);
  }

  const setSelected = (coordinate: string): void => {
    const newChessboard = chessboard.map((square) => {
      if (square.coordinate === coordinate) {
        return {
          ...square,
          selected: !square.selected,
        }
      }
      return square;
    });

    setChessboard(newChessboard);
  }

  const clickSquare = (coordinate: string): void => {

    if (clickedSquare === "") {
      setClickedSquare(coordinate);
      setSelected(coordinate);
    }
    else if (clickedSquare === coordinate) {
      setClickedSquare("");
      setSelected(coordinate);
    }
    else {
      movePiece(coordinate);
    }

  }

  const generateSquares = (): SquareInt[] => {
    const chessboard: SquareInt[] = [];
    const letters: string[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const colors = ["white", "black"];

    for (let row = 0; row < 8; row++) {
      const rowCoord: number = 8 - row;

      letters.forEach((colLetter: string, col: number) => {
        let color: string;
        if ((row + col) % 2 === 0) { color = colors[0] } else { color = colors[1] }

        let piece: string = "";
        if (row === 6) { piece = "pawn" }

        const coordinate: string = `${colLetter}${rowCoord}`;

        chessboard.push({
          piece: piece,
          color: color,
          coordinate: coordinate,
          selected: false,
        })
      })
    }

    return chessboard;
  }

  return (
    <>
      <div className='main'>
        <div className="player1">
          <h2>Player 1: player12</h2>
        </div>
        <div className="chessboard">
          {chessboard.map(((square, idx) => {
            return (
              <Square key={idx} {...square} onSquareClick={() => clickSquare(square.coordinate)} />
            )
          }))}
        </div>
        <div className="player2">
          <h2>Player 2: player23
          </h2>
        </div>
      </div>
      <footer>
        <p>Made by <a className="text-white github-link" href="http://github.com/Aumaca"
          target="_blank" rel="noopener">Carlos Augusto🔗</a>
        </p>
      </footer>
    </>
  )
}

export default App
