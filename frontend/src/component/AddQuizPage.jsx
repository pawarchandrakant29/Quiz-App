import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  Container,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const AddQuizPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState([{ questionText: "", choices: ["", "", "", ""], correctAnswer: "" }]);

  const navigate = useNavigate();

  const handleChangeQuestion = (index, key, value) => {
    const newQuestions = [...questions];
    newQuestions[index][key] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: "", choices: ["", "", "", ""], correctAnswer: "" }]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmitQuiz = async () => {
    try {
      await axios.post("http://localhost:5000/api/quizzes/add", {
        title,
        description,
        timeLimit,
        questions,
      });
      alert("Quiz added successfully!");
      navigate("/"); // Redirect to quiz list page
    } catch (error) {
      console.error("Error adding quiz", error);
    }
  };

  return (
    <Box className="mb-4">
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              flexGrow: 1,
              fontWeight: "bold",
            }}
          >
            Quiz App
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Quizzes
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ marginTop: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Add New Quiz
        </Typography>
        <Card sx={{ marginBottom: "20px", padding: "20px" }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Quiz Title"
                  variant="outlined"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Time Limit (minutes)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  required
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Typography variant="h5" gutterBottom>
          Questions
        </Typography>
        {questions.map((question, index) => (
          <Card key={index} sx={{ marginBottom: "20px", padding: "20px" }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label={`Question ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    value={question.questionText}
                    onChange={(e) =>
                      handleChangeQuestion(index, "questionText", e.target.value)
                    }
                    required
                  />
                </Grid>
                {question.choices.map((choice, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <TextField
                      label={`Choice ${i + 1}`}
                      variant="outlined"
                      fullWidth
                      value={choice}
                      onChange={(e) =>
                        handleChangeQuestion(index, "choices", [
                          ...question.choices.slice(0, i),
                          e.target.value,
                          ...question.choices.slice(i + 1),
                        ])
                      }
                      required
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <TextField
                    label="Correct Answer"
                    variant="outlined"
                    fullWidth
                    value={question.correctAnswer}
                    onChange={(e) =>
                      handleChangeQuestion(index, "correctAnswer", e.target.value)
                    }
                    required
                  />
                </Grid>
              </Grid>
              <Box sx={{ textAlign: "right", marginTop: "10px" }}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outlined"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddQuestion}
          sx={{ marginBottom: "20px" }}
        >
          Add Question
        </Button>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmitQuiz}
        >
          Submit Quiz
        </Button>
      </Container>
    </Box>
  );
};

export default AddQuizPage;
