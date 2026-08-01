import fs from "fs";
import csv from "csv-parser";
import { db } from "./firebaseConfig.js";
import { addDoc, collection } from "firebase/firestore";

const filePath = "./Learn your species db.csv";

function loadAnimalsFromCsv(path) {
  return new Promise((resolve, reject) => {
    const animals = [];

    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        animals.push(row);
      })
      .on("end", () => resolve(animals))
      .on("error", reject);
  });
}

async function uploadAnimals() {
  const animals = await loadAnimalsFromCsv(filePath);

  if (animals.length === 0) {
    console.log("No animals found in the CSV file.");
    return;
  }

  const uploads = animals.map((animal) =>
    addDoc(collection(db, "animals"), animal),
  );
  await Promise.all(uploads);

  fs.writeFileSync("animals.txt", JSON.stringify(animals, null, 2));
  console.log(`Uploaded ${animals.length} animals to Firestore.`);
}

uploadAnimals()
  .then(() => {
    console.log("Animals uploaded successfully.");
  })
  .catch((error) => {
    console.error("Upload failed:", error.message);
    process.exitCode = 1;
  });
