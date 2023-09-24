interface SquareInt {
    piece: Piece | undefined,
    color: string,
    coordinate: string,
    selected: boolean,
    possibleMove: boolean,
    isEatable: boolean,
}

const isInsideBoard = (col: string, row: number): boolean => {
    if (col.charCodeAt(0) >= 65 && col.charCodeAt(0) <= 72 && row >= 1 && row <= 8) {
        return true;
    }
    return false;
}

export abstract class Piece {
    color: string;
    coordinate: string;
    abstract image: string;
    abstract moves: [number, number][];

    constructor(color: string, coordinate: string) {
        this.color = color;
        this.coordinate = coordinate;
    }

    checkMoves(chessboard: SquareInt[]): string[] {
        const squaresToMove: string[] = [];
        const col: string = this.coordinate[0];
        const row: number = parseInt(this.coordinate[1]);

        const toCheckMoves = (colDirection: number, rowDirection: number) => {
            let tempCol: string = String.fromCharCode(col.charCodeAt(0) + colDirection);
            let tempRow: number = row + rowDirection;

            while (isInsideBoard(tempCol, tempRow)) {
                const coordinate = tempCol + tempRow;
                const square: SquareInt = chessboard.find((s) => s.coordinate === coordinate) as SquareInt;
                if (square.piece) {
                    if (square.piece.color === this.color) {
                        break;
                    } else if (square.piece.color) {
                        squaresToMove.push(coordinate);
                        break;
                    }
                } else {
                    squaresToMove.push(coordinate);
                    tempCol = String.fromCharCode(tempCol.charCodeAt(0) + colDirection);
                    tempRow += rowDirection;
                }
            }
        }

        this.moves.forEach((move) => {
            toCheckMoves(move[0], move[1]);
        })

        return squaresToMove;
    }
}

// TODO: config diagonal eating
export class Pawn extends Piece {
    image: string;
    moves: [number, number][] = [];

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
        const squaresToMove: string[] = [];
        const col: string = this.coordinate[0];
        const row: number = parseInt(this.coordinate[1]);
        let squares: number = 1;

        if ((this.color === "white" && row === 2) || this.color === "black" && row === 7) {
            squares++;
        }

        for (let i = 1; i <= squares; i++) {
            let tempRow: number;
            if (this.color === "white")
                tempRow = row + i;
            else
                tempRow = row - i;

            if (isInsideBoard(col, tempRow)) {
                const coordinate = col + tempRow;
                const square: SquareInt = chessboard.find((s) => s.coordinate === coordinate) as SquareInt;
                if (square.piece)
                    break;
                else
                    squaresToMove.push(coordinate);
            }
        }

        return squaresToMove;
    }
}

export class King extends Piece {
    image: string;
    moves: [number, number][] = [
        [-1, 1], // UP LEFT
        [0, 1], // UP UP
        [1, 1], // UP RIGHT
        [-1, 0], // LEFT
        [1, 0], // RIGHT
        [-1, -1], // DOWN LEFT
        [0, -1], // DOWN DOWN
        [1, -1], // DOWN RIGHT
    ]

    constructor(color: string, coordinate: string) {
        super(color, coordinate);
        if (color === "white") {
            this.image = "https://upload.wikimedia.org/wikipedia/commons/3/3b/Western_white_side_King.svg";
        } else if (color === "black") {
            this.image = "https://upload.wikimedia.org/wikipedia/commons/9/9d/Western_black_side_King.svg";
        } else {
            this.image = "";
        }
    }

    checkMoves(chessboard: SquareInt[]): string[] {
        const squaresToMove: string[] = [];
        const col: string = this.coordinate[0];
        const row: number = parseInt(this.coordinate[1]);

        const toCheckMoves = (colDirection: number, rowDirection: number) => {
            const tempCol: string = String.fromCharCode(col.charCodeAt(0) + colDirection);
            const tempRow: number = row + rowDirection;
            const coordinate = tempCol + tempRow;
            const square: SquareInt = chessboard.find((s) => s.coordinate === coordinate) as SquareInt;
            if (square?.piece) {
                if (!(square.piece.color === this.color))
                    squaresToMove.push(coordinate);
            } else {
                squaresToMove.push(coordinate);
            }
        }

        this.moves.forEach((move) => {
            toCheckMoves(move[0], move[1]);
        })

        return squaresToMove;
    }
}

export class Queen extends Piece {
    image: string;
    moves: [number, number][] = [
        [0, 1], // UP
        [0, -1], // DOWN
        [-1, 0], // LEFT
        [1, 0], // RIGHT
        [-1, 1], // UP LEFT
        [1, 1], // UP RIGHT
        [-1, -1], // DOWN LEFT
        [1, -1], // DOWN RIGHT
    ];

    constructor(color: string, coordinate: string) {
        super(color, coordinate);
        if (color === "white") {
            this.image = "https://upload.wikimedia.org/wikipedia/commons/5/56/Western_white_side_Queen.svg";
        } else if (color === "black") {
            this.image = "https://upload.wikimedia.org/wikipedia/commons/4/40/Western_black_side_Queen.svg";
        } else {
            this.image = "";
        }
    }
}

export class Bishop extends Piece {
    image: string;
    moves: [number, number][] = [
        [-1, 1], // UP LEFT
        [1, 1], // UP RIGHT
        [-1, -1], // DOWN LEFT
        [1, -1], // DOWN RIGHT
    ];

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
}

export class Knight extends Piece {
    image: string;
    moves: [number, number][] = [
        [-2, 1], // UP LEFT
        [-1, 2], // UP LEFT
        [2, 1], // UP RIGHT
        [1, 2], // UP RIGHT
        [-2, -1], // DOWN LEFT
        [-1, -2], // DOWN LEFT
        [2, -1], // DOWN RIGHT
        [1, -2], // DOWN RIGHT
    ];

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
        const col: string = this.coordinate[0];
        const row: number = parseInt(this.coordinate[1]);

        const toCheckMoves = (colDirection: number, rowDirection: number) => {
            const tempCol: string = String.fromCharCode(col.charCodeAt(0) + colDirection);
            const tempRow: number = row + rowDirection;
            const coordinate = tempCol + tempRow;
            const square: SquareInt = chessboard.find((s) => s.coordinate === coordinate) as SquareInt;
            if (square?.piece) {
                if (!(square.piece.color === this.color))
                    squaresToMove.push(coordinate);
            } else {
                squaresToMove.push(coordinate);
            }
        }

        this.moves.forEach((move) => {
            toCheckMoves(move[0], move[1]);
        })

        return squaresToMove;
    }
}

export class Rook extends Piece {
    image: string;
    moves: [number, number][] = [
        [0, 1], // UP
        [0, -1], // DOWN
        [-1, 0], // LEFT
        [1, 0], // RIGHT
    ]

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
}