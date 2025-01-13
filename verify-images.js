const fs = require('fs');
const path = require('path');

try {
  // Wczytaj plik quizData.json
  const quizData = JSON.parse(fs.readFileSync('quizData.json', 'utf8'));
  const missingImages = [];

  // Sprawdź każde pytanie
  quizData.forEach((question, index) => {
    if (question.image) {
      // Usuń początkowy slash jeśli istnieje
      const imagePath = question.image.startsWith('/') ? question.image.slice(1) : question.image;
      
      if (!fs.existsSync(imagePath)) {
        missingImages.push({
          questionIndex: index + 1,
          imagePath: imagePath
        });
      }
    }
  });

  // Jeśli są brakujące obrazki, wyświetl błąd
  if (missingImages.length > 0) {
    console.error('❌ Znaleziono brakujące obrazki:');
    missingImages.forEach(({ questionIndex, imagePath }) => {
      console.error(`   Pytanie ${questionIndex}: ${imagePath}`);
    });
    process.exit(1);
  } else {
    console.log('✅ Wszystkie obrazki istnieją');
  }
} catch (error) {
  console.error('❌ Błąd podczas weryfikacji:', error);
  process.exit(1);
}
