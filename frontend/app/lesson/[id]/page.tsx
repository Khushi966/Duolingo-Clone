"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import ProgressBar from "@/components/lesson/ProgressBar";
import HeartsDisplay from "@/components/lesson/HeartsDisplay";
import ExerciseRenderer from "@/components/lesson/ExerciseRenderer";
import FeedbackBar from "@/components/lesson/FeedbackBar";
import LessonCompleteModal from "@/components/modals/LessonCompleteModal";
import OutOfHeartsModal from "@/components/modals/OutOfHeartsModal";
import PipMascot from "@/components/mascot/PipMascot";
import { fetchLesson, submitLesson, LessonDetail, LessonSubmissionResponse } from "@/lib/api";
import { sounds } from "@/lib/sound";

type AnswerRecord = { exercise_id: number; user_answer: any };

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const lessonId = parseInt(resolvedParams.id, 10);
  const router = useRouter();

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lesson state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  // Ref keeps answers in sync regardless of React batching so the final submit is never stale
  const answersRef = useRef<AnswerRecord[]>([]);
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [hearts, setHearts] = useState(5);
  const [isHeartShaking, setIsHeartShaking] = useState(false);
  const [isOutOfHearts, setIsOutOfHearts] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<LessonSubmissionResponse | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadLessonData = async () => {
    try {
      const data = await fetchLesson(lessonId);
      setLesson(data);
      setHearts(data.user_hearts);
      if (data.user_hearts <= 0) {
        setIsOutOfHearts(true);
      }
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(`Could not load lesson #${lessonId}. Is the backend running at http://127.0.0.1:8000?`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    answersRef.current = []; // reset on new lesson
    loadLessonData();
  }, [lessonId]);

  // Global keyboard shortcuts: Enter to continue, Escape to close exit modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showExitConfirm) {
        setShowExitConfirm(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showExitConfirm]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#131F24]">
        <PipMascot mood="thinking" size={130} className="animate-bounce" />
        <div className="flex items-center gap-2 mt-4 text-[#58CC02] font-black text-lg">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Preparing exercises...</span>
        </div>
      </div>
    );
  }

  if (error || !lesson || lesson.exercises.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-[#131F24] min-h-screen">
        <PipMascot mood="sad" size={130} />
        <h2 className="text-2xl font-black text-red-500 mt-4 mb-2">Lesson Unavailable</h2>
        <p className="text-sm font-bold text-gray-500 max-w-md mb-6">{error || "No exercises found for this lesson."}</p>
        <Link href="/" className="py-3 px-6 duo-button duo-button-green text-sm">
          RETURN TO PATH
        </Link>
      </div>
    );
  }

  const currentExercise = lesson.exercises[currentIndex];
  const totalExercises = lesson.exercises.length;

  // Determine if user can click CHECK
  const isCheckDisabled = () => {
    if (!currentAnswer) return true;
    if (typeof currentAnswer === "string" && !currentAnswer.trim()) return true;
    if (Array.isArray(currentAnswer) && currentAnswer.length === 0) return true;
    if (currentExercise.exercise_type === "match_pairs") {
      const expectedCount = Object.keys(currentExercise.correct_answer || {}).length;
      return Object.keys(currentAnswer || {}).length < expectedCount;
    }
    return false;
  };

  // Grade current exercise locally for instantaneous responsive feedback
  const normalize = (t: any): string => {
    if (!t) return "";
    return String(t)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const verifyAnswer = (): boolean => {
    const type = currentExercise.exercise_type;
    const correct = currentExercise.correct_answer;

    if (type === "multiple_choice") {
      const exp = typeof correct === "object" ? correct.id || correct.text : correct;
      return normalize(currentAnswer) === normalize(exp);
    } else if (type === "translate_word_bank") {
      const userStr = Array.isArray(currentAnswer) ? currentAnswer.join(" ") : String(currentAnswer);
      let accepted: string[] = [];
      if (typeof correct === "object" && correct.text) {
        accepted = [correct.text, ...(correct.alternatives || [])];
      } else if (Array.isArray(correct)) {
        accepted = [correct.join(" ")];
      } else {
        accepted = [String(correct)];
      }
      return accepted.some((acc) => normalize(acc) === normalize(userStr));
    } else if (type === "match_pairs") {
      const expectedMap = correct || {};
      for (const [k, v] of Object.entries(expectedMap)) {
        if (currentAnswer[k] !== v) return false;
      }
      return true;
    } else if (type === "fill_blank") {
      let expected = typeof correct === "object" ? correct.blank || correct.text : String(correct);
      let alts = typeof correct === "object" ? correct.alternatives || [] : [];
      return [expected, ...alts].some((acc) => normalize(acc) === normalize(currentAnswer));
    } else if (type === "type_answer") {
      let expected = typeof correct === "object" ? correct.text || correct.answer : String(correct);
      let alts = typeof correct === "object" ? correct.alternatives || [] : [];
      return [expected, ...alts].some((acc) => normalize(acc) === normalize(currentAnswer));
    }
    return false;
  };

  // Get string representation of correct answer for error display
  const getCorrectAnswerDisplay = (): string => {
    const correct = currentExercise.correct_answer;
    if (typeof correct === "string") return correct;
    if (typeof correct === "object") {
      return correct.text || correct.blank || correct.id || JSON.stringify(correct);
    }
    return String(correct);
  };

  const handleCheck = () => {
    if (isCheckDisabled() || feedbackStatus !== "idle") return;

    const isCorrect = verifyAnswer();

    // Record answer immediately via ref (no batching delay)
    answersRef.current = [
      ...answersRef.current,
      { exercise_id: currentExercise.id, user_answer: currentAnswer },
    ];

    if (isCorrect) {
      sounds.playCorrect();
      setFeedbackStatus("correct");
    } else {
      sounds.playIncorrect();
      setFeedbackStatus("incorrect");
      // Deduct heart locally for instant feedback
      const nextHearts = Math.max(0, hearts - 1);
      setHearts(nextHearts);
      setIsHeartShaking(true);
      setTimeout(() => setIsHeartShaking(false), 500);

      if (nextHearts === 0) {
        setIsOutOfHearts(true);
      }
    }
  };

  const handleContinue = async () => {
    if (isOutOfHearts) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex < totalExercises) {
      setCurrentIndex(nextIndex);
      setCurrentAnswer(null);
      setFeedbackStatus("idle");
    } else {
      // All exercises done → submit to server using the ref (always up-to-date)
      setIsSubmitting(true);
      try {
        const response = await submitLesson(lessonId, answersRef.current);
        setSubmissionResult(response);
        // Sync hearts from authoritative server response
        setHearts(response.hearts_remaining);
      } catch (err) {
        console.error("Lesson submission failed:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#131F24] select-none">
      {/* Lesson Header Navigation */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 sm:gap-8">
        {/* Quit Button */}
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Dynamic Progress Bar */}
        <div className="flex-1 max-w-2xl">
          <ProgressBar current={currentIndex + (feedbackStatus !== "idle" ? 1 : 0)} total={totalExercises} />
        </div>

        {/* Live Hearts Counter */}
        <HeartsDisplay hearts={hearts} isShaking={isHeartShaking} />
      </header>

      {/* Breadcrumb subtitle */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 -mt-1 mb-2 flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-600">
        <span>{lesson.unit_title}</span>
        <span>›</span>
        <span>{lesson.skill_title}</span>
        <span className="ml-auto">{currentIndex + 1} / {totalExercises}</span>
      </div>

      {/* Main Exercise Viewport */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-6 flex flex-col justify-center">
        <ExerciseRenderer
          exercise={currentExercise}
          currentAnswer={currentAnswer}
          onAnswerChange={setCurrentAnswer}
          onEnterPress={feedbackStatus === "idle" ? handleCheck : handleContinue}
          disabled={feedbackStatus !== "idle" || isSubmitting}
        />

        {/* Submitting overlay */}
        {isSubmitting && (
          <div className="flex items-center justify-center gap-2 mt-6 text-[#58CC02] font-black text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Saving your progress...</span>
          </div>
        )}
      </main>

      {/* Slide-up Bottom Feedback & Action Bar */}
      <FeedbackBar
        status={feedbackStatus}
        isCheckDisabled={isCheckDisabled() || isSubmitting}
        correctAnswerText={getCorrectAnswerDisplay()}
        onCheck={handleCheck}
        onContinue={handleContinue}
      />

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm p-6 bg-white dark:bg-[#1B272D] rounded-3xl border-2 border-gray-200 dark:border-[#2E383D] shadow-2xl animate-duo-pop text-center">
            <div className="flex justify-center mb-3">
              <PipMascot mood="sad" size={100} />
            </div>
            <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-2">
              Are you sure you want to quit?
            </h3>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-6">
              All progress in this session will be lost and your streak won&apos;t be counted yet.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-3 duo-button duo-button-green text-sm"
              >
                KEEP LEARNING
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full py-2.5 duo-button duo-button-white text-xs text-red-500"
              >
                END SESSION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Out of Hearts Modal — hide once lesson completes */}
      {isOutOfHearts && !submissionResult && (
        <OutOfHeartsModal
          onRefilled={() => {
            setIsOutOfHearts(false);
            setHearts(5);
            setFeedbackStatus("idle");
          }}
        />
      )}

      {/* Lesson Complete Modal */}
      {submissionResult && (
        <LessonCompleteModal result={submissionResult} />
      )}
    </div>
  );
}
