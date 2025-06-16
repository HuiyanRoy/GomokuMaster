import { CellValue, Difficulty } from "@/pages/gomoku";

export interface AIMove {
  row: number;
  col: number;
}

// Evaluate a position for a player (higher = better for that player)
function evaluatePosition(board: CellValue[][], row: number, col: number, player: 1 | 2): number {
  const directions = [
    [0, 1], [1, 0], [1, 1], [1, -1] // horizontal, vertical, diagonal
  ];
  
  let score = 0;
  
  for (const [dr, dc] of directions) {
    let count = 1;
    let openEnds = 0;
    
    // Check positive direction
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === player) {
      count++;
      r += dr;
      c += dc;
    }
    if (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === 0) {
      openEnds++;
    }
    
    // Check negative direction
    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === player) {
      count++;
      r -= dr;
      c -= dc;
    }
    if (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === 0) {
      openEnds++;
    }
    
    // Score based on count and open ends
    if (count >= 5) {
      score += 100000; // Win
    } else if (count === 4) {
      score += openEnds === 2 ? 10000 : openEnds === 1 ? 5000 : 0;
    } else if (count === 3) {
      score += openEnds === 2 ? 1000 : openEnds === 1 ? 100 : 0;
    } else if (count === 2) {
      score += openEnds === 2 ? 100 : openEnds === 1 ? 10 : 0;
    }
  }
  
  return score;
}

// Check if placing a stone would create a win
function wouldWin(board: CellValue[][], row: number, col: number, player: 1 | 2): boolean {
  const directions = [
    [0, 1], [1, 0], [1, 1], [1, -1]
  ];
  
  for (const [dr, dc] of directions) {
    let count = 1;
    
    // Check positive direction
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === player) {
      count++;
      r += dr;
      c += dc;
    }
    
    // Check negative direction
    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === player) {
      count++;
      r -= dr;
      c -= dc;
    }
    
    if (count >= 5) return true;
  }
  
  return false;
}

// Check if placing a stone would create a threat (4 in a row with open ends)
function wouldCreateThreat(board: CellValue[][], row: number, col: number, player: 1 | 2): boolean {
  const directions = [
    [0, 1], [1, 0], [1, 1], [1, -1]
  ];
  
  for (const [dr, dc] of directions) {
    let count = 1;
    let openEnds = 0;
    
    // Check positive direction
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === player) {
      count++;
      r += dr;
      c += dc;
    }
    if (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === 0) {
      openEnds++;
    }
    
    // Check negative direction
    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === player) {
      count++;
      r -= dr;
      c -= dc;
    }
    if (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === 0) {
      openEnds++;
    }
    
    // 4 in a row with at least one open end = threat
    if (count >= 4 && openEnds >= 1) return true;
  }
  
  return false;
}

// Check if there's an open three-in-a-row that needs blocking
function hasOpenThree(board: CellValue[][], row: number, col: number, player: 1 | 2): number {
  const directions = [
    [0, 1], [1, 0], [1, 1], [1, -1]
  ];
  
  let maxThreatLevel = 0;
  
  for (const [dr, dc] of directions) {
    let count = 1;
    let openEnds = 0;
    let spaces = 0; // Count spaces in the line for potential extension
    
    // Check positive direction
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < 10 && c >= 0 && c < 10 && (board[r][c] === player || board[r][c] === 0)) {
      if (board[r][c] === player) {
        count++;
      } else if (board[r][c] === 0) {
        spaces++;
        if (spaces === 1) { // Only count first space for potential extension
          break;
        }
      }
      r += dr;
      c += dc;
    }
    if (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === 0) {
      openEnds++;
    }
    
    // Check negative direction
    r = row - dr;
    c = col - dc;
    spaces = 0;
    while (r >= 0 && r < 10 && c >= 0 && c < 10 && (board[r][c] === player || board[r][c] === 0)) {
      if (board[r][c] === player) {
        count++;
      } else if (board[r][c] === 0) {
        spaces++;
        if (spaces === 1) {
          break;
        }
      }
      r -= dr;
      c -= dc;
    }
    if (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === 0) {
      openEnds++;
    }
    
    // Evaluate threat level
    if (count === 3 && openEnds === 2) {
      maxThreatLevel = Math.max(maxThreatLevel, 100); // High priority: open three
    } else if (count === 3 && openEnds === 1) {
      maxThreatLevel = Math.max(maxThreatLevel, 50); // Medium priority: semi-open three
    } else if (count === 2 && openEnds === 2) {
      maxThreatLevel = Math.max(maxThreatLevel, 20); // Lower priority: open two
    }
  }
  
  return maxThreatLevel;
}

