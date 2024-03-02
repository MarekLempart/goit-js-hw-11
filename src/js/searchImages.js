import axios from 'axios';

const apiKey = '42451517-7ac5a5d17c420ae469b144174'; // Zastąp 'YOUR_API_KEY' swoim kluczem API Pixabay

let perPage = 40; // liczba wyświetlanych obrazków - 40 na stronie

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
        per_page: perPage,
      },
    });

    return response.data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};

export default searchImages;
