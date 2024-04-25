import React, { useEffect, useState } from 'react';
import { collection, getDocs,doc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import BookCard from '../components/BookCard';
import { firestore, storage } from '../common/firebase';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom'; 

const BooksPage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollection = collection(firestore, 'books');
        const querySnapshot = await getDocs(booksCollection);
    
        const booksData = [];
        for (const doc of querySnapshot.docs) {
          const bookData = doc.data();
          let imageUrl = '';
          if (typeof bookData.imageUrl === 'string') {
            imageUrl = bookData.imageUrl;
          } else {
            try {
              const imageUrlRef = ref(storage, bookData.imageUrl);
              imageUrl = await getDownloadURL(imageUrlRef);
            } catch (error) {
              console.error('Error getting image URL from reference:', error);
            }
          }
    
          const rating = Number(bookData.rating || 0);
          booksData.push({
            id: doc.id,
            Autor: bookData.Autor,
            imageUrl: imageUrl,
            Titlu: bookData.Titlu,
            rating: rating,
          });
        }
    
        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    

    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Books</h1>
      <Grid container spacing={2}>
        {books.map((book) => (
          <Link to={`/books/${book.id}`} key={book.id}> 
            <BookCard
              Autor={book.Autor}
              imageUrl={book.imageUrl}
              Titlu={book.Titlu}
              rating={book.rating}
            />
          </Link>
        ))}
      </Grid>
    </div>
  );
};

export default BooksPage;




