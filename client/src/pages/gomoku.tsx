import { useState, useCallback } from "react";
import { GameBoard } from "@/components/game-board";
import { ControlPanel } from "@/components/control-panel";
import { GameModal } from "@/components/game-modal";
import { makeAIMove } from "@/lib/gomoku-ai";
import { checkWin, getWinningCells } from "@/lib/game-logic";

export type Player = 1 | 2; // 1: Human (black), 2: Computer (white)
export type CellValue = 0 | Player; // 0: empty
export type Difficulty = 'simple' | 'easy' | 'medium-easy' | 'medium' | 'medium-hard' | 'expert';

export interface GameStats {
  wins: number;
  losses: number;
  draws: number;
}

export interface Move {
  row: number;
  col: number;
  player: Player;
}

export interface GameState {
  board: CellValue[][];
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | null;
  difficulty: Difficulty;
  moveHistory: Move[];
  stats: GameStats;
  winningCells: {row: number, col: number}[];
}

export default function Gomoku() {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(10).fill(null).map(() => Array(10).fill(0)),
    currentPlayer: 1,
    gameOver: false,
    winner: null,
    difficulty: 'expert',
    moveHistory: [],
    stats: {
      wins: parseInt(localStorage.getItem('gomoku-wins') || '0'),
      losses: parseInt(localStorage.getItem('gomoku-losses') || '0'),
      draws: parseInt(localStorage.getItem('gomoku-draws') || '0'),
    },
    winningCells: [],
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    icon: '🏆',
    title: '',
    message: '',
  });

  const [isComputerThinking, setIsComputerThinking] = useState(false);

  const updateStats = useCallback((result: 'win' | 'loss' | 'draw') => {
    const newStats = { ...gameState.stats };
    newStats[result === 'win' ? 'wins' : result === 'loss' ? 'losses' : 'draws']++;
    
    localStorage.setItem('gomoku-wins', newStats.wins.toString());
    localStorage.setItem('gomoku-losses', newStats.losses.toString());
    localStorage.setItem('gomoku-draws', newStats.draws.toString());
    
    return newStats;
  }, [gameState.stats]);

  const showModal = useCallback((icon: string, title: string, message: string) => {
    setModalState({
      isOpen: true,
      icon,
      title,
      message,
    });
  }, []);

  const makeMove = useCallback((row: number, col: number, player: Player) => {
    if (gameState.board[row][col] !== 0 || gameState.gameOver) return false;

    const newBoard = gameState.board.map(r => [...r]);
    newBoard[row][col] = player;
    
    const newMove: Move = { row, col, player };
    const newMoveHistory = [...gameState.moveHistory, newMove];

    // Check for win
    const hasWin = checkWin(newBoard, row, col, player);
    let newStats = gameState.stats;
    let winner: Player | null = null;
    let gameOver = false;

    if (hasWin) {
      winner = player;
      gameOver = true;
      const winningCells = getWinningCells(newBoard, row, col, player);
      
      if (player === 1) {
        newStats = updateStats('win');
        showModal('🏆', 'Congratulations!', 'You won this game!');
      } else {
        newStats = updateStats('loss');
        showModal('😔', 'Game Over', 'Computer won this game!');
      }

      setGameState(prev => ({
        ...prev,
        board: newBoard,
        moveHistory: newMoveHistory,
        winner,
        gameOver,
        stats: newStats,
        winningCells,
      }));
    } else if (newMoveHistory.length === 100) {
      // Draw
      gameOver = true;
      newStats = updateStats('draw');
      showModal('🤝', 'Draw!', 'The game ended in a draw!');
      
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        moveHistory: newMoveHistory,
        gameOver,
        stats: newStats,
      }));
    } else {
      // Continue game
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        moveHistory: newMoveHistory,
        currentPlayer: player === 1 ? 2 : 1,
      }));
    }

    return true;
  }, [gameState, updateStats, showModal]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameState.currentPlayer !== 1 || gameState.gameOver || isComputerThinking) return;
    
    const success = makeMove(row, col, 1);
    
    if (success && !gameState.gameOver) {
      // Computer's turn - use updated state
      setIsComputerThinking(true);
      setTimeout(() => {
        setGameState(currentState => {
          if (currentState.gameOver) {
            setIsComputerThinking(false);
            return currentState;
          }
          
          const computerMove = makeAIMove(currentState.board, currentState.difficulty);
          if (computerMove) {
            // Make computer move directly with current state
            const newBoard = currentState.board.map(r => [...r]);
            newBoard[computerMove.row][computerMove.col] = 2;
            
            const newMove: Move = { row: computerMove.row, col: computerMove.col, player: 2 };
            const newMoveHistory = [...currentState.moveHistory, newMove];

            // Check for computer win
            const hasWin = checkWin(newBoard, computerMove.row, computerMove.col, 2);
            if (hasWin) {
              const winningCells = getWinningCells(newBoard, computerMove.row, computerMove.col, 2);
              const newStats = updateStats('loss');
              showModal('😔', 'Game Over', 'Computer won this game!');
              
              setIsComputerThinking(false);
              return {
                ...currentState,
                board: newBoard,
                moveHistory: newMoveHistory,
                winner: 2,
                gameOver: true,
                stats: newStats,
                winningCells,
              };
            } else if (newMoveHistory.length === 100) {
              // Draw
              const newStats = updateStats('draw');
              showModal('🤝', 'Draw!', 'The game ended in a draw!');
              
              setIsComputerThinking(false);
              return {
                ...currentState,
                board: newBoard,
                moveHistory: newMoveHistory,
                gameOver: true,
                stats: newStats,
              };
            }

            // Continue game
            setIsComputerThinking(false);
            return {
              ...currentState,
              board: newBoard,
              moveHistory: newMoveHistory,
              currentPlayer: 1,
            };
          }
          
          setIsComputerThinking(false);
          return currentState;
        });
      }, 500);
    }
  }, [gameState, makeMove, isComputerThinking, updateStats, showModal]);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      board: Array(10).fill(null).map(() => Array(10).fill(0)),
      currentPlayer: 1,
      gameOver: false,
      winner: null,
      moveHistory: [],
      winningCells: [],
    }));
    setModalState(prev => ({ ...prev, isOpen: false }));
    setIsComputerThinking(false);
  }, []);

  const changeDifficulty = useCallback((difficulty: Difficulty) => {
    setGameState(prev => ({ ...prev, difficulty }));
  }, []);

  const undoMove = useCallback(() => {
    if (gameState.moveHistory.length < 2 || gameState.gameOver) return;
    
    // Remove last two moves (human and computer)
    const newMoveHistory = gameState.moveHistory.slice(0, -2);
    const newBoard = Array(10).fill(null).map(() => Array(10).fill(0));
    
    // Replay moves
    newMoveHistory.forEach(move => {
      newBoard[move.row][move.col] = move.player;
    });
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      moveHistory: newMoveHistory,
      currentPlayer: 1,
      gameOver: false,
      winner: null,
      winningCells: [],
    }));
  }, [gameState]);

  const getWinRate = () => {
    const total = gameState.stats.wins + gameState.stats.losses + gameState.stats.draws;
    return total === 0 ? 0 : Math.round((gameState.stats.wins / total) * 100);
  };

  const getGameStatus = () => {
    if (gameState.gameOver) {
      if (gameState.winner === 1) return "You won!";
      if (gameState.winner === 2) return "Computer won!";
      return "Draw!";
    }
    if (isComputerThinking) return "Computer is thinking...";
    return gameState.currentPlayer === 1 ? "Your turn - Click to place your stone" : "Computer's turn";
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-full bg-black"></div>
            Gomoku
            <div className="w-6 h-6 rounded-full bg-gray-400"></div>
          </h1>
          <p className="text-gray-600">Connect 5 stones in a row to win!</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
          {/* Game Board */}
          <div className="flex-shrink-0">
            <GameBoard
              board={gameState.board}
              onCellClick={handleCellClick}
              winningCells={gameState.winningCells}
              disabled={gameState.currentPlayer !== 1 || gameState.gameOver || isComputerThinking}
            />
            
            {/* Game Status */}
            <div className="mt-4 text-center">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-black shadow-md"></div>
                    <span className="font-medium">You</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-400">VS</div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300 shadow-md"></div>
                    <span className="font-medium">Computer</span>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium flex items-center justify-center gap-2">
                    {isComputerThinking ? (
                      <>⏳ {getGameStatus()}</>
                    ) : gameState.gameOver ? (
                      <>🏁 {getGameStatus()}</>
                    ) : (
                      <>▶️ {getGameStatus()}</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <ControlPanel
            difficulty={gameState.difficulty}
            onDifficultyChange={changeDifficulty}
            onNewGame={resetGame}
            onReset={resetGame}
            onUndo={undoMove}
            canUndo={gameState.moveHistory.length >= 2 && !gameState.gameOver}
            stats={{
              ...gameState.stats,
              winRate: getWinRate(),
            }}
          />
        </div>
      </div>

      {/* Game Modal */}
      <GameModal
        isOpen={modalState.isOpen}
        icon={modalState.icon}
        title={modalState.title}
        message={modalState.message}
        onPlayAgain={resetGame}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
