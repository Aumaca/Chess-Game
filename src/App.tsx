import { useState, useEffect } from 'react';
import './App.css'
import { Square } from './components/Square';
import { Piece, Pawn, Rook, Knight, Bishop, Queen, King } from './components/pieces';

function App() {
  const [pieceToMove, setPieceToMove] = useState<Piece>();
  const [chessboard, setChessboard] = useState<SquareInt[]>([]);

  interface SquareInt {
    piece: Piece | undefined,
    color: string,
    coordinate: string,
    selected: boolean,
    possibleMove: boolean,
    isEatable: boolean,
  }

  useEffect(() => {
    const generateSquares = (): SquareInt[] => {
      const chessboard: SquareInt[] = [];
      const letters: string[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
      const colors = ["white", "black"];

      for (let row = 0; row < 8; row++) {
        const rowCoord: number = 8 - row;

        letters.forEach((colLetter: string, col: number) => {
          let piece: Piece | undefined = undefined;
          let pieceColor: string;
          let tileColor: string;
          const coordinate: string = `${colLetter}${rowCoord}`;

          (row + col) % 2 === 0 ? tileColor = colors[0] : tileColor = colors[1];
          row < 4 ? pieceColor = colors[1] : pieceColor = colors[0];

          // Create Pawns
          if (row === 6 || row === 1) {
            piece = new Pawn(pieceColor, coordinate);
          }

          // Create Kings
          if (coordinate === "E1" || coordinate === "E8") {
            piece = new King(pieceColor, coordinate);
          }

          // Create Queens
          if (coordinate === "D1" || coordinate === "D8") {
            piece = new Queen(pieceColor, coordinate);
          }

          // Create Bishops
          if (coordinate === "C1" || coordinate === "C8" || coordinate === "F1" || coordinate === "F8") {
            piece = new Bishop(pieceColor, coordinate);
          }

          // Create Knights
          if (coordinate === "B1" || coordinate === "B8" || coordinate === "G1" || coordinate === "G8") {
            piece = new Knight(pieceColor, coordinate);
          }

          // Create Rooks
          if (coordinate === "A1" || coordinate === "A8" || coordinate === "H1" || coordinate === "H8") {
            piece = new Rook(pieceColor, coordinate);
          }

          chessboard.push({
            piece: piece,
            color: tileColor,
            coordinate: coordinate,
            selected: false,
            possibleMove: false,
            isEatable: false,
          })
        })
      }

      return chessboard;
    }

    setChessboard(generateSquares());
  }, [])

  // Here, the state is necessarily a Piece object.
  // When piece is moved, the chessboard is reset.
  const movePiece = (coordinate: string): void => {
    const lastCoordinate: string = pieceToMove!.coordinate; // Temporary var to save last coordinate
    pieceToMove!.coordinate = coordinate;

    const newChessboard = chessboard.map((square) => {
      return {
        ...square,
        possibleMove: false,
        selected: false,
        piece: square.coordinate === coordinate ? pieceToMove : square.coordinate === lastCoordinate ? undefined : square.piece,
        isEatable: false,
      }
    })

    setPieceToMove(undefined);
    setChessboard(newChessboard);
  }

  const clickChangeChessboard = (piece: Piece | undefined, coordinate: string): void => {
    // If same piece is clicked again
    if (!piece) {
      const newChessboard = chessboard.map((square) => {
        return {
          ...square,
          selected: false,
          isEatable: false,
          possibleMove: false,
        }
      });
      setChessboard(newChessboard);
      setPieceToMove(undefined);
    }
    else {
      setPieceToMove(piece);

      const movements = piece!.checkMoves(chessboard);
      const newChessboard = chessboard.map((square) => {
        if (movements?.includes(square.coordinate)) {
          return {
            ...square,
            isEatable: square.piece ? true : false,
            possibleMove: square.piece ? false : true,
          }
        }
        else {
          return {
            ...square,
            selected: square.coordinate === coordinate ? !square.selected : false,
            isEatable: false,
            possibleMove: false,
          }
        }
      });

      setChessboard(newChessboard);
    }
  }

  const clickSquare = (coordinate: string): void => {
    const piece: Piece | undefined = chessboard.find((s) => s.coordinate === coordinate)?.piece as Piece | undefined;

    // If state is undefined and piece is not undefined
    if (!pieceToMove && piece) {
      clickChangeChessboard(piece, coordinate);
    }

    // If same piece is clicked again
    else if (JSON.stringify(pieceToMove) === JSON.stringify(piece)) {
      clickChangeChessboard(undefined, coordinate);
    }

    // If piece of same color is clicked after other, change active piece
    else if (piece?.color === pieceToMove?.color) {
      clickChangeChessboard(piece, coordinate);
    }

    // Checks if clicked square is possible to move and then move
    else if (pieceToMove) {
      const squaresToMove = pieceToMove.checkMoves(chessboard);
      if (squaresToMove.includes(coordinate)) {
        movePiece(coordinate);
      }
    }

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
