import React, { useState, useEffect } from 'react';
import { Enemy, PowerSkill } from '../types/game';
import { Sword, Shield, Heart, Brain, Clock, Zap, Skull, Flame, Droplets, Plus } from 'lucide-react';
import { TriviaQuestion, getQuestionByZone } from '../utils/triviaQuestions';

interface CombatProps {
  enemy: Enemy;
  playerStats: {
    hp: number;
    maxHp: number;
    atk: number;
    def: number;
  };
  onAttack: (hit: boolean, category?: string) => void;
  onLose: () => void; // ✅ Added
  combatLog: string[];
  gameMode: {
    current: 'normal' | 'blitz' | 'bloodlust' | 'crazy';
    speedModeActive: boolean;
    survivalLives: number;
    maxSurvivalLives: number;
  };
  knowledgeStreak: {
    current: number;
    best: number;
    multiplier: number;
  };
  powerSkills: PowerSkill[];
}

export const Combat: React.FC<CombatProps> = ({
  enemy,
  playerStats,
  onAttack,
  onLose, // ✅ Added
  combatLog,
  gameMode,
  knowledgeStreak,
  powerSkills
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [showFreeAnswer, setShowFreeAnswer] = useState(false);

  const questionTime = (gameMode.current === 'blitz' || gameMode.current === 'bloodlust') ? 3 : 5;

  const scholarSkill = powerSkills.find(skill => skill.effect.type === 'scholar' && skill.isActive);
  const bonusTime = scholarSkill ? scholarSkill.effect.value || 0 : 0;
  const totalQuestionTime = questionTime + bonusTime;

  const freeAnswerSkill = powerSkills.find(skill => skill.effect.type === 'free_answer' && skill.isActive);

  useEffect(() => {
    const question = getQuestionByZone(enemy.zone);
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setTimeLeft(totalQuestionTime);
    setShowResult(false);
    setLastAnswerCorrect(null);
    setShowFreeAnswer(freeAnswerSkill ? true : false);
  }, [enemy, totalQuestionTime, freeAnswerSkill]);

  useEffect(() => {
    if (!currentQuestion || isAnswering || showResult) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, isAnswering, showResult]);

  // ✅ Detect player defeat and call onLose
  useEffect(() => {
    if (playerStats.hp <= 0) {
      onLose();
    }
  }, [playerStats.hp, onLose]);

  const handleAnswer = (answerIndex: number | null) => {
    if (isAnswering || !currentQuestion) return;

    setIsAnswering(true);
    setSelectedAnswer(answerIndex);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    setLastAnswerCorrect(isCorrect);
    setShowResult(true);

    setTimeout(() => {
      onAttack(isCorrect, currentQuestion.category);

      const newQuestion = getQuestionByZone(enemy.zone);
      setCurrentQuestion(newQuestion);
      setSelectedAnswer(null);
      setIsAnswering(false);
      setTimeLeft(totalQuestionTime);
      setShowResult(false);
      setLastAnswerCorrect(null);
      setShowFreeAnswer(false);
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBorder = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'border-green-400';
      case 'medium': return 'border-yellow-400';
      case 'hard': return 'border-red-400';
      default: return 'border-gray-400';
    }
  };

  const getModeIcon = () => {
    switch (gameMode.current) {
      case 'blitz': return <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />;
      case 'bloodlust': return <Sword className="w-5 h-5 text-red-400 animate-pulse" />;
      case 'crazy': return <Skull className="w-5 h-5 text-purple-400 animate-pulse" />;
      default: return <Clock className="w-5 h-5 text-blue-400" />;
    }
  };

  const getModeColor = () => {
    switch (gameMode.current) {
      case 'blitz': return 'bg-yellow-600';
      case 'bloodlust': return 'bg-red-600';
      case 'crazy': return 'bg-purple-600';
      default: return 'bg-blue-600';
    }
  };

  if (!currentQuestion) {
    return (
      <div className="bg-gradient-to-br from-red-900 via-purple-900 to-black p-3 sm:p-6 rounded-lg shadow-2xl">
        <div className="text-center py-8">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mb-4"></div>
          <p className="text-white text-lg">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-900 via-purple-900 to-black p-3 sm:p-6 rounded-lg shadow-2xl">
      {/* ... all existing UI rendering ... */}

      {/* ⚠️ Nothing else needs to change! The logic is now loss-aware via the useEffect above */}
    </div>
  );
};
