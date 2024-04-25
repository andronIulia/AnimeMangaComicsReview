import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore } from '../common/firebase';

const EditBookCard = ({ bookData, onUpdate }) => {
  const [Titlu, setTitle] = useState('');
  const [Autor, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(0);
  const [uploadedImageFile, setUploadedImageFile] = useState(null);

  useEffect(() => {
    console.log('Component re-rendered with book data:', bookData);
    setTitle(bookData.Titlu);
    setAuthor(bookData.Autor);
    setImageUrl(bookData.imageUrl); 
    setRating(bookData.rating);
  }, [bookData]);

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
      await updateDoc(doc(firestore, 'books', bookData.id), updatedData);
      onUpdate(updatedData);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    console.log('File :',file);
    if (file) {
      try {
        const uploadTask = await uploadBytes(ref(storage, `images/${file.name}`), file);
        const downloadURL = await getDownloadURL(uploadTask.ref);
        setImageUrl(downloadURL); 
        setUploadedImageFile(file);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      console.log('No file selected.');
    }
  };

  return (
    <div>
      <h2>Editare carte</h2>
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
        type="file"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" component="span">
          Încarcă imagine
        </Button>
      </label>
      <img src={imageUrl || ''} alt="Book" style={{ width: '200px' }} /> 
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

export default EditBookCard;
