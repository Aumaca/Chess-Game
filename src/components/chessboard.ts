import { SquareInt } from "./interfaces"
import * as pieces from "./pieces";

export class Chessboard {
    squares: SquareInt[] = [];

    constructor(isCreating?: boolean) {
        isCreating ? this.generateSquares() : "";
    }

    private generateSquares(): void {
        const chessboard: SquareInt[] = [];
        const letters: string[] = ["A", "B", "C", "D", "E", "F", "G", "H"];
        const colors = ["white", "black"];

        for (let row = 0; row < 8; row++) {
            const rowCoord: number = 8 - row;

            letters.forEach((colLetter: string, col: number) => {
                let piece: pieces.Piece | undefined = undefined;
                let pieceColor: string;
                let tileColor: string;
                const coordinate: string = `${colLetter}${rowCoord}`;

                (row + col) % 2 === 0 ? tileColor = colors[0] : tileColor = colors[1];
                row < 4 ? pieceColor = colors[1] : pieceColor = colors[0];

                piece = this.toCreateInitialPieces(coordinate, pieceColor, row);

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

        this.squares = chessboard;
    }

    private toCreateInitialPieces(coordinate: string, color: string, row?: number): pieces.Piece {
        let piece: pieces.Piece;

        // Create Pawns
        if (row)
            if (row === 6 || row === 1) {
                piece = new pieces.Pawn(color, coordinate);
                return piece;
            }

        // Create Kings
        if (coordinate === "E1" || coordinate === "E8")
            piece = new pieces.King(color, coordinate);

        // Create Queens
        if (coordinate === "D1" || coordinate === "D8")
            piece = new pieces.Queen(color, coordinate);

        // Create Bishops
        if (coordinate === "C1" || coordinate === "C8" || coordinate === "F1" || coordinate === "F8")
            piece = new pieces.Bishop(color, coordinate);

        // Create Knights
        if (coordinate === "B1" || coordinate === "B8" || coordinate === "G1" || coordinate === "G8")
            piece = new pieces.Knight(color, coordinate);

        // Create Rooks
        if (coordinate === "A1" || coordinate === "A8" || coordinate === "H1" || coordinate === "H8")
            piece = new pieces.Rook(color, coordinate);

        return piece!;
    }

    /**
     * Check if a piece from current player may be eaten by the opponent's pieces.
     * @param {string} playerTurn
     */
    detectCheck(playerTurn: string): boolean {
        // For each square
        for (const square of this.squares) {
            // If piece is not from playerTurn
            if (square.piece && square.piece.color !== playerTurn) {
                // For all movements of this piece
                for (const coord of square.piece.checkMoves(this)) {
                    // Return true if this piece may hit the King
                    if (this.squares.find((s) => s.coordinate === coord)?.piece?.getClassName() === "King") {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Check if col and row are valid/inside board.
     * @param col - Letter
     * @param row - Number
     */
    isInsideBoard(col: string, row: number): boolean {
        if (col.charCodeAt(0) >= 65 && col.charCodeAt(0) <= 72 && row >= 1 && row <= 8)
            return true;
        return false;
    }

    /**
     * Creates new Chessboard object, move piece and check if
     * the new movement will result in a check to actual player.
     * @param coordinate
     * @param piece
     */
    willResultInCheck(coordinate: string, actualCoordinate: string, piece: pieces.Piece): boolean {
        const newChessboard: Chessboard = new Chessboard();
        
        // Move piece
        newChessboard.squares = this.squares.map((square) => {
            // Removing piece to simulate movement
            if (square.coordinate === actualCoordinate) {
                console.log("removing " + square.piece?.getClassName() + " from " + square.coordinate);
                return {
                    ...square,
                    piece: undefined,
                }
            }

            // Moving piece
            if (square.coordinate === coordinate) {
                return {
                    ...square,
                    piece: piece,
                }
            }

            return square;
        });

        return newChessboard.detectCheck(piece.color);
    }
}