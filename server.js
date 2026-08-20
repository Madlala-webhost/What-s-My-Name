import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = "http://localhost:4000";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

//Route to render the main page

app.get("/", async (req, res) => {
  try {
    res.render("index.ejs", {
      quizAnswer: null,
      randomNames: null,
      quizStarted: false,
      gameOver: false,
      counter: 0,
      correct: false,
    });
  } catch (error) {
    console.error("Error rendering main page:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/check-answer", async (req, res) => {
  try {
    const userAnswer = req.body.userAnswer;
    const result = await axios.post(`${API_URL}/check-answer`, {
      userAnswer,
    });
    const { quizAnswer, namesChoice, counter, gameOver, correct, correctAnswers } = result.data;
    res.render("index.ejs", {
      quizAnswer: quizAnswer,
      namesChoice: namesChoice,
      correctAnswers: correctAnswers,
      quizStarted: true,
      gameOver: gameOver,
      counter: counter,
      correct: correct,
    });
    console.log("Result:", result.data);
  } catch (error) {
    console.error("Error checking answer:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/start-quiz", async (req, res) => {
  try {
    const result = await axios.post(`${API_URL}/start-quiz`, {
      quizStarted: true,
    });
    const { quizAnswer, namesChoice, counter, gameOver, correct } = result.data;
    res.render("index.ejs", {
      quizAnswer: quizAnswer,
      namesChoice: namesChoice,
      quizStarted: true,
      gameOver: gameOver,
      counter: counter,
      correct: correct,
    });
  } catch (error) {
    console.error("Error starting quiz:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/next-question", async (req, res) => {
  try {
    const result = await axios.post(`${API_URL}/next-question`);
    const { quizAnswer, namesChoice, counter, gameOver, correct, correctAnswers} = result.data;
    res.render("index.ejs", {
      quizAnswer: quizAnswer,
      namesChoice: namesChoice,
      quizStarted: true,
      gameOver: gameOver,
      counter: counter,
      correct: correct,
      correctAnswers: correctAnswers,
    
    });
  } catch (error) {
    console.error("Error fetching next question:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/reset-quiz", async (req, res) => {
  try {
    await axios.post(`${API_URL}/reset-quiz`);
    res.render("index.ejs", {
      quizAnswer: null,
      namesChoice: null,
      quizStarted: false,
      gameOver: false,
      counter: 0,
      correct: false,
    });
  } catch (error) {
    console.error("Error resetting quiz:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/game-over", async (req, res) => {
  try {
    const result = await axios.post(`${API_URL}/game-over`, {
      gameOver: true,
    } );
    const { quizAnswer, gameOver, counter, correct, quizStarted } = result.data;
    res.render("index.ejs", {
      quizAnswer: quizAnswer,
      quizStarted: quizStarted,
      gameOver: gameOver,
      counter: counter,
      correct: correct,
    });
  } catch (error) {
    console.error("Error handling game over:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/skip-question", async (req, res) => {
try{
  const result = await axios.post(`${API_URL}/skip-question`);
  const { quizAnswer, namesChoice, counter, gameOver, correct } = result.data;
  res.render("index.ejs", {
    quizAnswer: quizAnswer,
    namesChoice: namesChoice,
    quizStarted: true,
    gameOver: gameOver,
    counter: counter,
    correct: correct,
  });
  console.log("Result:", result.data);
  } catch (error) {
    console.error("Error skipping question:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
