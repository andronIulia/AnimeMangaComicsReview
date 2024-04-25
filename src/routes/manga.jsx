import React, { useEffect, useState } from 'react';
import { collection, getDocs,doc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import MangaCard from '../components/MangaCard'; 
import { firestore, storage } from '../common/firebase';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom'; 

const MangaPage = () => { 
  const [mangas, setMangas] = useState([]); 

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const mangasCollection = collection(firestore, 'manga'); 
        const querySnapshot = await getDocs(mangasCollection);
    
        const mangasData = [];
        for (const doc of querySnapshot.docs) {
          const mangaData = doc.data();
          let imageUrl = '';
          if (typeof mangaData.imageUrl === 'string') {
            imageUrl = mangaData.imageUrl;
          } else {
            try {
              const imageUrlRef = ref(storage, mangaData.imageUrl);
              imageUrl = await getDownloadURL(imageUrlRef);
            } catch (error) {
              console.error('Error getting image URL from reference:', error);
            }
          }
    
          const rating = Number(mangaData.rating || 0);
          mangasData.push({
            id: doc.id,
            Autor: mangaData.Autor,
            imageUrl: imageUrl,
            Titlu: mangaData.Titlu,
            rating: rating,
          });
        }
    
        setMangas(mangasData);
      } catch (error) {
        console.error('Error fetching manga:', error); 
      }
    };
    

    fetchMangas();
  }, []);

  return (
    <div>
      <h1>Manga</h1> 
      <Grid container spacing={2}>
        {mangas.map((manga) => (
          <Link to={`/manga/${manga.id}`} key={manga.id}> 
            <MangaCard 
              Autor={manga.Autor}
              imageUrl={manga.imageUrl}
              Titlu={manga.Titlu}
              rating={manga.rating}
            />
          </Link>
        ))}
      </Grid>
    </div>
  );
};

export default MangaPage; 
