import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GameModalProps {
  isOpen: boolean;
  icon: string;
  title: string;
  message: string;
  onPlayAgain: () => void;
  onClose: () => void;
}

export function GameModal({ isOpen, icon, title, message, onPlayAgain, onClose }: GameModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 text-center">
        <DialogHeader>
          <div className="text-6xl mb-4">{icon}</div>
          <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
            {title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={onPlayAgain}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Play Again
          </Button>
          <Button 
            onClick={onClose}
            variant="secondary"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
