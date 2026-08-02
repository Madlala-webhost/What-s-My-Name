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

const animalData = [];

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
  
  const quizAnswer = animalData[answerGenerator];

  const randomNames = [];
  while (randomNames.length < 4) {
    const randomIndex = Math.floor(Math.random() * animalData.length);
    const responseNames = animalData[randomIndex].Name;
    randomNames.push(responseNames);
  }
  console.log(quizAnswer);
  console.log(randomNames);
}

async function startQuiz() {
    let animalData = [];
    let quizAnswer = null;
    let counter = 0;
    let gameOver = false;
  await getAnimalByName();
  const { quizAnswer, randomNames } = await getRandomAnimal(animalData);
  return { quizAnswer, randomNames };
}


app.get("/quiz", async (req, res) => {
  try {
    if(req.query.start === "true") {
      const { quizAnswer, randomNames } = await startQuiz();
      res.json({ quizAnswer, randomNames });
    } else {
      res.status(400).send("Bad Request");
    }
  } catch (error) {
    console.error("Error starting quiz:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

