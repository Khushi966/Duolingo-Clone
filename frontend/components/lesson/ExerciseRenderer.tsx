"use client";

import React from "react";
import { Exercise } from "@/lib/api";
import MultipleChoice from "./exercises/MultipleChoice";
import TranslateWordBank from "./exercises/TranslateWordBank";
import MatchPairs from "./exercises/MatchPairs";
import FillBlank from "./exercises/FillBlank";
import TypeAnswer from "./exercises/TypeAnswer";

interface ExerciseRendererProps {
  exercise: Exercise;
  currentAnswer: any;
  onAnswerChange: (answer: any) => void;
  onEnterPress?: () => void;
  disabled?: boolean;
}

export default function ExerciseRenderer({
  exercise,
  currentAnswer,
  onAnswerChange,
  onEnterPress,
  disabled = false,
}: ExerciseRendererProps) {
  switch (exercise.exercise_type) {
    case "multiple_choice":
      return (
        <MultipleChoice
          exercise={exercise}
          value={currentAnswer || ""}
          onChange={onAnswerChange}
          disabled={disabled}
        />
      );

    case "translate_word_bank":
      return (
        <TranslateWordBank
          exercise={exercise}
          value={Array.isArray(currentAnswer) ? currentAnswer : []}
          onChange={onAnswerChange}
          disabled={disabled}
        />
      );

    case "match_pairs":
      return (
        <MatchPairs
          exercise={exercise}
          value={typeof currentAnswer === "object" && currentAnswer !== null ? currentAnswer : {}}
          onChange={onAnswerChange}
          disabled={disabled}
        />
      );

    case "fill_blank":
      return (
        <FillBlank
          exercise={exercise}
          value={currentAnswer || ""}
          onChange={onAnswerChange}
          disabled={disabled}
        />
      );

    case "type_answer":
      return (
        <TypeAnswer
          exercise={exercise}
          value={currentAnswer || ""}
          onChange={onAnswerChange}
          onEnterPress={onEnterPress}
          disabled={disabled}
        />
      );

    default:
      return (
        <div className="text-center p-8">
          <p className="text-red-500 font-bold">Unknown exercise type: {exercise.exercise_type}</p>
        </div>
      );
  }
}
