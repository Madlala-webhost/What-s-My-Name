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
    res.render("index.ejs", {
      quizAnswer: result.data.quizAnswer,
      namesChoice: result.data.namesChoice,
      quizStarted: true,
      gameOver: result.data.gameOver,
      counter: result.data.counter,
    });
  } catch (error) {
    console.error("Error checking answer:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/start-quiz", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/start-quiz`, {
      quizStarted: true,
    });
    const { quizAnswer, namesChoice, counter, gameOver } = response.data;
    res.render("index.ejs", {
      quizAnswer,
      namesChoice,
      quizStarted: true,
      gameOver,
      counter,
    });
  } catch (error) {
    console.error("Error starting quiz:", error);
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
    });
  } catch (error) {
    console.error("Error resetting quiz:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
