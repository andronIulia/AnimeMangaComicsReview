import React, { useEffect, useState } from 'react';
import { collection, getDocs,doc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import ComicCard from '../components/ComicCard'; 
import { firestore, storage } from '../common/firebase';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom'; 

const ComicsPage = () => { 
  const [comics, setComics] = useState([]); 

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const comicsCollection = collection(firestore, 'comics'); 
        const querySnapshot = await getDocs(comicsCollection);
    
        const comicsData = [];
        for (const doc of querySnapshot.docs) {
          const comicData = doc.data();
          let imageUrl = '';
          if (typeof comicData.imageUrl === 'string') {
            imageUrl = comicData.imageUrl;
          } else {
            try {
              const imageUrlRef = ref(storage, comicData.imageUrl);
              imageUrl = await getDownloadURL(imageUrlRef);
            } catch (error) {
              console.error('Error getting image URL from reference:', error);
            }
          }
    
          const rating = Number(comicData.rating || 0);
          comicsData.push({
            id: doc.id,
            Autor: comicData.Autor,
            imageUrl: imageUrl,
            Titlu: comicData.Titlu,
            rating: rating,
          });
        }
    
        setComics(comicsData);
      } catch (error) {
        console.error('Error fetching comics:', error); 
      }
    };
    

    fetchComics();
  }, []);

  return (
    <div>
      <h1>Comics</h1> 
      <Grid container spacing={2}>
        {comics.map((comic) => (
          <Link to={`/comics/${comic.id}`} key={comic.id}> 
            <ComicCard 
              Autor={comic.Autor}
              imageUrl={comic.imageUrl}
              Titlu={comic.Titlu}
              rating={comic.rating}
            />
          </Link>
        ))}
      </Grid>
    </div>
  );
};

export default ComicsPage; 
