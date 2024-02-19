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

// Funkcja wykonująca żądanie HTTP do API Pixabay
async function searchImages(query, page = 1) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 80, // 80 obrazków na stronie
      },
    });
    return response.data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

// images.hits.map(
//   ({
//     webformatURL,
//     largeImageURL,
//     tags,
//     likes,
//     views,
//     comments,
//     downloads,
//   }) => `
// <div class="photo-card">
//   <a href="${largeImageURL}">
//     <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//   </a>
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b>
//       <br>${likes}
//     </p>
//     <p class="info-item">
//       <b>Views</b>
//       <br>${views}
//     </p>
//     <p class="info-item">
//       <b>Comments</b>
//       <br>${comments}
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>
//       <br>${downloads}
//     </p>
//   </div>
// </div>`
// );

// od Marcina
// const queryString = "yellow flowers";
// const preparedQueryString = queryString.split(" ").join("+");
// fetch(
//   `https://pixabay.com/api/?key=42451517-7ac5a5d17c420ae469b144174&q=yellow+flowers&image_type=photo&orientation=horizontal&safesearch=true&per_page=12&page=1`
// )
//   .then((response) => response.json())
//   .then((data) => console.log(data));
//koniec

// Funkcja renderująca pojedynczą kartę obrazka
function renderImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');
  card.innerHTML = `
    <a href="${image.largeImageURL}" class="lightbox-item">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item"><b>Likes:</b> ${image.likes}</p>
      <p class="info-item"><b>Views:</b> ${image.views}</p>
      <p class="info-item"><b>Comments:</b> ${image.comments}</p>
      <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
    </div>
  `;
  return card;
}

// Funkcja renderująca obrazy w galerii
function renderImages(images) {
  gallery.innerHTML = ''; // Wyczyść galerię przed renderowaniem nowych obrazków
  images.forEach(image => {
    const card = renderImageCard(image);
    gallery.appendChild(card);
  });
}

// Funkcja obsługująca wyszukiwanie
async function handleSearch(event) {
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
}

// Funkcja obsługująca ładowanie kolejnych obrazków
async function loadMoreImages() {
  currentPage++;
  const images = await searchImages(currentQuery, currentPage);
  if (images.length === 0) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreButton.style.display = 'none'; // Ukryj przycisk "Load more" na końcu wyników
    return;
  }
  renderImages(images);

  // Odśwież SimpleLightbox po dodaniu nowych obrazków
  const lightbox = new SimpleLightbox('.lightbox-item');
  lightbox.refresh();

  // Płynne przewijanie strony
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// Obsługa zdarzenia submit formularza
searchForm.addEventListener('submit', handleSearch);

// Obsługa zdarzenia kliknięcia na przycisk "Load more"
loadMoreButton.addEventListener('click', loadMoreImages);

// Ukryj przycisk "Load more" na początku
loadMoreButton.style.display = 'none';
