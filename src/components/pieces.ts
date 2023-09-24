interface SquareInt {
    piece: Piece | undefined,
    color: string,
    coordinate: string,
    selected: boolean,
    possibleMove: boolean,
    isEatable: boolean,
}

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

// TODO: config diagonal eating
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

export class King extends Piece {
    image: string;

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
        return squaresToMove;
    }
}

export class Queen extends Piece {
    image: string;

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

    checkMoves(chessboard: SquareInt[]): string[] {
        const squaresToMove: string[] = [];
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

        const col: string = this.coordinate[0];
        const row: number = parseInt(this.coordinate[1]);
        
        const toCheckMove = (isUp: boolean, isLeft: boolean) => {
            let tempCol: string = col;
            let tempRow: number = row;
            let coordinate: string;
            for (let i = 1; i <= 2; i++) {
                if (isUp) {
                    tempRow = tempRow + 1;
                } else {
                    tempRow = tempRow - 1;
                }

                if (isLeft) {
                    tempCol = i === 1 ? String.fromCharCode(col.charCodeAt(0) - 2) : String.fromCharCode(col.charCodeAt(0) - 1);
                } else {
                    tempCol = i === 1 ? String.fromCharCode(col.charCodeAt(0) + 2) : String.fromCharCode(col.charCodeAt(0) + 1);
                }

                if (tempRow >= 1 && tempRow <= 8 && tempCol.charCodeAt(0) >= 65 && tempCol.charCodeAt(0) <= 72) {
                    coordinate = tempCol + tempRow;

                    const square: SquareInt = chessboard.find((s) => s.coordinate === coordinate) as SquareInt;
                    if (!(square.piece?.color === this.color)) {
                        squaresToMove.push(coordinate);
                    }
                }
            }
        }

        // UP LEFT
        toCheckMove(true, true);
        // UP RIGHT
        toCheckMove(true, false);
        // DOWN LEFT
        toCheckMove(false, true);
        // DOWN RIGHT
        toCheckMove(false, false);

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

        const toCheckMoves = (direction: string) => {
            let tempCol: string = col;
            let tempRow: number = row;
            while (tempRow >= 1 && tempRow <= 8 && tempCol.charCodeAt(0) >= 65 && tempCol.charCodeAt(0) <= 72) {
                switch (direction) {
                    case "UP":
                        tempRow++;
                        break;
                    case "DOWN":
                        tempRow--;
                        break;
                    case "LEFT":
                        tempCol = String.fromCharCode(tempCol.charCodeAt(0) - 1);
                        break;
                    case "RIGHT":
                        tempCol = String.fromCharCode(tempCol.charCodeAt(0) + 1);
                        break;
                }
                const coordinate = tempCol + tempRow;
                const square: SquareInt = chessboard.find((s) => s.coordinate === coordinate) as SquareInt;
                if (square?.piece) {
                    if (square.piece.color === this.color) {
                        break;
                    } else if (square.piece.color) {
                        squaresToMove.push(coordinate);
                        break;
                    }
                } else {
                    squaresToMove.push(coordinate);
                }
            }
        }

        toCheckMoves("UP");
        toCheckMoves("DOWN");
        toCheckMoves("LEFT");
        toCheckMoves("RIGHT");

        return squaresToMove;
    }
}