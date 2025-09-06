import { useState, useEffect, useRef } from "react";

interface QuizItem {
  character: string;
  radical: string;
  isCorrect: boolean;
  correctAnswer: string;
}

const allQuizData = [
  // 正確配對
  { character: "現", radical: "玉", isCorrect: true, correctAnswer: "玉" },
  { character: "還", radical: "辵", isCorrect: true, correctAnswer: "辵" },
  { character: "聲", radical: "耳", isCorrect: true, correctAnswer: "耳" },
  { character: "矮", radical: "矢", isCorrect: true, correctAnswer: "矢" },
  { character: "淡", radical: "水", isCorrect: true, correctAnswer: "水" },
  { character: "書", radical: "曰", isCorrect: true, correctAnswer: "曰" },
  { character: "老", radical: "老", isCorrect: true, correctAnswer: "老" },
  { character: "為", radical: "灬", isCorrect: true, correctAnswer: "灬" },
  { character: "故", radical: "攵", isCorrect: true, correctAnswer: "攵" },
  { character: "用", radical: "用", isCorrect: true, correctAnswer: "用" },
  { character: "力", radical: "力", isCorrect: true, correctAnswer: "力" },
  { character: "只", radical: "口", isCorrect: true, correctAnswer: "口" },
  { character: "希", radical: "巾", isCorrect: true, correctAnswer: "巾" },
  { character: "師", radical: "巾", isCorrect: true, correctAnswer: "巾" },
  { character: "位", radical: "人", isCorrect: true, correctAnswer: "人" },
  { character: "以", radical: "人", isCorrect: true, correctAnswer: "人" },
  { character: "年", radical: "干", isCorrect: true, correctAnswer: "干" },
  { character: "望", radical: "月", isCorrect: true, correctAnswer: "月" },
  { character: "坐", radical: "土", isCorrect: true, correctAnswer: "土" },
  { character: "本", radical: "木", isCorrect: true, correctAnswer: "木" },
  // 錯誤配對
  { character: "現", radical: "王", isCorrect: false, correctAnswer: "玉" },
  { character: "還", radical: "辶", isCorrect: false, correctAnswer: "辵" },
  { character: "聲", radical: "言", isCorrect: false, correctAnswer: "耳" },
  { character: "矮", radical: "口", isCorrect: false, correctAnswer: "矢" },
  { character: "淡", radical: "火", isCorrect: false, correctAnswer: "水" },
  { character: "書", radical: "一", isCorrect: false, correctAnswer: "曰" },
  { character: "老", radical: "土", isCorrect: false, correctAnswer: "老" },
  { character: "為", radical: "寸", isCorrect: false, correctAnswer: "灬" },
  { character: "故", radical: "古", isCorrect: false, correctAnswer: "攵" },
  { character: "用", radical: "月", isCorrect: false, correctAnswer: "用" },
  { character: "力", radical: "刀", isCorrect: false, correctAnswer: "力" },
  { character: "只", radical: "日", isCorrect: false, correctAnswer: "口" },
  { character: "希", radical: "爻", isCorrect: false, correctAnswer: "巾" },
  { character: "師", radical: "市", isCorrect: false, correctAnswer: "巾" },
  { character: "位", radical: "立", isCorrect: false, correctAnswer: "人" },
  { character: "以", radical: "人", isCorrect: false, correctAnswer: "人" },
  { character: "年", radical: "生", isCorrect: false, correctAnswer: "干" },
  { character: "望", radical: "王", isCorrect: false, correctAnswer: "月" },
  { character: "坐", radical: "人", isCorrect: false, correctAnswer: "土" },
  { character: "本", radical: "禾", isCorrect: false, correctAnswer: "木" },
];

const totalQuestions = 3;

