"use client";

import { useEffect, useState } from "react";

type TutorialStep = "multiplicando" | "passos" | "primeiro-input" | "complete";

interface OnboardingTutorialProps {
  isVisible: boolean;
  onDismiss: () => void;
  currentStep: TutorialStep;
  isTyping?: boolean;
}

export function OnboardingTutorial({
  isVisible,
  onDismiss,
  currentStep,
  isTyping,
}: OnboardingTutorialProps) {
  if (!isVisible) return null;

  return (
    <>
      {/* Overlay escuro suave com transição */}
      <div
        className="fixed inset-0 bg-black/20 pointer-events-none z-30 transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Balões de orientação por etapa com transições suaves */}
      {currentStep === "multiplicando" && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-auto" role="status" aria-live="polite" aria-label="Instruções do tutorial">
          <div className="bg-white border-2 border-blue-500 rounded-lg shadow-lg px-6 py-3 text-center text-xs sm:text-sm font-semibold text-gray-800 whitespace-nowrap animate-bounce transition-all duration-300">
            👀 Olhe para o número a multiplicar
          </div>
        </div>
      )}

      {currentStep === "passos" && (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 pointer-events-auto" role="status" aria-live="polite" aria-label="Próxima etapa do tutorial">
          <div className="bg-white border-2 border-green-500 rounded-lg shadow-lg px-4 py-2 text-xs sm:text-sm font-semibold text-gray-800 animate-in fade-in slide-in-from-right-4 duration-300">
            📋 Siga as regras deste quadro
          </div>
        </div>
      )}

      {currentStep === "primeiro-input" && (
        <div className="fixed bottom-28 right-4 z-40 pointer-events-auto" role="status" aria-live="polite" aria-label="Instruções para o primeiro input">
          <div className="bg-white border-2 border-purple-500 rounded-lg shadow-lg px-4 py-2 text-xs sm:text-sm font-semibold text-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {isTyping ? "⌨️ Digitando o valor..." : "Comece por aqui"}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-tutorial {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
          }
        }

        .animate-pulse-tutorial {
          animation: pulse-tutorial 2s infinite;
        }
      `}</style>
    </>
  );
}

export function useTutorial(multiplicadorId: string) {
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<TutorialStep>("multiplicando");

  const storageKey = `tutorial_${multiplicadorId}_seen`;

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem(storageKey);
    if (!hasSeenTutorial) {
      setIsTutorialActive(true);
    }
  }, [storageKey]);

  const advanceStep = () => {
    const steps: TutorialStep[] = ["multiplicando", "passos", "primeiro-input"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      completeTutorial();
    }
  };

  const completeTutorial = () => {
    localStorage.setItem(storageKey, "true");
    setIsTutorialActive(false);
    setCurrentStep("multiplicando");
  };

  const resetTutorial = () => {
    localStorage.removeItem(storageKey);
    setIsTutorialActive(true);
    setCurrentStep("multiplicando");
  };

  return {
    isTutorialActive,
    currentStep,
    advanceStep,
    completeTutorial,
    resetTutorial,
  };
}
