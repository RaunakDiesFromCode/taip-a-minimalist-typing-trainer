import React, { useState, useEffect, useRef, useCallback } from "react";
import { bodyFont1 } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { fetchWords } from "@/lib/geminiService"; // Import text generation function

type Props = {
  textSize?: string;
};

type CharacterProps = {
  char: string;
  isCorrect: boolean;
  isTyped: boolean;
};

const Character: React.FC<CharacterProps> = React.memo(
  ({ char, isCorrect, isTyped }) => {
    const color = isTyped
      ? isCorrect
        ? "text-foreground"
        : "text-red-500"
      : "text-foreground/40";
    return (
      <span className={color} style={{ whiteSpace: "pre" }}>
        {char}
      </span>
    );
  }
);

Character.displayName = "Character";

const TypingHighlighter: React.FC<Props> = ({ textSize }) => {
  const [targetText, setTargetText] = useState<string>(""); // State for generated text
  const [input, setInput] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch generated text on mount
  useEffect(() => {
    const getWords = async () => {
      try {
        const words = await fetchWords({ difficulty: 3 });
        setTargetText(words.join(" "));
      } catch (error) {
        console.error("Error fetching words:", error);
      } finally {
        setLoading(false); // Hide loader after fetching
      }
    };

    getWords();
  }, []);

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

  const calculateMetrics = useCallback(() => {
    if (!startTime || !targetText) return;

    const elapsedMinutes = (Date.now() - startTime) / 60000;
    const wordsTyped = input.length / 5;
    setWpm(wordsTyped / elapsedMinutes || 0);

    const correctCount = input
      .split("")
      .filter((char, i) => char === targetText[i]).length;
    const accuracyPercentage =
      input.length > 0 ? (correctCount / input.length) * 100 : 100;
    setAccuracy(accuracyPercentage);
  }, [input, startTime, targetText]);

  useEffect(() => {
    if (input.length === 1 && !startTime) {
      setStartTime(Date.now());
      setHasStarted(true);
    }
    calculateMetrics();
  }, [input, calculateMetrics, startTime]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key.length === 1 && input.length < targetText.length) {
        setInput((prev) => prev + e.key);
      } else if (e.key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      }
    },
    [input, targetText.length]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col items-center justify-center outline-none cursor-default w-screen px-4",
        bodyFont1.className
      )}
      style={{ fontSize: textSize || "35px" }}
      tabIndex={0}
      onKeyDown={handleKeyPress}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      role="textbox"
      aria-label="Typing Highlighter"
    >
      {!isFocused && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm text-lg font-bold rounded-md cursor-default"
          onClick={() => containerRef.current?.focus()}
        >
          Click here to regain focus
        </div>
      )}

      {/* Typing Highlighter */}
      {loading ? (
        <div className="text-lg font-bold text-gray-600">Loading...</div>
      ) : (
        <div className="flex flex-wrap break-words whitespace-pre-wrap max-w-screen-lg text-center">
          {targetText.split("").map((char, index) => (
            <Character
              key={index}
              char={char}
              isTyped={index < input.length}
              isCorrect={input[index] === char}
            />
          ))}
        </div>
      )}

      {/* Stats Bar */}
      <div className="flex items-center gap-2 mt-5 text-foreground/50">
        <Button
          variant="outline"
          className="flex items-center gap-1 cursor-pointer hover:text-foreground/70"
        >
          <div className="flex h-5 items-center space-x-4 text-sm">
            <div>English</div>
            <Separator orientation="vertical" />
            <div>Easy</div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-1 hover:text-foreground/70"
        >
          {!hasStarted ? (
            <div className="text-sm">Get Set Go!</div>
          ) : (
            <div className="flex h-5 items-center space-x-4 text-sm">
              <div>WPM: {Math.round(wpm)}</div>
              <Separator orientation="vertical" />
              <div>Accuracy: {Math.round(accuracy)}%</div>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TypingHighlighter;
