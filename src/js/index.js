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

  // Przewiń widok do góry nowych obrazków
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

searchForm.addEventListener('submit', handleSearch);
loadMoreButton.addEventListener('click', loadMoreImages);
loadMoreButton.style.display = 'none';
