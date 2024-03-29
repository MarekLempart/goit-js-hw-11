import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '42451517-7ac5a5d17c420ae469b144174'; // Zastąp 'YOUR_API_KEY' swoim kluczem API Pixabay

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';
let lightbox;

// Funkcja wykonująca żądanie HTTP do API Pixabay
const searchImages = async (query, page = 1) => {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40, // 40 obrazków na stronie
      },
    });
    return response.data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};

// Funkcja renderująca obrazy w galerii za pomocą map
const renderImages = images => {
  const galleryMarkup = images
    .map(image => {
      return `
      <div class="photo-card">
        <a href="${image.largeImageURL}" class="lightbox-item">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes:</b><br>${image.likes}</p>
          <p class="info-item"><b>Views:</b><br>${image.views}</p>
          <p class="info-item"><b>Comments:</b><br>${image.comments}</p>
          <p class="info-item"><b>Downloads:</b><br>${image.downloads}</p>
        </div>
      </div>`;
    })
    .join('');

  gallery.innerHTML = galleryMarkup;

  // Inicjalizuj lub odśwież SimpleLightbox po dodaniu nowych obrazków
  if (!lightbox) {
    lightbox = new SimpleLightbox('.lightbox-item');
  } else {
    lightbox.refresh();
  }
};

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
  const galleryMarkup = images
    .map(image => {
      return `
      <div class="photo-card">
        <a href="${image.largeImageURL}" class="lightbox-item">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes:</b><br>${image.likes}</p>
          <p class="info-item"><b>Views:</b><br>${image.views}</p>
          <p class="info-item"><b>Comments:</b><br>${image.comments}</p>
          <p class="info-item"><b>Downloads:</b><br>${image.downloads}</p>
        </div>
      </div>`;
    })
    .join('');

  gallery.innerHTML += galleryMarkup;

  // Odśwież SimpleLightbox po dodaniu nowych obrazków
  if (lightbox) {
    lightbox.refresh();
  }

  // Przewiń widok do góry nowych obrazków
  const lastAddedImage = gallery.lastElementChild;
  lastAddedImage.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Obsługa zdarzenia submit formularza
searchForm.addEventListener('submit', handleSearch);

// Obsługa zdarzenia kliknięcia na przycisk "Load more"
loadMoreButton.addEventListener('click', loadMoreImages);

// Ukryj przycisk "Load more" na początku
loadMoreButton.style.display = 'none';
