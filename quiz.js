import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebaseConfig.js";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 4000;

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let animalData = [];
let quizAnswer = null;
let counter = 0;
let gameOver = false;
let quizStarted = false;

async function getAnimalByName() {
  try {
    const q = query(collection(db, "animals"));
    const querySnapshot = await getDocs(q);
    if (querySnapshot) {
      const animals = querySnapshot.docs.map((doc) => doc.data());
      animalData.push(...animals);
    }
  } catch (error) {
    console.error("Error getting animal:", error);
  }
}

async function getRandomAnimal(animalData) {
  const answerGenerator = Math.floor(Math.random() * animalData.length);

  quizAnswer = [animalData[answerGenerator]];

  const randomNames = [];
  while (randomNames.length < 4) {
    const randomIndex = Math.floor(Math.random() * animalData.length);
    const responseNames = animalData[randomIndex].Name;
    randomNames.push(responseNames);
  }
  console.log(quizAnswer);
  console.log(randomNames);
  return { quizAnswer, randomNames };
}

async function startQuiz() {
  animalData = [];
  quizAnswer = null;
  counter = 0;
  gameOver = false;
  quizStarted = true;
  await getAnimalByName();
  const { quizAnswer, randomNames } = await getRandomAnimal(animalData);
  return { quizAnswer, randomNames };
}
async function checkAnswer(userAnswer) {
  if (userAnswer === quizAnswer[0].Name) {
    counter++;
    const { quizAnswer: newQuizAnswer, randomNames } =
      await getRandomAnimal(animalData);
    return {
      correct: true,
      gameOver: false,
      quizAnswer: newQuizAnswer,
      randomNames,
    };
  } else {
    gameOver = true;
    return { correct: false, gameOver: true };
  }
}

app.post("/start-quiz", async (req, res) => {
  try {
    const { quizAnswer, randomNames } = await startQuiz();
    res.json({ quizAnswer, randomNames });
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
