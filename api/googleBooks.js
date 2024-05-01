import axios from 'axios';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

export const searchBooks = async (query) => {
    try {
        const response = await axios.get(`${GOOGLE_BOOKS_API_URL}?q=${query}`);
        return response.data.items; // palauttaa kirjojen tiedot
    } catch (error) {
        console.error('Error fetching data: ', error);
        return [];  // virhetilanteessa palauta tyhjä taulukko
    }
};
