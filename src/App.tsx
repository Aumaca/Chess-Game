import { useState, useEffect } from 'react';
import { Square } from './components/Square';
import { Piece, Pawn, Rook, Knight, Bishop, Queen, King } from './components/pieces';
import { sortEatenPieces, toCreateInitialPieces } from './components/pieces';
import profileImg from './imgs/profile.jpg'

function App() {
  const [pieceToMove, setPieceToMove] = useState<Piece>();

  const [playerTurn, setPlayerTurn] = useState<string>("white");

  const [firstPlayerTimer, setFirstPlayerTimer] = useState<number>(60);
  const [secondPlayerTimer, setSecondPlayerTimer] = useState<number>(60);

  const [firstPlayerEatenPieces, setFirstPlayerEatenPieces] = useState<string[]>([]);
  const [secondPlayerEatenPieces, setSecondPlayerEatenPieces] = useState<string[]>([]);

  const [chessboard, setChessboard] = useState<SquareInt[]>([]);

  interface SquareInt {
    piece: Piece | undefined,
    color: string,
    coordinate: string,
    selected: boolean,
    possibleMove: boolean,
    isEatable: boolean,
  }

  // Player's timer
  useEffect(() => {
    if (playerTurn === "white") {
      const interval = setInterval(() => {
        const newFirstPlayerTimer: number = firstPlayerTimer - 1;
        setFirstPlayerTimer(newFirstPlayerTimer);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      const interval = setInterval(() => {
        const newSecondPLayerTime: number = secondPlayerTimer - 1;
        setSecondPlayerTimer(newSecondPLayerTime);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [firstPlayerTimer, secondPlayerTimer, playerTurn]);


  // Generate Squares and Pieces
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

          piece = toCreateInitialPieces(coordinate, pieceColor, row);

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
      let newEatenPieces: string[];
      if (square.coordinate === coordinate && square?.piece) {
        if (playerTurn === "white") {
          newEatenPieces = firstPlayerEatenPieces;
          newEatenPieces.push(square.piece.constructor.name);
          setFirstPlayerEatenPieces(sortEatenPieces(newEatenPieces));
        } else {
          newEatenPieces = secondPlayerEatenPieces;
          newEatenPieces.push(square.piece.constructor.name);
          setSecondPlayerEatenPieces(sortEatenPieces(newEatenPieces));
        }
      }

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
    if (pieceToMove!.color === "white")
      setPlayerTurn("black");
    else
      setPlayerTurn("white");
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
    else if (piece.color === playerTurn) {
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

  const getImageEatenPiece = (piece: string, firstPlayer: boolean): string => {
    let image: string = "";
    switch (piece) {
      case "Pawn":
        image = new Pawn(firstPlayer ? "black" : "white", "").image;
        break
      case "Rook":
        image = new Rook(firstPlayer ? "black" : "white", "").image;
        break
      case "Knight":
        image = new Knight(firstPlayer ? "black" : "white", "").image;
        break
      case "Bishop":
        image = new Bishop(firstPlayer ? "black" : "white", "").image;
        break
      case "Queen":
        image = new Queen(firstPlayer ? "black" : "white", "").image;
        break
    }
    return image;
  }

  return (
    <>
      <div className='main'>

        {/** Player 2 */}
        <div className="player__container">
          <div className="player2">

            <div className="eaten_pieces">
              <p>
                {secondPlayerEatenPieces.map((piece) => {
                  return (<img src={getImageEatenPiece(piece, false)} width="20px" />)
                })}
              </p>
            </div>

            <div className="data__container">
              <div className="image_name">
                <img src={profileImg} width={"50px"} alt="" />
                <h2>Aumaca123</h2>
              </div>

              <div className="timer">
                <p>{secondPlayerTimer}</p>
              </div>
            </div>
          </div>
        </div>

        {/** Chessboard */}
        <div className="chessboard">
          {chessboard.map(((square, idx) => {
            return (
              <Square key={idx} {...square} onSquareClick={() => clickSquare(square.coordinate)} />
            )
          }))}
        </div>

        {/** Player 1 */}
        <div className="player__container">
          <div className="player1">
            <div className='data__container'>
              <div className="timer">
                <p>{firstPlayerTimer}</p>
              </div>

              <div className="image_name">
                <img src={profileImg} width={"50px"} alt="" />
                <h2>Aumaca123</h2>
              </div>
            </div>

            <div className="eaten_pieces">
              <p>
                {firstPlayerEatenPieces.map((piece) => {
                  return (<img src={getImageEatenPiece(piece, true)} width="20px" />)
                })}
              </p>
            </div>
          </div>

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
