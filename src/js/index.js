import Notiflix from 'notiflix';
import renderImages from './renderImages';
import searchImages from './searchImages';

const searchForm = document.getElementById('search-form');
const loadMoreButton = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';
let backgroundImageInterval; // Zmienna do przechowywania interwału zmiany tła

// Funkcja obsługująca wyszukiwanie
const handleSearch = async event => {
  event.preventDefault();
  const query = searchForm.searchQuery.value.trim();
  if (query === '') {
    return; // Nie wykonuj wyszukiwania dla pustego zapytania
  }

  // Zapisz aktualne zapytanie
  currentQuery = query;

  // Wyślij żądanie HTTP
  const images = await searchImages(query);
  if (images.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  // Zaktualizuj stronę i wyrenderuj obrazy
  currentPage = 1;
  renderImages(images);

  // Ustaw tło na losowy obrazek z galerii
  setRandomBackgroundImage(images);

  // Pokaż powiadomienie o liczbie znalezionych obrazków
  Notiflix.Notify.success(`Hooray! We found ${images.length} images.`);

  // Pokaż przycisk "Load more"
  loadMoreButton.style.display = 'block';
};

// Funkcja obsługująca ładowanie kolejnych obrazków
const loadMoreImages = async () => {
  currentPage++;
  const previousImageCount = document.querySelectorAll('.photo-card').length; // Liczba obecnych obrazków
  const images = await searchImages(currentQuery, currentPage);
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

    // Wyświetl informację o liczbie nowych obrazków
    Notiflix.Notify.success(`${newImageCount} new images loaded.`);
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

searchForm.addEventListener('submit', handleSearch);
loadMoreButton.addEventListener('click', loadMoreImages);
loadMoreButton.style.display = 'none';
