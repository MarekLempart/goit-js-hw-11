import Notiflix from 'notiflix';
import renderImages from './renderImages';
import searchImages from './searchImages';

const searchForm = document.getElementById('search-form');
const loadMoreButton = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';

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

// // Funkcja obsługująca ładowanie kolejnych obrazków
// const loadMoreImages = async () => {
//   currentPage++;
//   const images = await searchImages(currentQuery, currentPage);
//   if (images.length === 0) {
//     Notiflix.Notify.info(
//       "We're sorry, but you've reached the end of search results."
//     );
//     loadMoreButton.style.display = 'none'; // Ukryj przycisk "Load more" na końcu wyników
//     return;
//   }

//   // Renderuj nowe obrazy na końcu galerii
//   renderImages(images);

//   // Przewiń widok do góry nowych obrazków
//   const lastAddedImage = gallery.lastElementChild;
//   lastAddedImage.scrollIntoView({ behavior: 'smooth', block: 'start' });
// };

searchForm.addEventListener('submit', handleSearch);
loadMoreButton.addEventListener('click', loadMoreImages);
loadMoreButton.style.display = 'none';
