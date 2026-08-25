import path from "path";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import express from "express";
import { db } from "./firebaseConfig.js";
import { collection, query, getDocs } from "firebase/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_ANIMALS_PATH = path.join(__dirname, "animals.txt");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const state = {
  animalData: [],
  dataSource: null,
  lastDataLoadError: null,
  quizAnswer: null,
  counter: 0,
  gameOver: false,
  quizStarted: false,
  namesChoice: [],
  correct: false,
  correctAnswers: [],
  timeout: false,
};

function renderHome(res, overrides = {}) {
  //overides is an object that can be used to override the state values when rendering the home page
  return res.render("index.ejs", {
    quizAnswer: state.quizAnswer,
    namesChoice: state.namesChoice,
    correctAnswers: state.correctAnswers,
    quizStarted: state.quizStarted,
    gameOver: state.gameOver,
    counter: state.counter,
    correct: state.correct,
    timeout: state.timeout,
    ...overrides,
  
  });
  
}

function shuffleArray(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function ensureAnimalsLoaded() {
  if (state.animalData.length > 0) {
    return;
  }

  try {
    const q = query(collection(db, "animals"));
    const querySnapshot = await getDocs(q);
    if (querySnapshot) {
      const animals = querySnapshot.docs.map((doc) => doc.data());

      state.animalData.push(...animals);
    }
  } catch (firestoreError) {
    console.error("Error loading animals from Firestore:", firestoreError);
  }
}

async function buildQuestion() {
  await ensureAnimalsLoaded();

  if (state.animalData.length < 5) {
    throw new Error("Need at least 5 animals in Firestore to start the quiz.");
  }

  state.gameOver = false;
  state.correct = false;
  state.timeout = false;

  const available = state.animalData.filter(
    (animal) => !state.correctAnswers.includes(animal.Name),
  );

  if (available.length === 0) {
    state.gameOver = true;
    state.correct = true;
    return;
  }

  const answer = available[Math.floor(Math.random() * available.length)];
  state.quizAnswer = [answer];

  const otherNames = state.animalData
    .filter((animal) => animal.Name !== answer.Name)
    .map((animal) => animal.Name);

  const distractors = shuffleArray(otherNames).slice(0, 4); //Here we are shuffling the other names and taking the first 4 as distractors
  state.namesChoice = shuffleArray([answer.Name, ...distractors]);
}

function resetQuizState() {
  state.counter = 0;
  state.gameOver = false;
  state.quizStarted = false;
  state.quizAnswer = null;
  state.namesChoice = [];
  state.correct = false;
  state.correctAnswers = [];
  state.timeout = false;
}

app.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    dataSource: state.dataSource,
    animalsLoaded: state.animalData.length,
    lastDataLoadError: state.lastDataLoadError,
  });
});

app.get("/", (req, res) => {
  try {
    return renderHome(res, {
      quizAnswer: null,
      namesChoice: null,
      quizStarted: false,
      gameOver: false,
      counter: 0,
      correct: false,
      correctAnswers: [],
    });

  } catch (error) {
    console.error("Error rendering main page:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/leaderboard", (req, res) => {
  return res.render("leaderboard.ejs");
});

app.get("/login", (req, res) => {
  return res.render("login.ejs");
});

app.post("/start-quiz", async (req, res) => {
  try {
    resetQuizState();
    state.quizStarted = true;
    await buildQuestion();
    return renderHome(res); //Here we are rendering the home page after starting the quiz and building the first question
  } catch (error) {
    console.error("Error starting quiz:", error);
    return res.status(500).send(`Could not start quiz. ${error.message}`);
  }
});

app.post("/check-answer", async (req, res) => {
  try {
    const userAnswer = req.body.userAnswer;

    if (!state.quizStarted || !state.quizAnswer) {
      return renderHome(res, { correct: false, gameOver: false });
    }

    if (userAnswer === state.quizAnswer[0].Name) {
      state.counter += 1;
      state.correct = true;
      state.correctAnswers.push(state.quizAnswer[0].Name);
      return renderHome(res);
    }

    state.gameOver = true;
    state.correct = false;
    return renderHome(res);
  } catch (error) {
    console.error("Error checking answer:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/next-question", async (req, res) => {
  try {
    if (!state.quizStarted) {
      return renderHome(res, { quizStarted: false });
    }

    await buildQuestion();
    return renderHome(res);
  
  
  } catch (error) {
    console.error("Error fetching next question:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/skip-question", async (req, res) => {
  try {
    if (!state.quizStarted) {
      return renderHome(res, { quizStarted: false });
    }

    await buildQuestion();
    return renderHome(res);
  } catch (error) {
    console.error("Error skipping question:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/game-over", (req, res) => {
  try {
    state.gameOver = true;
    state.correct = false;
    state.quizStarted = false;
    state.timeout = req.body.timeout === "true"; // Set timeout based on the form submission
    return renderHome(res);
  } catch (error) {
    console.error("Error handling game over:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/reset-quiz", (req, res) => {
  try {
    resetQuizState();
    return renderHome(res, {
      quizAnswer: null,
      namesChoice: null,
      quizStarted: false,
      gameOver: false,
      counter: 0,
      correct: false,
      correctAnswers: [],
    });
  } catch (error) {
    console.error("Error resetting quiz:", error);
    return res.status(500).send("Internal Server Error");
  }
});

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
