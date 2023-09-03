import React from 'react'

interface SquareProps {
    onSquareClick: () => void,
    piece: string,
    color: string,
}

export function Square({ onSquareClick, piece, color }: SquareProps): JSX.Element {
    return (
        <button className={`square ${color}`} onClick={onSquareClick} color={color}>{piece}</button>
    )
}