// Get all empty cells
function getEmptyCells(board: CellValue[][]): AIMove[] {
  const emptyCells: AIMove[] = [];
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (board[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }
  return emptyCells;
}

// Simple AI: Random moves
function getSimpleMove(board: CellValue[][]): AIMove | null {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return null;
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Easy AI: Block obvious wins, otherwise random
function getEasyMove(board: CellValue[][]): AIMove | null {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return null;
  
  // Try to block human wins
  for (const move of emptyCells) {
    if (wouldWin(board, move.row, move.col, 1)) {
      return move;
    }
  }
  
  return getSimpleMove(board);
}

// Medium-Easy AI: Try to win, then block, then best position
function getMediumEasyMove(board: CellValue[][]): AIMove | null {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return null;
  
  // Try to win first
  for (const move of emptyCells) {
    if (wouldWin(board, move.row, move.col, 2)) {
      return move;
    }
  }
  
  // Try to block human wins
  for (const move of emptyCells) {
    if (wouldWin(board, move.row, move.col, 1)) {
      return move;
    }
  }
  
  // Block threats and open threes
  let bestMove = emptyCells[0];
  let bestScore = -1;
  
  for (const move of emptyCells) {
    let score = evaluatePosition(board, move.row, move.col, 2) - 
                evaluatePosition(board, move.row, move.col, 1) * 0.9;
    
    // Add threat detection for human player
    const humanThreat = hasOpenThree(board, move.row, move.col, 1);
    if (humanThreat > 0) {
      score += humanThreat * 10; // Prioritize blocking threats
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}

// Medium AI: More sophisticated evaluation
function getMediumMove(board: CellValue[][]): AIMove | null {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return null;
  
  // Try to win first
  for (const move of emptyCells) {
    if (wouldWin(board, move.row, move.col, 2)) {
      return move;
    }
  }
  
  // Try to block human wins
  for (const move of emptyCells) {
    if (wouldWin(board, move.row, move.col, 1)) {
      return move;
    }
  }
  
  // Block critical threats (4 in a row)
  for (const move of emptyCells) {
    if (wouldCreateThreat(board, move.row, move.col, 1)) {
      return move;
    }
  }
  
  // Evaluate all moves more thoroughly
  let bestMove = emptyCells[0];
  let bestScore = -Infinity;
  
  for (const move of emptyCells) {
    let score = evaluatePosition(board, move.row, move.col, 2) - 
                evaluatePosition(board, move.row, move.col, 1) * 1.1;
    
    // Add advanced threat detection
    const humanThreat = hasOpenThree(board, move.row, move.col, 1);
    if (humanThreat > 0) {
      score += humanThreat * 15; // Higher priority for blocking threats
    }
    
    // Bonus for creating own threats
    const computerThreat = hasOpenThree(board, move.row, move.col, 2);
    if (computerThreat > 0) {
      score += computerThreat * 8;
    }
    
    // Bonus for center positions
    const centerDistance = Math.abs(move.row - 4.5) + Math.abs(move.col - 4.5);
    score += (9 - centerDistance) * 5;
    
    // Bonus for positions near existing stones
    let nearbyStones = 0;
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        const r = move.row + dr;
        const c = move.col + dc;
        if (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] !== 0) {
          nearbyStones++;
        }
      }
    }
    score += nearbyStones * 10;
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}

// Medium-Hard AI: Advanced tactics
function getMediumHardMove(board: CellValue[][]): AIMove | null {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return null;
  
  // Try to win first
  for (const move of emptyCells) {
    if (wouldWin(board, move.row, move.col, 2)) {
      return move;
    }
  }
  
  // Try to block human wins (highest priority)
  for (const move of emptyCells) {
    if (wouldWin(board, move.row, move.col, 1)) {
      return move;
    }
  }
  
  // Block critical threats (4 in a row) - second highest priority
  for (const move of emptyCells) {
    if (wouldCreateThreat(board, move.row, move.col, 1)) {
      return move;
    }
  }
  
  // Advanced threat analysis - look for multiple threats to block
  let criticalMoves = [];
  for (const move of emptyCells) {
    const humanThreat = hasOpenThree(board, move.row, move.col, 1);
    if (humanThreat >= 100) { // Open three - very dangerous
      criticalMoves.push({ move, priority: humanThreat });
    }
  }
  
  // If there are critical moves, handle the most dangerous one
  if (criticalMoves.length > 0) {
    criticalMoves.sort((a, b) => b.priority - a.priority);
    return criticalMoves[0].move;
  }
  
  // Look for double threats and advanced patterns
  let bestMove = emptyCells[0];
  let bestScore = -Infinity;
  
  for (const move of emptyCells) {
    let score = 0;
    
    // Evaluate for computer
    score += evaluatePosition(board, move.row, move.col, 2) * 1.2;
    
    // Evaluate blocking human
    score -= evaluatePosition(board, move.row, move.col, 1) * 1.3;
    
    // Advanced threat detection
    const humanThreat = hasOpenThree(board, move.row, move.col, 1);
    if (humanThreat > 0) {
      score += humanThreat * 25; // Very high priority for blocking threats
    }
    
    // Bonus for creating own threats
    const computerThreat = hasOpenThree(board, move.row, move.col, 2);
    if (computerThreat > 0) {
      score += computerThreat * 12;
    }
    
    // Check for double threat creation
    const tempBoard = board.map(row => [...row]);
    tempBoard[move.row][move.col] = 2;
    
    let threats = 0;
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (tempBoard[r][c] === 0 && wouldWin(tempBoard, r, c, 2)) {
          threats++;
        }
      }
    }
    score += threats * 8000; // Massive bonus for creating multiple threats
    
    // Strategic positioning
    const centerDistance = Math.abs(move.row - 4.5) + Math.abs(move.col - 4.5);
    score += (9 - centerDistance) * 8;
    
    // Nearby stones bonus
    let nearbyStones = 0;
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        const r = move.row + dr;
        const c = move.col + dc;
        if (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] !== 0) {
          nearbyStones++;
        }
      }
    }
    score += nearbyStones * 15;
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}

