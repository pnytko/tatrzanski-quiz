const fs = require('fs');

// Wczytaj dane z pliku JSON
const quizData = JSON.parse(fs.readFileSync('quizData.json', 'utf8'));

// Funkcja do losowego mieszania tablicy (algorytm Fisher-Yates)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Zrandomizuj kolejność pytań
const randomizedQuizData = shuffleArray([...quizData]);

// Zapisz zrandomizowane dane z powrotem do pliku
fs.writeFileSync('quizData.json', JSON.stringify(randomizedQuizData, null, 4));

console.log('Kolejność pytań została zrandomizowana!');
console.log(`Liczba pytań w pliku: ${randomizedQuizData.length}`);
