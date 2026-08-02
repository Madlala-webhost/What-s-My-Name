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

async function getQuiz() {
  await getAnimalByName();
  await getRandomAnimal(animalData);
}

getQuiz().catch(console.error);
