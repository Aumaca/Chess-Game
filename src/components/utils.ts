import { Piece, Pawn, Rook, Knight, Bishop, Queen, King } from './pieces';
import { SquareInt } from './interfaces';

export const isInsideBoard = (col: string, row: number): boolean => {
    if (col.charCodeAt(0) >= 65 && col.charCodeAt(0) <= 72 && row >= 1 && row <= 8) {
        return true;
    }
    return false;
}

export const getImageEatenPiece = (piece: string, firstPlayer: boolean): string => {
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

export const sortEatenPieces = (pieces: string[]): string[] => {
    // Pawns, Knights, Bishops, Towers, Queen
    const numberPieces: number[] = [0, 0, 0, 0, 0];
    const newPieces: string[] = [];

    pieces.map((piece: string) => {
        switch (piece) {
            case "Pawn":
                numberPieces[0]++;
                break;
            case "Knight":
                numberPieces[1]++;
                break;
            case "Bishop":
                numberPieces[2]++;
                break;
            case "Tower":
                numberPieces[3]++;
                break;
            case "Queen":
                numberPieces[4]++;
                break;
        }
    });

    numberPieces.forEach((quant, index) => {
        switch (index) {
            case 0:
                while (quant > 0) {
                    newPieces.push("Pawn");
                    quant--;
                }
                break;
            case 1:
                while (quant > 0) {
                    newPieces.push("Knight");
                    quant--;
                }
                break;
            case 2:
                while (quant > 0) {
                    newPieces.push("Bishop");
                    quant--;
                }
                break;
            case 3:
                while (quant > 0) {
                    newPieces.push("Rook");
                    quant--;
                }
                break;
            case 4:
                while (quant > 0) {
                    newPieces.push("Queen");
                    quant--;
                }
                break;
        }
    });

    return newPieces;
}

export const toCreateInitialPieces = (coordinate: string, color: string, row?: number): Piece => {
    let piece: Piece;

    // Create Pawns
    if (row)
        if (row === 6 || row === 1) {
            piece = new Pawn(color, coordinate);
            return piece;
        }

    // Create Kings
    if (coordinate === "E1" || coordinate === "E8")
        piece = new King(color, coordinate);

    // Create Queens
    if (coordinate === "D1" || coordinate === "D8")
        piece = new Queen(color, coordinate);

    // Create Bishops
    if (coordinate === "C1" || coordinate === "C8" || coordinate === "F1" || coordinate === "F8")
        piece = new Bishop(color, coordinate);

    // Create Knights
    if (coordinate === "B1" || coordinate === "B8" || coordinate === "G1" || coordinate === "G8")
        piece = new Knight(color, coordinate);

    // Create Rooks
    if (coordinate === "A1" || coordinate === "A8" || coordinate === "H1" || coordinate === "H8")
        piece = new Rook(color, coordinate);

    return piece!;
}


// Create squares and their pieces
export const generateSquares = (): SquareInt[] => {
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