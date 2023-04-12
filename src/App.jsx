import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  let status = calculateWinner(squares) ? "Winner: " + calculateWinner(squares) : currentMove == 9 ? "Game ends: Draw" : "Next player: " + (xIsNext ? "X" : "O");

  const boardRows = [];
  for (let i = 0; i < 9; i += 3) {
    const boardSquares = [];
    for (let j = i; j < i + 3; j++) {
      boardSquares.push(<Square key={j} value={squares[j]} onSquareClick={() => handleClick(j)} />);
    }
    boardRows.push(
      <div key={i} className="board-row">
        {boardSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [toggleView, setToggleView] = useState(false);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

//   const moves = [
//     history.map((squares, move) => {
//       if (move > 0) {
//         let description = move == 1 ? "Go to game start" : "Go to move #" + (move - 1);
//         console.log(move)
//         return (
//           <li key={move}>
//             <button onClick={() => setCurrentMove(move - 1)}>{description}</button>
//           </li>
//         );
//       }
//       return;
//     }),
//     <li key={currentMove}>You are on move {currentMove}</li>
//   ];
// console.log(currentMove)

  // const moves = history.map((squares, move) => {
  //   if (move > 0) {
  //     let description = move == 1 ? "Go to game start" : "Go to move #" + (move - 1);
  //     return (
  //       <li key={move}>
  //         <button onClick={() => setCurrentMove(move - 1)}>{description}</button>
  //       </li>
  //     );
  //   }
  //   return;
  // });

const moves = [];
history.map((squares, move) => {
      let description = move == 0 ? "Go to game start" : "Go to move #" + (move);
      moves.push(
        <li key={move}>
          <button onClick={() => setCurrentMove(move)}>{description}</button>
        </li>
      )
  });
  moves.push(<li key={10}>You are on move {currentMove}</li>);

  const actualMoves = toggleView ? [...moves].reverse() : moves;

  function handleToggleView() {
    setToggleView(!toggleView);
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} />
      </div>
      <div className="game-info">
        <ol>
          {actualMoves}
        </ol>
      </div>
      <button onClick={handleToggleView} style={{ marginLeft: 30, padding: 20 }}>
        <p>Toggle</p>
        <p>View</p>
      </button>
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
