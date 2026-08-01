import {collection, getDocs, query, where, orderBy, limit} from "firebase/firestore";
import {db} from "./firebaseConfig.js";

const animalData = []

const getAnimalByName = async () => {
    const randomGenerator = Math.floor(Math.random() * 60);
    console.log("Random number generated:", randomGenerator);
    try{
        const q = query(collection(db,"animals"));
        const querySnapshot = await getDocs(q);
        if (querySnapshot) {
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            animalData.push(doc.data());
        });
        }
        
    } catch (error) {
        console.error("Error getting animal:", error);
    }

};




getAnimalByName()