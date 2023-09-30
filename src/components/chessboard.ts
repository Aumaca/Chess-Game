import { SquareInt } from "./interfaces"
import * as pieces from "./pieces";

export class Chessboard {
    squares: SquareInt[] = [];

    constructor() {
        this.generateSquares();
    }

    generateSquares(): void {
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

    toCreateInitialPieces(coordinate: string, color: string, row?: number): pieces.Piece {
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

    // This function appears to be horrible in performance but ok!!!!
    detectCheck(playerTurn: string): boolean {
        let check = false;
        this.squares.map((square) => {
            if (square?.piece && square?.piece?.color === playerTurn) {
                square.piece.checkMoves(this).map((coord) => {
                    if (this.squares.find((s) => s.coordinate === coord)?.piece?.getClassName() === "King") {
                        check = true;
                    }
                })
            }
        })
        return check;
    }

    isInsideBoard(col: string, row: number): boolean {
        if (col.charCodeAt(0) >= 65 && col.charCodeAt(0) <= 72 && row >= 1 && row <= 8)
            return true;
        else
            return false;
    }
}