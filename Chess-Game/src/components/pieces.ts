interface SquareInt {
    piece: Piece | undefined,
    color: string,
    coordinate: string,
    selected: boolean,
    possibleMove: boolean,
    isEatable: boolean,
}
const letters: string[] = ["A", "B", "C", "D", "E", "F", "G", "H"];

export abstract class Piece {
    color: string;
    coordinate: string;
    abstract image: string;

    constructor(color: string, coordinate: string) {
        this.color = color;
        this.coordinate = coordinate;
    }

    abstract checkMoves(chessboard: SquareInt[]): string[];
}

export class Pawn extends Piece {
    image: string;

    constructor(color: string, coordinate: string) {
        super(color, coordinate);
        if (color === "white") {
            this.image = "https://upload.wikimedia.org/wikipedia/commons/3/37/Western_white_side_Pawn.svg";
        } else if (color === "black") {
            this.image = "https://upload.wikimedia.org/wikipedia/commons/b/b3/Western_black_side_Pawn_%281%29.svg";
        } else {
            this.image = "";
        }
    }

    checkMoves(chessboard: SquareInt[]): string[] {
        let squares = 1;
        const squaresToMove: string[] = [];

        // First move
        if ((this.coordinate.includes("2") && this.color === "white") || (this.coordinate.includes("7") && this.color === "black")) {
            squares++;
        }

        if (this.color === "white") {
            const col = this.coordinate[0];
            for (let x = 1; x <= squares; x++) {
                const row = (parseInt(this.coordinate[1]) + x).toString();
                const coordinate = col + row;
                squaresToMove.push(coordinate);
            }
        } else {
            for (let x = 1; x <= squares; x++) {
                const row = parseInt(this.coordinate[1]) - x;
                squaresToMove.push(`${this.coordinate[0] + row}`);
            }
        }
        console.log("retornando: " + squaresToMove);
        return squaresToMove;
    }
}

export class Bishop extends Piece {
    image: string;

    constructor(color: string, coordinate: string) {
        super(color, coordinate);
        if (color === "white") {
            this.image = "https://upload.wikimedia.org/wikipedia/commons/a/ad/Western_white_side_Bishop.svg";
        } else if (color === "black") {
            this.image = "https://upload.wikimedia.org/wikipedia/commons/c/cf/Western_black_side_Bishop.svg";
        } else {
            this.image = "";
        }
    }

    checkMoves(chessboard: SquareInt[]): string[] {
        const squaresToMove: string[] = [];
        return squaresToMove;
    }
}

export class Knight extends Piece {
    image: string;

    constructor(color: string, coordinate: string) {
        super(color, coordinate);
        if (color === "white") {
            this.image = "https://upload.wikimedia.org/wikipedia/commons/c/c3/Western_white_side_Knight.svg";
        } else if (color === "black") {
            this.image = "https://upload.wikimedia.org/wikipedia/commons/2/21/Western_black_side_Knight.svg";
        } else {
            this.image = "";
        }
    }

    checkMoves(chessboard: SquareInt[]): string[] {
        const squaresToMove: string[] = [];
        return squaresToMove;
    }
}

export class Rook extends Piece {
    image: string;

    constructor(color: string, coordinate: string) {
        super(color, coordinate);
        if (color === "white") {
            this.image = "https://upload.wikimedia.org/wikipedia/commons/e/ed/Western_white_side_Rook.svg";
        } else if (color === "black") {
            this.image = "https://upload.wikimedia.org/wikipedia/commons/5/5a/Western_black_side_Rook.svg";
        } else {
            this.image = "";
        }
    }

    checkMoves(chessboard: SquareInt[]): string[] {
        const squaresToMove: string[] = [];
        const col: string = this.coordinate[0];
        const row: number = parseInt(this.coordinate[1]);

        let tempRow: number;
        let tempCol: string;

        // UP
        tempRow = row + 1;
        while (tempRow <= 8) {
            const coordinate = col + (tempRow).toString();
            const tempSquare: SquareInt = chessboard.find((s) => s.coordinate === coordinate) as SquareInt;
            if (tempSquare?.piece) {
                if (tempSquare.piece.color === this.color) {
                    break;
                } else if (tempSquare.piece.color) {
                    squaresToMove.push(coordinate);
                    break;
                }
            } else {
                squaresToMove.push(coordinate);
            }
            tempRow++;
        }

        // DOWN
        tempRow = row - 1;
        while (tempRow >= 1) {
            const coordinate: string = col + (tempRow).toString();
            const tempSquare: SquareInt = chessboard.find((s) => s.coordinate === coordinate) as SquareInt;
            if (tempSquare?.piece) {
                if (tempSquare.piece.color === this.color) {
                    break;
                } else if (tempSquare.piece.color) {
                    squaresToMove.push(coordinate);
                    break;
                }
            } else {
                squaresToMove.push(coordinate);
            }
            tempRow--;
        }
        console.log("retornando: " + squaresToMove);
        return squaresToMove;
    }
}