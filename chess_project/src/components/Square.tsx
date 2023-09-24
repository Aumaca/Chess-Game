import { Piece } from './pieces'

interface SquareProps {
    onSquareClick: () => void,
    piece: Piece | null | undefined,
    color: string,
    coordinate: string,
    selected: boolean,
    possibleMove: boolean,
    isEatable: boolean,
}

export function Square({ onSquareClick, piece, color, selected, possibleMove, isEatable }: SquareProps): JSX.Element {
    return (
        <div className={
            `
            square
            ${color}
            ${selected ? "selected" : ""}
            ${possibleMove ? "can-move" : ""}
            ${isEatable ? "eatable" : ""}
            `
        } onClick={onSquareClick}>{piece ? <img src={piece?.image}></img> : ""}</div>
    )
}