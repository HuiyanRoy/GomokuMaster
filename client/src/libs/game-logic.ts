import { CellValue } from "@/pages/gomoku";

export function checkWin(board: CellValue[][], row: number, col: number, player: 1 | 2): boolean {
  const directions = [
    [0, 1], [1, 0], [1, 1], [1, -1] // horizontal, vertical, diagonal
  ];
  
  for (const [dr, dc] of directions) {
    let count = 1;
    
    // Check in positive direction
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === player) {
      count++;
      r += dr;
      c += dc;
    }
    
    // Check in negative direction
    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === player) {
      count++;
      r -= dr;
      c -= dc;
    }
    
    if (count >= 5) {
      return true;
    }
  }
  
  return false;
}

export function getWinningCells(board: CellValue[][], row: number, col: number, player: 1 | 2): {row: number, col: number}[] {
  const directions = [
    [0, 1], [1, 0], [1, 1], [1, -1] // horizontal, vertical, diagonal
  ];
  
  for (const [dr, dc] of directions) {
    let count = 1;
    const cells = [{row, col}];
    
    // Check in positive direction
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === player) {
      count++;
      cells.push({row: r, col: c});
      r += dr;
      c += dc;
    }
    
    // Check in negative direction
    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < 10 && c >= 0 && c < 10 && board[r][c] === player) {
      count++;
      cells.push({row: r, col: c});
      r -= dr;
      c -= dc;
    }
    
    if (count >= 5) {
      return cells.slice(0, 5); // Return first 5 cells of the winning line
    }
  }
  
  return [];
}
