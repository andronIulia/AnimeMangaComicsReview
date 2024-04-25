import React, { useState } from 'react';
import { Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import EditBookCard from '../components/EditBookCard'; 

const AdminBookCard = ({ id, Titlu, Autor, imageUrl, rating, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
        onEdit(id, { Titlu, Autor, imageUrl: imageUrl ? imageUrl : '', rating });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };
    return (
        <Box m={2}>
            <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                    component="img"
                    height="140"
                    image={imageUrl || 'https://via.placeholder.com/300'}
                    alt={Titlu}
                />
                <CardContent>
                    {isEditing ? (
                        <EditBookCard
                            bookData={{ id, Titlu, Autor, imageUrl, rating }}
                            onUpdate={(updatedData) => {
                                onEdit(id, updatedData);
                                setIsEditing(false);
                            }}
                            onCancel={handleCancelEdit}
                        />
                    ) : (
                        <>
                            <Typography gutterBottom variant="h5" component="div">
                                {Titlu}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Autor: {Autor}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Rating: {rating}
                            </Typography>
                            <Button onClick={() => onDelete(id)} variant="outlined" color="error">
                                Șterge
                            </Button>
                            <Button onClick={handleEditClick} variant="outlined" color="primary">
                                Editează
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default AdminBookCard;
