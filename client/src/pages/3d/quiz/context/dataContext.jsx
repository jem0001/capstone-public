import { createContext, useState, useEffect } from "react";
import { useGlobalContext } from "../../../../context/context";
import { useParams } from "react-router-dom";
import { useGlobalSounds } from "../../../../context/sound/SoundContext";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const { handleToggleScanner, getActivity, setShowConfetti } =
    useGlobalContext();
  const { playCorrect, playWrong, playMusic, isMusicMuted, isMusicPlaying } =
    useGlobalSounds();
  const { week, id } = useParams();

  // All questions, Current Question, Index of Current Question, Answer, Selected Answer, Total Marks
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [marks, setMarks] = useState(0);
  const [answerStatus, setAnswerStatus] = useState("");
  const [activity, setActivity] = useState(null);

  // Display Controlling States
  const [showStart, setShowStart] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Fetch JSON Data
  useEffect(() => {
    (async () => {
      const activity = await getActivity(id);
      setQuestions(activity.questions);
      setActivity(activity);
    })();
  }, []);

  // Set a Single Question
  useEffect(() => {
    if (questions.length > questionIndex) {
      setQuestion(questions[questionIndex]);
    }
  }, [questions, questionIndex]);

  // Start Quiz
  const startQuiz = () => {
    setShowStart(false);
    setShowQuiz(true);
  };

  // Check Answer
  const checkAnswer = (event, selected) => {
    if (!selectedAnswer) {
      setCorrectAnswer(question.correctAnswer);
      setSelectedAnswer(selected);

      if (selected === question.correctAnswer) {
        setMarks(marks + 1);
        setAnswerStatus("correct");
        playCorrect();
        setShowConfetti(true);
      } else {
        setAnswerStatus("incorrect");
        playWrong();
      }
    }
    handleToggleScanner();
  };

  // Next Question
  const nextQuestion = () => {
    setCorrectAnswer("");
    setSelectedAnswer("");
    setQuestionIndex(questionIndex + 1);
  };

  // Show Result
  const showTheResult = () => {
    setShowResult(true);
    setShowStart(false);
    setShowQuiz(false);
  };

  // Start Over
  const startOver = () => {
    setShowStart(false);
    setShowResult(false);
    setShowQuiz(true);
    setCorrectAnswer("");
    setSelectedAnswer("");
    setQuestionIndex(0);
    setMarks(0);
    if (!isMusicPlaying && !isMusicMuted) {
      playMusic("pleasant");
    }
  };
  return (
    <DataContext.Provider
      value={{
        startQuiz,
        showStart,
        showQuiz,
        question,
        questions,
        checkAnswer,
        correctAnswer,
        selectedAnswer,
        questionIndex,
        nextQuestion,
        showTheResult,
        showResult,
        marks,
        startOver,
        answerStatus,
        setAnswerStatus,
        activity,
        setActivity,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
