import { CellValue } from "@/pages/gomoku";

interface GameBoardProps {
  board: CellValue[][];
  onCellClick: (row: number, col: number) => void;
  winningCells: {row: number, col: number}[];
  disabled: boolean;
}

export function GameBoard({ board, onCellClick, winningCells, disabled }: GameBoardProps) {
  const isWinningCell = (row: number, col: number) => {
    return winningCells.some(cell => cell.row === row && cell.col === col);
  };

  return (
    <div className="bg-board-brown p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-10 gap-1 bg-amber-900 p-2 rounded">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                game-cell w-8 h-8 md:w-10 md:h-10 bg-amber-100 border border-amber-300 
                cursor-pointer flex items-center justify-center rounded-sm 
                transition-colors duration-200
                ${!disabled && cell === 0 ? 'hover:bg-blue-50' : ''}
                ${disabled ? 'cursor-not-allowed' : ''}
              `}
              onClick={() => !disabled && onCellClick(rowIndex, colIndex)}
            >
              {cell !== 0 && (
                <div
                  className={`
                    stone w-6 h-6 md:w-8 md:h-8 rounded-full shadow-md transition-all duration-200
                    ${cell === 1 
                      ? 'bg-gradient-to-br from-gray-700 to-black' 
                      : 'bg-gradient-to-br from-white to-gray-200 border border-gray-300'
                    }
                    ${isWinningCell(rowIndex, colIndex) 
                      ? 'animate-pulse ring-4 ring-green-400 ring-opacity-60' 
                      : ''
                    }
                    animate-in zoom-in duration-300
                  `}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
