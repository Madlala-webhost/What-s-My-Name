import { collection, getDocs, query } from "firebase/firestore";
import { db } from "./firebaseConfig.js";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 4000;

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const state = {
  animalData: [],
  quizAnswer: null,
  counter: 0,
  gameOver: false,
  quizStarted: false,
};

async function getAnimalByName() {
  try {
    const q = query(collection(db, "animals"));
    const querySnapshot = await getDocs(q);
    if (querySnapshot) {
      const animals = querySnapshot.docs.map((doc) => doc.data());
      state.animalData.push(...animals);
    }
  } catch (error) {
    console.error("Error getting animal:", error);
  }
}

async function getRandomAnimal() {
  const answerGenerator = Math.floor(Math.random() * state.animalData.length);

  state.quizAnswer = [state.animalData[answerGenerator]];

  const randomNames = [];
  while (randomNames.length < 4) {
    const randomIndex = Math.floor(Math.random() * state.animalData.length);
    const responseNames = state.animalData[randomIndex].Name;
    randomNames.push(responseNames);
  }
  console.log(state.quizAnswer[0].URL);
  console.log(randomNames);
  return { quizAnswer: state.quizAnswer, randomNames };
}

async function startQuiz() {
  state.quizStarted = true;
  await getAnimalByName();
  const { quizAnswer, randomNames } = await getRandomAnimal();
  return {
    quizAnswer,
    randomNames,
    counter: state.counter,
    gameOver: state.gameOver,
  };
}

async function checkAnswer(userAnswer) {
  if (!state.quizAnswer) {
    return {
      correct: false,
      gameOver: false,
      message: "Quiz has not started yet.",
    };
  }

  if (userAnswer === state.quizAnswer[0].Name) {
    state.counter++;
    const { quizAnswer: newQuizAnswer, randomNames } = await getRandomAnimal();
    return {
      correct: true,
      gameOver: false,
      quizAnswer: newQuizAnswer,
      randomNames,
      counter: state.counter,
    };
  } else {
    state.gameOver = true;
    return { correct: false, gameOver: true };
  }
}

async function resetQuiz() {
  state.counter = 0;
  state.gameOver = false;
  state.quizStarted = false;
  state.quizAnswer = null;
  state.animalData = [];
}

app.post("/reset-quiz", async (req, res) => {
  try {
    await resetQuiz();
    res.json({ message: "Quiz reset successfully." });
  } catch (error) {
    console.error("Error resetting quiz:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/start-quiz", async (req, res) => {
  try {
    if (state.quizStarted) {
      return res.status(400).json({ message: "Quiz already started." });
    }

    const { quizAnswer, randomNames, counter, gameOver } = await startQuiz(); 
    res.json({ quizAnswer, randomNames, counter, gameOver });
  } catch (error) {
    console.error("Error starting quiz:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/check-answer", async (req, res) => {
  try {
    const userAnswer = req.body.userAnswer;
    const result = await checkAnswer(userAnswer);
    res.json(result);
  } catch (error) {
    console.error("Error checking answer:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