function App() {
  const [quizData, setQuizData] = useState<QuizItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCorrectGuess, setIsCorrectGuess] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(0);

  function shuffle(array: QuizItem[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function getRandomQuestions() {
    const shuffledData = [...allQuizData];
    shuffle(shuffledData);
    return shuffledData.slice(0, totalQuestions);
  }

  function handleSwipe(guess: boolean) {
    if (isAnimating || !gameActive || showFeedback) return;
    setIsAnimating(true);

    const question = quizData[currentQuestionIndex];
    const isAnswerCorrect = guess === question.isCorrect;

    setIsCorrectGuess(isAnswerCorrect);
    setShowFeedback(true);
  }

  function goToNextQuestion() {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < totalQuestions) {
      setCurrentQuestionIndex(nextIndex);
      setIsAnimating(false);
      setShowFeedback(false);
      setIsCorrectGuess(null);
    } else {
      endGame();
    }
  }

  function endGame() {
    setGameActive(false);
    setShowGameOver(true);
  }

  function restartGame() {
    setQuizData(getRandomQuestions());
    setCurrentQuestionIndex(0);
    setGameActive(true);
    setIsAnimating(false);
    setShowFeedback(false);
    setShowGameOver(false);
    setIsCorrectGuess(null);
  }

  // === 3. Hooks 來處理遊戲流程 ===
  useEffect(() => {
    // 遊戲初始化
    restartGame();
  }, []);

  // 當題目索引改變時，確保 UI 顯示正確
  useEffect(() => {
    if (gameActive) {
      // 這裡可以放更新 UI 的邏輯
      console.log("顯示新題目");
    }
  }, [currentQuestionIndex, gameActive]);

  // === 4. JSX 渲染與條件渲染 ===
  const currentQuestion = quizData[currentQuestionIndex];

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const newFontSize = containerWidth;
      setFontSize(Math.min(newFontSize, 500));
    }
  }, [currentQuestion]);

  return (
    <>
      <div className="flex items-center justify-center bg-[#FFFCEA]">
        <div className="relative flex h-dvh w-full max-w-dvh flex-col items-center py-[1%]">
          <h1 className="mb-5 w-full shrink-0 grow-0 basis-2 rounded-[40px] bg-[#FFB44B] py-3 text-center text-[36px] font-bold text-black">
            部首快問快答
          </h1>
          <p className="mb-5 flex w-full shrink-0 grow-0 basis-1 items-center justify-evenly text-[24px] font-bold text-black">
            <span>判</span>
            <span>斷</span>
            <span>部</span>
            <span>首</span>
            <span>是</span>
            <span>否</span>
            <span>正</span>
            <span>確</span>
          </p>
          {currentQuestion && (
            <div className="relative flex w-full shrink grow basis-10 flex-col items-center justify-center rounded-[40px] bg-[#FFF2AF] px-[2%] py-7">
              <div className="relative mb-2.5 flex w-full shrink grow basis-10 items-center justify-center rounded-[40px] bg-white p-5">
                <div
                  ref={containerRef}
                  className={`relative aspect-square h-full max-h-fit w-full max-w-fit border-2 border-black p-1`}
                >
                  <div
                    className="absolute top-1/2 left-0 h-[2px] w-full -translate-y-1/2 border-dashed border-gray-300"
                    style={{ borderWidth: "2px 0 0 0" }}
                  />
                  <div
                    className="absolute top-0 left-1/2 h-full w-[2px] -translate-x-1/2 border-dashed border-gray-300"
                    style={{ borderWidth: "0 0 0 2px" }}
                  />
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <p
                      className="font-bold"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {currentQuestion.character}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-5 flex min-h-[150px] w-full shrink-0 grow-0 basis-1 items-center justify-center rounded-[40px] bg-white">
                {showFeedback ? (
                  <div className="flex h-full w-full items-center justify-center gap-5">
                    <div className="flex flex-col items-center justify-center">
                      <h2
                        className={`text-[36px] font-bold ${isCorrectGuess ? "text-green-600" : "text-red-600"}`}
                      >
                        {isCorrectGuess ? "答對了！" : "答錯了！"}
                      </h2>
                      <p className="mt-4 text-[36px] font-bold">
                        正確部首：{currentQuestion.correctAnswer}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-[80px] font-bold">{`部首: ${currentQuestion.radical}`}</p>
                )}
              </div>
              <div className="flex w-full shrink-0 grow-0 basis-1 items-center justify-between gap-5">
                {showFeedback ? (
                  <button
                    className="grow rounded-full bg-blue-500 px-[77px] py-5 text-center text-[36px] font-bold text-white shadow-2xl"
                    onClick={goToNextQuestion}
                  >
                    下一題
                  </button>
                ) : (
                  <>
                    <button
                      className="grow rounded-full bg-[#FF8484] px-[77px] py-5 text-center text-[36px] font-bold text-white shadow-2xl"
                      onClick={() => handleSwipe(false)}
                      disabled={isAnimating || showFeedback}
                    >
                      X
                    </button>
                    <button
                      className="grow rounded-full bg-[#90FF9B] px-[77px] py-5 text-center text-[36px] font-bold text-white shadow-2xl"
                      onClick={() => handleSwipe(true)}
                      disabled={isAnimating || showFeedback}
                    >
                      O
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* === 遊戲結束畫面 === */}
          {showGameOver && (
            <div className="bg-opacity-90 absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[40px] bg-white p-6 text-center">
              <h2 className="mb-6 text-5xl font-bold text-gray-800">
                遊戲結束！
              </h2>
              <button
                className="rounded-full bg-blue-500 px-10 py-4 text-2xl font-bold text-white shadow-lg transition-transform duration-200 hover:scale-105"
                onClick={restartGame}
              >
                重新開始
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
