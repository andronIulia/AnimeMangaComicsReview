import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import AdminComicCard from '../components/AdminComicCard';
import NewComicCard from '../components/NewComicCard';
import { firestore } from '../common/firebase';

const AdminComicsPage = () => {
  const [comics, setComics] = useState([]);
  const [newComic, setNewComic] = useState({
    Autor: '',
    Titlu: '',
    imageUrl: '',
    rating: 0,
  });

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const comicsCollection = collection(firestore, 'comics');
        const querySnapshot = await getDocs(comicsCollection);

        const comicsData = [];
        querySnapshot.forEach((doc) => {
          const comicItem = doc.data();
          comicsData.push({
            id: doc.id,
            Autor: comicItem.Autor || '',
            imageUrl: comicItem.imageUrl || '',
            Titlu: comicItem.Titlu || '',
            rating: Number(comicItem.rating || 0),
          });
        });

        setComics(comicsData);
      } catch (error) {
        console.error('Error fetching comics:', error);
      }
    };

    fetchComics();
  }, []);

  const handleAddNewComic = async () => {
    try {
      if (!newComic.Autor || !newComic.Titlu || !newComic.imageUrl || !newComic.rating) {
        console.error('Error: All fields are required.');
        return;
      }
      const docRef = await addDoc(collection(firestore, 'comics'), newComic);
      console.log("New comic added to Firestore with ID:", docRef.id);
      setComics((prevComics) => [
        ...prevComics,
        {
          id: docRef.id,
          ...newComic,
        },
      ]);
      setNewComic({
        Autor: '',
        Titlu: '',
        imageUrl: '',
        rating: 0,
      });
    } catch (error) {
      console.error('Error adding new comic:', error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this comic?");
      if (!confirmDelete) return;
      await deleteDoc(doc(firestore, 'comics', id));
      setComics((prevComics) => prevComics.filter((comic) => comic.id !== id));
      console.log(`Comic with id ${id} has been deleted.`);
    } catch (error) {
      console.error('Error deleting comic:', error);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      console.log('Updating comic with ID:', id, 'and data:', updatedData);
      await updateDoc(doc(firestore, 'comics', id), updatedData);
      setComics((prevComics) =>
        prevComics.map((comic) => (comic.id === id ? { ...comic, ...updatedData } : comic))
      );
      console.log(`Comic with id ${id} has been updated.`);
    } catch (error) {
      console.error('Error updating comic:', error);
    }
  };

  return (
    <div>
      <h1>Admin Comics</h1>
      <NewComicCard
        Autor={newComic.Autor}
        imageUrl={newComic.imageUrl}
        Titlu={newComic.Titlu}
        rating={newComic.rating}
        onChange={(field, value) =>
          setNewComic((prev) => ({
            ...prev,
            [field]: value,
          }))
        }
        onCreate={handleAddNewComic}
      />
      {comics.map((comic) => (
        <AdminComicCard
          key={comic.id}
          id={comic.id}
          Autor={comic.Autor}
          imageUrl={comic.imageUrl}
          Titlu={comic.Titlu}
          rating={comic.rating}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
};

export default AdminComicsPage;
