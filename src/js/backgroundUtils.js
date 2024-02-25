let backgroundImageInterval; // Zmienna do przechowywania interwału zmiany tła

// Funkcja ustawiająca tło na losowy obrazek z galerii
const setRandomBackgroundImage = images => {
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
