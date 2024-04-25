import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import AdminMangaCard from '../components/AdminMangaCard';
import NewMangaCard from '../components/NewMangaCard';
import { firestore } from '../common/firebase';

const AdminMangaPage = () => {
  const [manga, setManga] = useState([]);
  const [newManga, setNewManga] = useState({
    Autor: '',
    Titlu: '',
    imageUrl: '',
    rating: 0,
  });

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const mangaCollection = collection(firestore, 'manga');
        const querySnapshot = await getDocs(mangaCollection);

        const mangaData = [];
        querySnapshot.forEach((doc) => {
          const mangaItem = doc.data();
          mangaData.push({
            id: doc.id,
            Autor: mangaItem.Autor || '',
            imageUrl: mangaItem.imageUrl || '',
            Titlu: mangaItem.Titlu || '',
            rating: Number(mangaItem.rating || 0),
          });
        });

        setManga(mangaData);
      } catch (error) {
        console.error('Error fetching manga:', error);
      }
    };

    fetchManga();
  }, []);

  const handleAddNewManga = async () => {
    try {
      if (!newManga.Autor || !newManga.Titlu || !newManga.imageUrl || !newManga.rating) {
        console.error('Error: All fields are required.');
        return;
      }
      const docRef = await addDoc(collection(firestore, 'manga'), newManga);
      console.log("New manga added to Firestore with ID:", docRef.id);
      setManga((prevManga) => [
        ...prevManga,
        {
          id: docRef.id,
          ...newManga,
        },
      ]);
      setNewManga({
        Autor: '',
        Titlu: '',
        imageUrl: '',
        rating: 0,
      });
    } catch (error) {
      console.error('Error adding new manga:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this manga?");
      if (!confirmDelete) return;
      await deleteDoc(doc(firestore, 'manga', id));
      setManga((prevManga) => prevManga.filter((manga) => manga.id !== id));
      console.log(`Manga with id ${id} has been deleted.`);
    } catch (error) {
      console.error('Error deleting manga:', error);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      console.log('Updating manga with ID:', id, 'and data:', updatedData);
      await updateDoc(doc(firestore, 'manga', id), updatedData);
      setManga((prevManga) =>
        prevManga.map((manga) => (manga.id === id ? { ...manga, ...updatedData } : manga))
      );
      console.log(`Manga with id ${id} has been updated.`);
    } catch (error) {
      console.error('Error updating manga:', error);
    }
  };

  return (
    <div>
      <h1>Admin Manga</h1>
      <NewMangaCard
        Autor={newManga.Autor}
        imageUrl={newManga.imageUrl}
        Titlu={newManga.Titlu}
        rating={newManga.rating}
        onChange={(field, value) =>
          setNewManga((prev) => ({
            ...prev,
            [field]: value,
          }))
        }
        onCreate={handleAddNewManga}
      />
      {manga.map((mangaItem) => (
        <AdminMangaCard
          key={mangaItem.id}
          id={mangaItem.id}
          Autor={mangaItem.Autor}
          imageUrl={mangaItem.imageUrl}
          Titlu={mangaItem.Titlu}
          rating={mangaItem.rating}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
};

export default AdminMangaPage;
