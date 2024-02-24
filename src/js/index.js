import Notiflix from 'notiflix';
import renderImages from './renderImages';
import searchImages from './searchImages';

const searchForm = document.getElementById('search-form');
const loadMoreButton = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';
let backgroundImageInterval; // Zmienna do przechowywania interwału zmiany tła
let totalDisplayedImages = 0; // Liczba obrazków wyświetlonych na stronie

// Funkcja obsługująca wyszukiwanie
const handleSearch = async event => {
  event.preventDefault();
  const query = searchForm.searchQuery.value.trim();
  if (query === '') {
    return; // Nie wykonuj wyszukiwania dla pustego zapytania
  }

  // Zapisz aktualne zapytanie
  currentQuery = query;

  // Wyczyść zawartość galerii i zresetuj liczbę wyświetlonych obrazków
  document.querySelector('.gallery').innerHTML = '';
  totalDisplayedImages = 0;

  // Wyślij żądanie HTTP
  const images = await searchImages(query);
  if (images.length === 0) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreButton.style.display = 'none'; // Ukryj przycisk "Load more" na końcu wyników
    return;
  }

  // Zaktualizuj stronę i wyrenderuj obrazy
  currentPage = 1;
  renderImages(images);

  // Ustaw tło na losowy obrazek z galerii
  setRandomBackgroundImage(images);

  // Zaktualizuj liczbę wyświetlonych obrazków
  totalDisplayedImages += images.length;

  // Pokaż powiadomienie o liczbie znalezionych obrazków
  Notiflix.Notify.success(`Hooray! We found ${totalDisplayedImages} images.`);

  // Pokaż przycisk "Load more"
  loadMoreButton.style.display = 'block';
};

// Funkcja obsługująca ładowanie kolejnych obrazków
const loadMoreImages = async () => {
  currentPage++;
  const previousImageCount = document.querySelectorAll('.photo-card').length; // Liczba obecnych obrazków
  const images = await searchImages(currentQuery, currentPage);
  // Ukryj przycisk "Load more" jeśli nie ma więcej obrazków
  if (images.length === 0) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreButton.style.display = 'none'; // Ukryj przycisk "Load more" na końcu wyników
    return;
  }

  // Renderuj nowe obrazy na końcu galerii
  renderImages(images);

  // Ustaw tło na losowy obrazek z galerii
  setRandomBackgroundImage(images);

  // Sprawdź, czy faktycznie dodano nowe obrazy
  const newImageCount =
    document.querySelectorAll('.photo-card').length - previousImageCount;
  if (newImageCount > 0) {
    // Przewiń widok do góry nowych obrazków

    const firstNewImage = document.querySelector('.gallery').lastElementChild;
    firstNewImage.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Zaktualizuj liczbę wyświetlonych obrazków
    totalDisplayedImages += newImageCount;

    // Wyświetl informację o liczbie nowych obrazków
    Notiflix.Notify.success(`${totalDisplayedImages} images loaded.`);
  } else {
    Notiflix.Notify.info('No new images loaded.');
  }
};

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

const scrollToTopButton = document.getElementById('scrollToTopButton');

// Pokaż przycisk, gdy użytkownik przewinie stronę w dół
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 100) {
    // Możesz dostosować wartość, aby przycisk pojawił się po przewinięciu o określoną liczbę pikseli
    scrollToTopButton.style.display = 'block';
  } else {
    scrollToTopButton.style.display = 'none';
  }
});

// Obsługa zdarzenia kliknięcia przycisku
scrollToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // Działa w większości nowoczesnych przeglądarek, aby przewijać płynnie
  });
});

searchForm.addEventListener('submit', handleSearch);
loadMoreButton.addEventListener('click', loadMoreImages);
loadMoreButton.style.display = 'none';
