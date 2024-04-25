import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, firestore } from '../common/firebase';

const EditComicCard = ({ comicData, onUpdate }) => {
  const [Titlu, setTitle] = useState('');
  const [Autor, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(0);
  const [uploadedImageFile, setUploadedImageFile] = useState(null);

  useEffect(() => {
    setTitle(comicData.Titlu);
    setAuthor(comicData.Autor);
    setImageUrl(comicData.imageUrl);
    setRating(comicData.rating);
  }, [comicData]);

  const handleUpdate = async () => {
    try {
      let updatedData = {
        Titlu,
        Autor,
        rating,
        imageUrl: uploadedImageFile ? await uploadImageAndGetURL() : imageUrl
      };
      if (!uploadedImageFile) {
        updatedData = { ...updatedData, imageUrl }; 
      }
      await updateDoc(doc(firestore, 'comics', comicData.id), updatedData);
      onUpdate(updatedData);
    } catch (error) {
      console.error('Error updating comic:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      setUploadedImageFile(file);
    } else {
      console.log('No file selected.');
    }
  };

  return (
    <div>
      <h2>Editare comic</h2>
      <TextField
        label="Titlu"
        value={Titlu}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Autor"
        value={Autor}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        accept="image/*"
        id="contained-button-file"
        multiple
        type="file"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" component="span">
          Încarcă imagine
        </Button>
      </label>
      <img src={imageUrl || ''} alt="Comic" style={{ width: '200px' }} />
      <TextField
        label="Rating"
        type="number"
        value={rating}
        onChange={(e) => setRating(parseInt(e.target.value))}
      />
      <Button variant="contained" onClick={handleUpdate}>Actualizează</Button>
    </div>
  );
};

export default EditComicCard;
