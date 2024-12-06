import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  CardActions,
  Box,
  Grid,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  // Fetch all quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/quizzes");
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, []);

  // Select a quiz
  const handleSelectQuiz = async (quizId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/quizzes/${quizId}`
      );
      setSelectedQuiz(response.data);
      setAnswers(Array(response.data.questions.length).fill(null));
      setTimeLeft(response.data.timeLimit * 60); // Convert minutes to seconds
      setResults(null);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  // Timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && selectedQuiz) {
      handleSubmit();
    }
  }, [timeLeft, selectedQuiz]);

  // Handle answer change
  const handleAnswerChange = (choice) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = choice;
    setAnswers(updatedAnswers);
  };

  // Submit quiz
  const handleSubmit = () => {
    const correctAnswers = selectedQuiz.questions.map((q) => q.correctAnswer);
    const result = answers.map((answer, index) => ({
      question: selectedQuiz.questions[index].questionText,
      correctAnswer: correctAnswers[index],
      userAnswer: answer,
      isCorrect: answer === correctAnswers[index],
    }));
    setResults(result);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`; // Add leading zero for seconds
  };

  const handleStartNewQuiz = () => {
    setSelectedQuiz(null);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setTimeLeft(0);
    setResults(null);
  };

  const handleAddQuiz = () => navigate("/add-quiz");

  // UI when no quiz is selected
  if (!selectedQuiz) {
    return (
      <div>
        {/* Navbar */}
        <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Quiz App
            </Typography>
            <Button
              color="inherit"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddQuiz}
            >
              Add Quiz
            </Button>
          </Toolbar>
        </AppBar>

        {/* Quiz Selection */}
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome to Quiz App
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            Select a quiz to start.
          </Typography>

          <Grid container spacing={4}>
            {quizzes.map((quiz) => (
              <Grid item xs={12} sm={6} md={4} key={quiz._id}>
                <Card elevation={3} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {quiz.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {quiz.description}
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="caption" color="textSecondary">
                        Time Limit: {quiz.timeLimit} mins
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Questions: {quiz.questions.length}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleSelectQuiz(quiz._id)}
                    >
                      Start Quiz
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    );
  }

  // UI when quiz results are shown
  if (results) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Quiz Results
        </Typography>
        {results.map((result, index) => (
          <Box key={index} mb={2}>
            <Typography>Question: {result.question}</Typography>
            <Typography>
              Your Answer: {result.userAnswer || "No Answer"}
            </Typography>
            <Typography>Correct Answer: {result.correctAnswer}</Typography>
            <Typography>
              {result.isCorrect ? "✅ Correct" : "❌ Incorrect"}
            </Typography>
          </Box>
        ))}
        <Typography align="center">
          Total Correct: {results.filter((r) => r.isCorrect).length} /{" "}
          {results.length}
        </Typography>
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartNewQuiz}
          >
            Start New Quiz
          </Button>
        </Box>
      </Container>
    );
  }

  // UI for quiz in progress
  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {selectedQuiz.title}
      </Typography>
      <Typography align="center" gutterBottom>
        Time Left: {formatTime(timeLeft)} Mins
      </Typography>
      <Typography variant="h6" gutterBottom>
        Question {currentQuestionIndex + 1}
      </Typography>
      <Typography gutterBottom>{currentQuestion.questionText}</Typography>
      <Box>
        {currentQuestion.choices.map((choice, index) => (
          <Box key={index} mb={1}>
            <label>
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={choice}
                checked={answers[currentQuestionIndex] === choice}
                onChange={() => handleAnswerChange(choice)}
              />
               <span className="ms-2">{choice}</span>
            </label>
          </Box>
        ))}
      </Box>
      <Box mt={4} textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextQuestion}
        >
          {currentQuestionIndex === selectedQuiz.questions.length - 1
            ? "Submit Quiz"
            : "Next Question"}
        </Button>
      </Box>
    </Container>
  );
};

export default QuizPage;
