import React, { useState, useEffect } from 'react';
import { Mining as MiningType } from '../types/game';
import { Pickaxe, Gem } from 'lucide-react';

interface MiningProps {
  mining: MiningType;
  gems: number;
  onMineGem: (x: number, y: number) => boolean;
  onPurchaseTool: (toolId: string) => boolean;
}

interface GemNode {
  x: number;
  y: number;
  clicks: number;
  maxClicks: number;
  id: string;
}

export const Mining: React.FC<MiningProps> = ({ mining, gems, onMineGem }) => {
  const [gemNodes, setGemNodes] = useState<GemNode[]>([]);
  const [lastMineTime, setLastMineTime] = useState(0);

  const GRID_SIZE = 5;
  const MINE_COOLDOWN = 0;

  const generateGemNode = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      clicks: 0,
      maxClicks: 1,
      id: Math.random().toString(36).substr(2, 9),
    };
  };

  useEffect(() => {
    if (gemNodes.length === 0) {
      setGemNodes([generateGemNode()]);
    }
  }, [gemNodes.length]);

  const handleCellClick = (x: number, y: number) => {
    const now = Date.now();
    if (now - lastMineTime < MINE_COOLDOWN) return;

    const gemNode = gemNodes.find((node) => node.x === x && node.y === y);
    if (!gemNode) return;

    setLastMineTime(now);

    const success = onMineGem(x, y);
    if (success) {
      setGemNodes((prev) => {
        const updated = prev.filter((node) => node.id !== gemNode.id);
        updated.push(generateGemNode());
        return updated;
      });
    }
  };

  const renderMiningGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const gemNode = gemNodes.find((node) => node.x === x && node.y === y);
        const hasGem = !!gemNode;

        cells.push(
          <div
            key={`${x}-${y}`}
            onClick={() => handleCellClick(x, y)}
            className={`aspect-square border-2 rounded-lg cursor-pointer transition-all duration-200 relative overflow-hidden ${
              hasGem
                ? 'border-purple-400 bg-gradient-to-br from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 shadow-lg shadow-purple-500/30'
                : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {hasGem && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Gem className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400 animate-pulse" />
              </div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 p-4 sm:p-6 rounded-lg shadow-2xl">
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Pickaxe className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Gem Mining</h2>
        </div>
        <p className="text-gray-300 text-sm sm:text-base">Click gem nodes to mine them instantly!</p>

        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="flex items-center gap-2 text-purple-300">
            <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold text-sm sm:text-base">{gems} Gems</span>
          </div>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <h3 className="text-white font-semibold mb-3 text-center text-sm sm:text-base">Mining Area (5x5)</h3>
        <div className="grid grid-cols-5 gap-1 sm:gap-2 max-w-sm mx-auto">
          {renderMiningGrid()}
        </div>
        <p className="text-center text-gray-400 text-xs sm:text-sm mt-3">
          Purple gems appear randomly. Click once to mine a gem!
        </p>
      </div>
    </div>
  );
};

