import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc,doc } from 'firebase/firestore';
import AdminBookCard from '../components/AdminBookCard';
import NewBookCard from '../components/NewBookCard';
import { firestore } from '../common/firebase';
import { Grid, Button } from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../common/firebase';

const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    Autor: '',
    Titlu: '',
    imageUrl: '',
    rating: 0,
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollection = collection(firestore, 'books');
        const querySnapshot = await getDocs(booksCollection);

        const booksData = [];
        querySnapshot.forEach((doc) => {
          const bookData = doc.data();
          const imageUrl = bookData.imageUrl || '';
          const rating = Number(bookData.rating || 0);
          booksData.push({
            id: doc.id,
            Autor: bookData.Autor || '',
            imageUrl,
            Titlu: bookData.Titlu || '',
            rating,
          });
        });

        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleAddNewBook = async () => {
    try {
      console.log("Adding new book...");
    if (!newBook.Autor || !newBook.Titlu || !newBook.imageUrl || !newBook.rating) {
      console.error('Error: All fields are required.');
      return;
    }
    const docRef = await addDoc(collection(firestore, 'books'), newBook);
    console.log("New book added to Firestore with ID:", docRef.id);
    setBooks((prevBooks) => [
      ...prevBooks,
      {
        id: docRef.id,
        ...newBook,
      },
    ]);
    setNewBook({
      Autor: '',
      Titlu: '',
      imageUrl: '',
      rating: 0,
    });
    } catch (error) {
      console.error('Error adding new book:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Sunteți sigur că doriți să ștergeți această carte?");
      if (!confirmDelete) return; 
      await deleteDoc(doc(firestore, 'books', id));
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      console.log(`Cartea cu id-ul ${id} a fost ștearsă.`);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };
     
  const handleEdit = async (id, updatedData) => {
    try {
      console.log('Updating book with ID:', id, 'and data:', updatedData);
      await updateDoc(doc(firestore, 'books', id), updatedData);
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === id ? { ...book, ...updatedData } : book))
      );
      console.log(`Cartea cu id-ul ${id} a fost actualizată.`);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };
   
  return (
    <div>
      <h1>Admin Books</h1>
      <Grid container spacing={2}>
        <NewBookCard
          key="new"
          Autor={newBook.Autor}
          imageUrl={newBook.imageUrl}
          Titlu={newBook.Titlu}
          rating={newBook.rating}
          onChange={(field, value) =>
            setNewBook((prev) => ({
              ...prev,
              [field]: value,
            }))
          }
          onCreate={handleAddNewBook}
        />
        {books.map((book) => (
          <AdminBookCard
            key={book.id}
            id={book.id}
            Autor={book.Autor}
            imageUrl={book.imageUrl}
            Titlu={book.Titlu}
            rating={book.rating}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </Grid>
    </div>
  );
};

export default AdminBooksPage;