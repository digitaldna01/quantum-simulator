import { useCallback, useEffect } from "react";
import introJs from "intro.js";
import "intro.js/introjs.css";

const STORAGE_KEY = "seenTour";

const TOUR_STEPS = [
  { intro: "⚛️ Welcome to your Quantum Playground. Let's take a quick tour!" },
  {
    element: "#dashboard-circuit",
    intro: "This is your circuit panel. Drag and drop gates to build a quantum circuit.",
  },
  {
    element: "#dashboard-components",
    intro: "Available quantum gates. Drag them onto a qubit lane above.",
  },
  {
    element: "#dashboard-probability",
    intro: "Most probable measurement outcomes after the simulation.",
  },
  {
    element: "#dashboard-output",
    intro: "The full statevector — every basis amplitude of your quantum system.",
  },
  {
    element: "#dashboard-sphere",
    intro: "Visualize the state on the Q-sphere for geometric intuition.",
  },
];

function startTour() {
  introJs()
    .setOptions({
      steps: TOUR_STEPS,
      nextLabel: "Continue →",
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: true,
      doneLabel: "Let's start!",
    })
    .start();
}

export function useTour() {
  // Auto-show on first visit only.
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      startTour();
      localStorage.setItem(STORAGE_KEY, "true");
    }
  }, []);

  const restart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    // Small delay so the localStorage write commits before re-init.
    setTimeout(() => {
      startTour();
      localStorage.setItem(STORAGE_KEY, "true");
    }, 50);
  }, []);

  return { restart };
}
