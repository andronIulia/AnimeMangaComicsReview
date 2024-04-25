import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Grid, Rating,Box } from '@mui/material';
import { getDownloadURL,ref } from 'firebase/storage';
import { storage } from '../common/firebase';
import { useNavigate } from 'react-router-dom';
const BookCard = ({ id, Titlu, Autor, imageUrl, rating }) => {
  const navigateTo = useNavigate();

  const handleCardClick = () => {
    navigateTo(`/books/${id}`); 
  };

  return (
    <div onClick={handleCardClick}>
    <Box m={2}>
    <Card sx={{ maxWidth: 345
  }}>
      <CardMedia
        sx={{height: 140}}
        component="img"
        image={imageUrl}
        className="book-card" 
        alt={Titlu} 
      />
      <CardContent >
        <Typography variant="h5" component="div">
          {Titlu}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Autor: {Autor}
        </Typography>
        <Rating name="book-rating" value={rating} precision={0.5} readOnly />
      </CardContent>
    </Card>
    </Box>
    </div>
  );
};

export default BookCard;

