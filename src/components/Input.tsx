"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { bodyFont1 } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchWords } from "@/lib/geminiService";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  textSize?: string;
};

const CHUNK_SIZE = 10; // Number of characters per chunk for rendering optimization

const difficultyLevels = [
  { value: "0", label: "Easy" },
  { value: "1", label: "Medium" },
  { value: "2", label: "Hard" },
  { value: "3", label: "Death" },
];

const TypingHighlighter: React.FC<Props> = React.memo(
  ({ textSize = "35px" }) => {
    const [targetText, setTargetText] = useState<string>("");
    const [input, setInput] = useState<string>("");
    const [isFocused, setIsFocused] = useState<boolean>(true);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [metrics, setMetrics] = useState({ wpm: 0, accuracy: 100 });
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<string>("0");
    const [loading, setLoading] = useState<boolean>(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputLengthRef = useRef<number>(0);

    // Fetch words when difficulty changes
    useEffect(() => {
      const getWords = async () => {
        setLoading(true);
        try {
          const words = await fetchWords({
            difficulty: Number.parseInt(difficulty),
          });
          setTargetText(words.join(" "));
          // Reset state when difficulty changes
          setInput("");
          setStartTime(null);
          setHasStarted(false);
          setMetrics({ wpm: 0, accuracy: 100 });
        } catch (error) {
          console.error("Error fetching words:", error);
        } finally {
          setLoading(false);
        }
      };

      getWords();
    }, [difficulty]);

    // Handle focus management
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsFocused(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Calculate metrics (WPM and accuracy)
    const calculateMetrics = useCallback(() => {
      if (!startTime || !targetText || input.length === 0) return;

      const elapsedMinutes = (Date.now() - startTime) / 60000;
      const wordsTyped = input.length / 5; // Standard word length approximation
      const wpm = Math.round(wordsTyped / elapsedMinutes) || 0;

      const correctCount = input
        .split("")
        .filter((char, i) => char === targetText[i]).length;
      const accuracyPercentage = Math.round(
        (correctCount / input.length) * 100
      );

      setMetrics({ wpm, accuracy: accuracyPercentage });
    }, [input, startTime, targetText]);

    // Update metrics when input changes
    useEffect(() => {
      // Start timer on first keystroke
      if (input.length === 1 && !startTime) {
        setStartTime(Date.now());
        setHasStarted(true);
      }

      // Only calculate metrics if input length changed
      if (input.length !== inputLengthRef.current) {
        calculateMetrics();
        inputLengthRef.current = input.length;
      }
    }, [input, calculateMetrics, startTime]);

    // Handle keyboard input
    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key.length === 1 && input.length < targetText.length) {
          setInput((prev) => prev + e.key);
        } else if (e.key === "Backspace") {
          setInput((prev) => prev.slice(0, -1));
        }
      },
      [input.length, targetText.length]
    );

    // Reset the typing test
    const handleReset = useCallback(() => {
      setInput("");
      setStartTime(null);
      setHasStarted(false);
      setMetrics({ wpm: 0, accuracy: 100 });
    }, []);

    // Memoize the text chunks to prevent unnecessary re-renders
    const textChunks = useMemo(() => {
      if (!targetText) return [];

      const chunks = [];
      for (let i = 0; i < targetText.length; i += CHUNK_SIZE) {
        chunks.push(targetText.slice(i, i + CHUNK_SIZE));
      }
      return chunks;
    }, [targetText]);

    // Render text chunks instead of individual characters
    const renderTextChunks = useMemo(() => {
      return textChunks.map((chunk, chunkIndex) => {
        const startIndex = chunkIndex * CHUNK_SIZE;

        return (
          <span key={chunkIndex} className="inline-block">
            {chunk.split("").map((char, index) => {
              const absoluteIndex = startIndex + index;
              return (
                <span
                  key={absoluteIndex}
                  className={
                    absoluteIndex < input.length
                      ? input[absoluteIndex] === char
                        ? "text-foreground"
                        : "text-red-500"
                      : absoluteIndex === input.length
                      ? "text-foreground/40 bg-primary/20" // Highlight current position
                      : "text-foreground/40"
                  }
                  style={{ whiteSpace: "pre" }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      });
    }, [textChunks, input]);

    // Memoize the stats display
    const StatsDisplay = useMemo(
      () => (
        <div className="flex items-center gap-2 mt-5 text-foreground/50">
          {/* Language & Difficulty Selector */}
          <div className="flex h-5 items-center space-x-4 text-sm">
            <Select
              value={difficulty}
              onValueChange={(value) => setDifficulty(value)}
              disabled={hasStarted}
            >
              <SelectTrigger className="flex items-center gap-1 cursor-pointer hover:text-foreground/70">
                <div>English</div>
                <Separator orientation="vertical" />
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-background shadow-none text-foreground/50 hover:text-foreground/70">
                <SelectGroup>
                  <SelectLabel>Difficulty</SelectLabel>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value} className={level.label === "Death" ? "text-red-500" : ""}>
                      {level.label === "Death" ? (
                        <span className="text-red-500">{level.label}</span>
                      ) : (
                        level.label
                      )}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Typing Stats */}
          <Button
            variant="outline"
            className="flex items-center gap-1 hover:text-foreground/70"
          >
            {!hasStarted ? (
              <div className="text-sm">Get Set Go!</div>
            ) : (
              <div className="flex h-5 items-center space-x-4 text-sm">
                <div>WPM: {metrics.wpm}</div>
                <Separator orientation="vertical" />
                <div>Accuracy: {metrics.accuracy}%</div>
              </div>
            )}
          </Button>

          {/* Reset Button */}
          {hasStarted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-sm hover:text-foreground/70"
            >
              Reset
            </Button>
          )}
        </div>
      ),
      [difficulty, hasStarted, metrics, handleReset]
    );

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative flex flex-col items-center justify-center outline-none cursor-default w-screen px-4",
          bodyFont1.className
        )}
        style={{ fontSize: textSize }}
        tabIndex={0}
        onKeyDown={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        role="textbox"
        aria-label="Typing Highlighter"
      >
        {!isFocused && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm text-lg font-bold rounded-md cursor-default z-10"
            onClick={() => {
              containerRef.current?.focus();
              setIsFocused(true);
            }}
          >
            Click here to regain focus
          </div>
        )}

        {loading ? (
          <div className="text-lg font-bold text-gray-600">Loading...</div>
        ) : (
          <div className="flex flex-wrap break-words whitespace-pre-wrap max-w-screen-lg mx-auto justify-center text-center">
            {renderTextChunks}
          </div>
        )}

        {StatsDisplay}
      </div>
    );
  }
);

TypingHighlighter.displayName = "TypingHighlighter";

export default TypingHighlighter;
