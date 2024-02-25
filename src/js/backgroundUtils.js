let backgroundImageInterval; // Zmienna do przechowywania interwału zmiany tła

// Funkcja ustawiająca tło na losowy obrazek z galerii
const setRandomBackgroundImage = images => {
  // Sprawdź, czy tablica obrazków jest pusta
  if (images.length === 0) {
    console.error('No images available to set background.');
    return;
  }

  // Losujemy losowy indeks z galerii
  const randomIndex = Math.floor(Math.random() * images.length);
  const randomImage = images[randomIndex];

  // Ustawiamy obrazek jako tło strony
  document.body.style.backgroundImage = `url(${randomImage.webformatURL})`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';

  // Ustawiamy interwał zmiany tła co 5 sekund
  clearInterval(backgroundImageInterval);
  backgroundImageInterval = setInterval(() => {
    setRandomBackgroundImage(images);
  }, 5000);
};

export default setRandomBackgroundImage;
