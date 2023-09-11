import React from 'react'

interface SquareProps {
    onSquareClick: () => void,
    piece: string,
    color: string,
    coordinate: string,
    selected: boolean,
}

export function Square({ onSquareClick, piece, color, selected }: SquareProps): JSX.Element {
    return (
        <div className={`square ${color} ${selected ? "selected" : ""}`} onClick={onSquareClick}>{piece ? <img src='https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg'></img> : ""}</div>
    )
}