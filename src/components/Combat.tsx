import React, { useState, useEffect } from 'react';
import { Enemy, PowerSkill } from '../types/game';
import {
  Sword, Shield, Heart, Brain, Clock, Zap, Skull, Droplets
} from 'lucide-react';
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
  onLose: () => void;
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
  onLose,
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

  // Load new question & reset state on enemy, time, or free answer skill change
  useEffect(() => {
    const question = getQuestionByZone(enemy.zone);
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setTimeLeft(totalQuestionTime);
    setShowResult(false);
    setLastAnswerCorrect(null);
    setShowFreeAnswer(!!freeAnswerSkill);
  }, [enemy, totalQuestionTime, freeAnswerSkill]);

  // Timer countdown effect
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

  // Check player HP to trigger loss
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
      const nextQuestion = getQuestionByZone(enemy.zone);
      setCurrentQuestion(nextQuestion);
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
      <div className="p-4 text-center text-white bg-gray-900 rounded-lg">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full mb-4"></div>
        <p>Loading question...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-900 via-purple-900 to-black p-4 rounded-lg shadow-2xl text-white space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-xl font-bold">
          <h2>Combat - Zone {enemy.zone}</h2>
          {getModeIcon()}
        </div>
        <p className="text-red-300">{enemy.name}</p>
        <div className="mt-2 flex justify-center items-center gap-4 text-sm">
          <span className={`px-2 py-1 rounded ${getModeColor()}`}>{gameMode.current.toUpperCase()} MODE</span>
          {knowledgeStreak.current > 0 && (
            <span className="text-yellow-300">🔥 {knowledgeStreak.current} Streak (+{Math.round((knowledgeStreak.multiplier - 1) * 100)}%)</span>
          )}
        </div>
      </div>

      {/* Health Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-black/30 p-3 rounded-lg">
          <div className="flex gap-2 items-center">
            <Heart className="text-red-400" />
            <span>You</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full mt-1">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${(playerStats.hp / playerStats.maxHp) * 100}%` }}
            />
          </div>
          <p className="text-xs mt-1">{playerStats.hp}/{playerStats.maxHp}</p>
        </div>

        <div className="bg-black/30 p-3 rounded-lg">
          <div className="flex gap-2 items-center">
            <Heart className="text-red-400" />
            <span>{enemy.name}</span>
            {enemy.isPoisoned && <Droplets className="text-green-400 animate-pulse" />}
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full mt-1">
            <div
              className="bg-red-500 h-2 rounded-full transition-all"
              style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
            />
          </div>
          <p className="text-xs mt-1">{enemy.hp}/{enemy.maxHp}</p>
        </div>
      </div>

      {/* Question */}
      <div className={`bg-black/40 p-4 border-2 rounded-lg ${getDifficultyBorder(currentQuestion.difficulty)}`}>
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{currentQuestion.category}</span>
          <span className={getDifficultyColor(currentQuestion.difficulty)}>
            {currentQuestion.difficulty.toUpperCase()}
          </span>
        </div>

        <p className="text-white font-semibold mb-3">{currentQuestion.question}</p>
        <div className="grid grid-cols-2 gap-2">
          {currentQuestion.answers.map((answer, index) => (
            <button
              key={index}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border
                ${
                  selectedAnswer === index
                    ? (index === currentQuestion.correctAnswer
                      ? 'bg-green-600 border-green-300'
                      : 'bg-red-600 border-red-300')
                    : 'bg-gray-800 hover:bg-gray-700 border-gray-700'
                }`}
              onClick={() => handleAnswer(index)}
              disabled={isAnswering || showResult}
            >
              {answer}
            </button>
          ))}
        </div>

        {/* Timer */}
        <div className="mt-3 text-center text-xs text-gray-300">
          Time Left: <span className="font-bold text-white">{timeLeft}s</span>
        </div>

        {/* Free answer skill indicator */}
        {showFreeAnswer && (
          <div className="mt-2 text-green-400 text-center text-sm animate-pulse">
            Free answer used! No penalty for wrong choice.
          </div>
        )}
      </div>

      {/* Combat Log */}
      <div className="bg-black/20 p-3 rounded-lg text-xs max-h-32 overflow-y-auto space-y-1">
        {combatLog.slice(-5).map((log, i) => (
          <div key={i} className="text-gray-300">• {log}</div>
        ))}
      </div>
    </div>
  );
};
