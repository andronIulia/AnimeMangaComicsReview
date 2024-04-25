import React, { useState } from 'react';
import { Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, firestore } from '../common/firebase';

const NewBookCard = ({ onCreate }) => {
  const [Titlu, setTitle] = useState('');
  const [Autor, setAuthor] = useState('');
  const [rating, setRating] = useState(0);
  const [imageFile, setImageFile] = useState(null);

  const handleCreate = async () => {
    try {
      if (!Titlu || !Autor || !imageFile || !rating) {
        console.error('Error: All fields are required.');
        return;
      }
      console.log("Handling creation of new book...");
      const imageRef = ref(storage, `books/${imageFile.name}`);
      console.log("Image reference:", imageRef);
      await uploadBytes(imageRef, imageFile);
      console.log("Image uploaded successfully");
      const imageUrl = await getDownloadURL(imageRef);
      console.log("Download URL:", imageUrl);
      const bookData = {
        Titlu,
        Autor,
        rating,
        imageUrl,
      };
      console.log("New book data:", bookData);
      await addDoc(collection(firestore, 'books'), bookData);
      console.log("Book added to Firestore");
      onCreate(bookData); 
      setTitle('');
      setAuthor('');
      setRating(0);
      setImageFile(null);
    } catch (error) {
      console.error('Error creating new book:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <Card sx={{ maxWidth: 250}}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Adăugare carte nouă
        </Typography>
        <TextField
          label="Titlu"
          value={Titlu}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Autor"
          value={Autor}
          onChange={(e) => setAuthor(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Rating"
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          fullWidth
          margin="normal"
        />
        <input
          accept="image/*"
          id="contained-button-file"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span">
            Încarcă imagine
          </Button>
        </label>
        <Button onClick={handleCreate} variant="contained" color="primary">
          Creează
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewBookCard;

