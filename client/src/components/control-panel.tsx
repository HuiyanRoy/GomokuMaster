import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Brain, Gamepad2, BarChart3, HelpCircle, Play, RotateCcw, Undo } from "lucide-react";
import { Difficulty } from "@/pages/gomoku";

interface ControlPanelProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  stats: {
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
  };
}

const difficultyOptions = [
  { value: 'simple', label: 'Simple', description: 'Random moves', stars: 1 },
  { value: 'easy', label: 'Easy', description: 'Basic blocking', stars: 2 },
  { value: 'medium-easy', label: 'Medium-Easy', description: 'Pattern recognition', stars: 3 },
  { value: 'medium', label: 'Medium', description: 'Strategic thinking', stars: 4 },
  { value: 'medium-hard', label: 'Medium-Hard', description: 'Advanced tactics', stars: 5 },
  { value: 'expert', label: 'Expert', description: 'Master-level play', stars: 6 },
] as const;

export function ControlPanel({
  difficulty,
  onDifficultyChange,
  onNewGame,
  onReset,
  onUndo,
  canUndo,
  stats,
}: ControlPanelProps) {
  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Difficulty Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Difficulty
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {difficultyOptions.map((option) => (
            <label
              key={option.value}
              className={`
                flex items-center p-3 rounded-lg cursor-pointer transition-colors
                ${difficulty === option.value 
                  ? 'bg-blue-50 border-2 border-blue-200' 
                  : 'bg-gray-50 hover:bg-gray-100'
                }
              `}
            >
              <input
                type="radio"
                name="difficulty"
                value={option.value}
                checked={difficulty === option.value}
                onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                className="mr-3 text-blue-600"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-800">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
              <div className="flex ml-auto">
                {Array.from({ length: 6 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < option.stars ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Game Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-green-600" />
            Game Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={onNewGame}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Play className="h-4 w-4 mr-2" />
            New Game
          </Button>
          
          <Button 
            onClick={onReset}
            variant="secondary"
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Board
          </Button>
          
          <Button 
            onClick={onUndo}
            variant="outline"
            className="w-full"
            disabled={!canUndo}
          >
            <Undo className="h-4 w-4 mr-2" />
            Undo Move
          </Button>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Games Won</span>
            <span className="font-bold text-green-600">{stats.wins}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Games Lost</span>
            <span className="font-bold text-red-600">{stats.losses}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Draws</span>
            <span className="font-bold text-gray-600">{stats.draws}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Win Rate</span>
            <span className="font-bold text-blue-600">{stats.winRate}%</span>
          </div>
        </CardContent>
      </Card>

      {/* How to Play */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
            How to Play
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Click on empty squares to place your black stones</p>
            <p>• Get 5 stones in a row (horizontal, vertical, or diagonal) to win</p>
            <p>• Block the computer from getting 5 in a row</p>
            <p>• Choose difficulty level to match your skill</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