// Expert AI: Master-level play with deep analysis
function getExpertMove(board: CellValue[][]): AIMove | null {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return null;
  
  // Immediate win takes absolute priority
  for (const move of emptyCells) {
    if (wouldWin(board, move.row, move.col, 2)) {
      return move;
    }
  }
  
  // Block immediate human wins
  for (const move of emptyCells) {
    if (wouldWin(board, move.row, move.col, 1)) {
      return move;
    }
  }
  
  // Block critical threats (4 in a row) - absolute priority
  for (const move of emptyCells) {
    if (wouldCreateThreat(board, move.row, move.col, 1)) {
      return move;
    }
  }
  
  // Advanced multi-step threat analysis
  let criticalDefenseMoves = [];
  let offensiveMoves = [];
  
  for (const move of emptyCells) {
    const humanThreat = hasOpenThree(board, move.row, move.col, 1);
    const computerThreat = hasOpenThree(board, move.row, move.col, 2);
    
    if (humanThreat >= 100) { // Open three - extremely dangerous
      criticalDefenseMoves.push({ move, priority: humanThreat + 1000 });
    } else if (humanThreat >= 50) { // Semi-open three - dangerous
      criticalDefenseMoves.push({ move, priority: humanThreat + 500 });
    }
    
    if (computerThreat >= 50) { // Create own threats
      offensiveMoves.push({ move, priority: computerThreat });
    }
  }
  
  // Handle critical defense first
  if (criticalDefenseMoves.length > 0) {
    criticalDefenseMoves.sort((a, b) => b.priority - a.priority);
    return criticalDefenseMoves[0].move;
  }
  
  // Advanced pattern recognition and lookahead
  let bestMove = emptyCells[0];
  let bestScore = -Infinity;
  
  for (const move of emptyCells) {
    let score = 0;
    
    // Enhanced position evaluation
    score += evaluatePosition(board, move.row, move.col, 2) * 1.5;
    score -= evaluatePosition(board, move.row, move.col, 1) * 1.4;
    
    // Multi-level threat analysis
    const humanThreat = hasOpenThree(board, move.row, move.col, 1);
    const computerThreat = hasOpenThree(board, move.row, move.col, 2);
    
    if (humanThreat > 0) {
      score += humanThreat * 30; // Very high priority for blocking
    }
    if (computerThreat > 0) {
      score += computerThreat * 20; // High priority for creating threats
    }
    
    // Advanced lookahead: Check for fork creation (multiple threats)
    const tempBoard = board.map(row => [...row]);
    tempBoard[move.row][move.col] = 2;
    
    let threatsCreated = 0;
    let defensiveNeeds = 0;
    
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (tempBoard[r][c] === 0) {
          // Count threats we create
          if (wouldWin(tempBoard, r, c, 2)) {
            threatsCreated++;
          }
          if (hasOpenThree(tempBoard, r, c, 2) >= 50) {
            threatsCreated += 0.5;
          }
          
          // Count threats human could create
          if (wouldWin(tempBoard, r, c, 1)) {
            defensiveNeeds++;
          }
          if (hasOpenThree(tempBoard, r, c, 1) >= 100) {
            defensiveNeeds += 0.7;
          }
        }
      }
    }
    
    // Massive bonus for creating multiple threats (fork)
    if (threatsCreated >= 2) {
      score += 15000; // Almost guaranteed win
    } else if (threatsCreated >= 1.5) {
      score += 8000;
    }
    
    // Penalty for allowing human to create threats
    score -= defensiveNeeds * 3000;
    
    // Strategic positioning with enhanced evaluation
    const centerDistance = Math.abs(move.row - 4.5) + Math.abs(move.col - 4.5);
    score += (9 - centerDistance) * 12;
    
    // Advanced proximity analysis
    let strategicValue = 0;
    for (let dr = -3; dr <= 3; dr++) {
      for (let dc = -3; dc <= 3; dc++) {
        const r = move.row + dr;
        const c = move.col + dc;
        if (r >= 0 && r < 10 && c >= 0 && c < 10) {
          if (board[r][c] === 2) {
            const distance = Math.abs(dr) + Math.abs(dc);
            strategicValue += (4 - distance) * 8; // Closer = better
          } else if (board[r][c] === 1) {
            const distance = Math.abs(dr) + Math.abs(dc);
            strategicValue += (4 - distance) * 12; // Interfere with human plans
          }
        }
      }
    }
    score += strategicValue;
    
    // Pattern recognition: Look for specific winning formations
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dr, dc] of directions) {
      // Check for potential lines of 3 with gaps
      let patternScore = 0;
      for (let offset = -4; offset <= 0; offset++) {
        let ownStones = 0;
        let enemyStones = 0;
        let emptySpaces = 0;
        
        for (let i = 0; i < 5; i++) {
          const r = move.row + (offset + i) * dr;
          const c = move.col + (offset + i) * dc;
          
          if (r >= 0 && r < 10 && c >= 0 && c < 10) {
            if (board[r][c] === 2 || (r === move.row && c === move.col)) {
              ownStones++;
            } else if (board[r][c] === 1) {
              enemyStones++;
            } else {
              emptySpaces++;
            }
          }
        }
        
        // Evaluate pattern potential
        if (enemyStones === 0) { // No blocking
          if (ownStones >= 2) {
            patternScore += ownStones * ownStones * 100;
          }
        }
      }
      score += patternScore;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}

export function makeAIMove(board: CellValue[][], difficulty: Difficulty): AIMove | null {
  switch (difficulty) {
    case 'simple':
      return getSimpleMove(board);
    case 'easy':
      return getEasyMove(board);
    case 'medium-easy':
      return getMediumEasyMove(board);
    case 'medium':
      return getMediumMove(board);
    case 'medium-hard':
      return getMediumHardMove(board);
    case 'expert':
      return getExpertMove(board);
    default:
      return getMediumEasyMove(board);
  }
}
