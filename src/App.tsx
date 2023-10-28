import { useState, useEffect } from 'react';

import { Square } from './components/Square';
import { Piece, sortEatenPieces, getImageEatenPiece, filterMovements } from './components/pieces';

import { SquareInt } from './components/interfaces';
import { v4 as uuidv4 } from 'uuid';

// Sounds
import Capture from './sounds/Capture.mp3';
import Move from './sounds/Move.mp3';
import Check from './sounds/Check.mp3';

// Images
import profileImg from './imgs/profile.jpg'
import { Chessboard } from './components/chessboard';

function App() {
  const [pieceToMove, setPieceToMove] = useState<Piece>();

  const [playerTurn, setPlayerTurn] = useState<string>("white");

  const [isCheck, setIsCheck] = useState<string>("");

  const [firstPlayerTimer, setFirstPlayerTimer] = useState<number>(60);
  const [secondPlayerTimer, setSecondPlayerTimer] = useState<number>(60);

  const [firstPlayerEatenPieces, setFirstPlayerEatenPieces] = useState<string[]>([]);
  const [secondPlayerEatenPieces, setSecondPlayerEatenPieces] = useState<string[]>([]);

  const [chessboard, setChessboard] = useState<Chessboard>(new Chessboard());

  // Player's timer
  useEffect(() => {
    if (playerTurn === "white") {
      const interval = setInterval(() => {
        const newFirstPlayerTimer: number = firstPlayerTimer - 1;
        if (newFirstPlayerTimer >= 0)
          setFirstPlayerTimer(newFirstPlayerTimer);
        else
          setFirstPlayerTimer(0);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      const interval = setInterval(() => {
        const newSecondPLayerTime: number = secondPlayerTimer - 1;
        if (newSecondPLayerTime >= 0)
          setSecondPlayerTimer(newSecondPLayerTime);
        else
          setSecondPlayerTimer(0);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [firstPlayerTimer, secondPlayerTimer, playerTurn]);


  // Generate Squares and Pieces
  useEffect(() => {
    setChessboard(new Chessboard(true));
  }, [])

  // Here, the state is necessarily a Piece object.
  // When piece is moved, the chessboard is reset.
  const movePiece = (coordinate: string): void => {
    const lastCoordinate: string = pieceToMove!.coordinate; // Temporary var to save last coordinate
    pieceToMove!.coordinate = coordinate;

    // Play sounds
    if (chessboard.squares.find((s) => s.coordinate === coordinate)?.piece)
      new Audio(Capture).play();
    else
      new Audio(Move).play();

    chessboard.squares = chessboard.squares.map((square) => {
      // Check if square to move has piece and add to eaten
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
    });

    let playerTurnVar: string = playerTurn;

    // Change player turn
    if (pieceToMove!.color === "white") {
      setPlayerTurn("black");
      playerTurnVar = "black"
    }
    else {
      setPlayerTurn("white");
      playerTurnVar = "white";
    }
    
    // If check, play sound, set isEatable to King and setCheck.
    if (chessboard.detectCheck(playerTurnVar)) {
      new Audio(Check).play();

      // Set isEatable to actual player king
      chessboard.squares = chessboard.squares.map((square) => {
        if (square?.piece?.color === playerTurnVar && square?.piece?.getClassName() === "King") {
          return {
            ...square,
            isEatable: true,
          }
        }
        return square;
      });
      
      setIsCheck(playerTurnVar);
    } else {
      setIsCheck("");
    }


    setPieceToMove(undefined);
    setChessboard(chessboard);
  }

  // When player click in a square
  const clickChangeChessboard = (piece: Piece | undefined, coordinate: string): void => {
    // To be used in isEatable from square
    function toCheck(square: SquareInt): boolean {
      if (square.piece && square.piece.getClassName() === "King" && square.piece.color === isCheck)
        return true;
      else
        return false;
    }

    // If same piece is clicked again
    if (!piece) {
      chessboard.squares = chessboard.squares.map((square) => {
        return {
          ...square,
          selected: false,
          isEatable: toCheck(square),
          possibleMove: false,
        }
      });
      setChessboard(chessboard);
      setPieceToMove(undefined);
    }
    else if (piece.color === playerTurn) {
      setPieceToMove(piece);

      // Coordinates that is possible to move
      const movements = filterMovements(chessboard, piece);
      console.log("Movementss: ");
      console.log(movements);

      // Change colors (isEatable, possibleMove, isSelected)
      chessboard.squares = chessboard.squares.map((square) => {
        if (movements?.includes(square.coordinate)) {
          return {
            ...square,
            isEatable: toCheck(square) ? true : square.piece ? true : false,
            possibleMove: toCheck(square) ? false : square.piece ? false : true,
          }
        }
        else {
          return {
            ...square,
            selected: square.coordinate === coordinate ? !square.selected : false,
            isEatable: toCheck(square),
            possibleMove: false,
          }
        }
      });

      setChessboard(chessboard);
    }
  }

  const clickSquare = (coordinate: string): void => {
    const piece: Piece | undefined = chessboard.squares.find((s) => s.coordinate === coordinate)?.piece as Piece | undefined;

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

        {/** Player 2 */}
        <div className="player__container">
          <div className="player2">

            <div className="eaten_pieces">
              <p>
                {secondPlayerEatenPieces.map((piece) => {
                  const uuid = uuidv4();
                  return (<img key={uuid} src={getImageEatenPiece(piece, false)} width="20px" />)
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
          {chessboard.squares.map(((square, idx) => {
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
                  const uuid = uuidv4();
                  return (<img key={uuid} src={getImageEatenPiece(piece, true)} width="20px" />)
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
