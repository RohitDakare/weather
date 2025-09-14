import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const quizSteps = [
  {
    question: "What's your age range?",
    type: "single",
    field: "age",
    options: [
      { label: "16-20", value: 18 },
      { label: "21-25", value: 23 },
      { label: "26-30", value: 28 },
      { label: "31+", value: 32 }
    ]
  },
  {
    question: "Which styles speak to you? ✨",
    type: "multiple", 
    field: "style_preferences",
    options: [
      { label: "🌻 Casual Chic", value: "casual_chic" },
      { label: "🦋 Boho", value: "boho" },
      { label: "✨ Minimalist", value: "minimalist" },
      { label: "🔥 Trendy", value: "trendy" },
      { label: "💕 Romantic", value: "romantic" },
      { label: "⚡ Edgy", value: "edgy" }
    ]
  },
  {
    question: "What's your body type?",
    type: "single",
    field: "body_type", 
    options: [
      { label: "Petite", value: "petite" },
      { label: "Tall", value: "tall" },
      { label: "Curvy", value: "curvy" },
      { label: "Athletic", value: "athletic" },
      { label: "Plus Size", value: "plus_size" }
    ]
  },
  {
    question: "What colors make you feel amazing?",
    type: "multiple",
    field: "color_preferences",
    options: [
      { label: "🤍 Neutrals", value: "neutrals" },
      { label: "🌸 Pastels", value: "pastels" },
      { label: "🌈 Bold Colors", value: "bold_colors" },
      { label: "🍂 Earth Tones", value: "earth_tones" },
      { label: "🖤 Black & White", value: "black_white" }
    ]
  },
  {
    question: "What's your lifestyle?",
    type: "single", 
    field: "lifestyle",
    options: [
      { label: "📚 Student", value: "student" },
      { label: "💼 Working Professional", value: "working_professional" },
      { label: "💻 Freelancer", value: "freelancer" },
      { label: "🏠 Stay at Home", value: "stay_at_home" }
    ]
  }
];

export default function StyleQuiz({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    style_preferences: [],
    color_preferences: []
  });

  const currentQuestion = quizSteps[currentStep];

  const handleAnswer = (value) => {
    const newAnswers = { ...answers };
    
    if (currentQuestion.type === "multiple") {
      const currentArray = newAnswers[currentQuestion.field] || [];
      if (currentArray.includes(value)) {
        newAnswers[currentQuestion.field] = currentArray.filter(v => v !== value);
      } else {
        newAnswers[currentQuestion.field] = [...currentArray, value];
      }
    } else {
      newAnswers[currentQuestion.field] = value;
    }
    
    setAnswers(newAnswers);
  };

  const canContinue = () => {
    if (currentQuestion.type === "multiple") {
      return (answers[currentQuestion.field] || []).length > 0;
    }
    return answers[currentQuestion.field] !== undefined;
  };

  const handleNext = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers);
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-full">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Let's Find Your Perfect Style ✨
        </CardTitle>
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            {quizSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-center mb-6 text-gray-800">
              {currentQuestion.question}
            </h3>
            
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => {
                const isSelected = currentQuestion.type === "multiple" 
                  ? (answers[currentQuestion.field] || []).includes(option.value)
                  : answers[currentQuestion.field] === option.value;
                
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full p-4 text-left justify-start transition-all duration-300 rounded-xl ${
                      isSelected 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg transform scale-105' 
                        : 'bg-gray-50 hover:bg-pink-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {option.label}
                    {isSelected && currentQuestion.type === "multiple" && (
                      <Badge className="ml-auto bg-white/20 text-white border-0">
                        ✓
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
            
            <Button
              onClick={handleNext}
              disabled={!canContinue()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl py-3 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep < quizSteps.length - 1 ? (
                <>
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                "Complete Setup ✨"
              )}
            </Button>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}