import { useState } from "react";

function Square({ value, onSquareClick }) {
  // const [value, setValue] = useState(null);
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  //export default function Board() {
  //const [squares, setSquares] = useState(Array(9).fill(null));
  //const [xIsNext, setXIsNext] = useState(true);
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    //setXIsNext(!xIsNext);
    //setSquares(nextSquares);
    onPlay(nextSquares);
  }

  // const winner = calculateWinner(squares);
  // let status;
  // if (winner) {
  //   status = 'Winner: ' + winner;
  // } else {
  //   status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  // }

  //let status = calculateWinner(squares) ? "Winner: " + calculateWinner(squares) : "Next player: " + (xIsNext ? "X" : "O");

  let status = calculateWinner(squares) ? "Winner: " + calculateWinner(squares) : currentMove == 9 ? "Game ends: Draw" : "Next player: " + (xIsNext ? "X" : "O");

  const boardRows = [];
  for (let i = 0; i < 9; i+=3) {
    const boardSquares = [];
    for (let j = i; j < i + 3; j++) {
      boardSquares.push(<Square value={squares[j]} onSquareClick={() => handleClick(j)} />);
    }
    boardRows.push(<div className="board-row">{boardSquares}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  //const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    //setHistory([...history, nextSquares]);
    //setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    // setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    if (move > 0) {
      let description = move == 1 ? "Go to game start" : "Go to move #" + (move - 1);
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move - 1)}>{description}</button>
        </li>
      );
    }
    return;
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} />
      </div>
      <div className="game-info">
        <ol>
          {moves}
          <li>You are on move {currentMove}</li>
        </ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
      return squares[a];
    }
  }
  return null;
}
