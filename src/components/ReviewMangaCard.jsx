import React, { useState } from "react";
import { Button, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, firestore } from '../common/firebase';

const checkAdmin = async (userId) => {
    try {
        console.log("Checking admin status for user:", userId);
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        const userData = userDoc.data();
        console.log("User data:", userData);
        return userData && userData.isAdmin === true;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
};

const ReviewMangaCard = ({ review, onDelete, mangaId }) => { 
    const [openDialog, setOpenDialog] = useState(false);

    const handleDelete = async () => {
        try {
            const currentUser = auth.currentUser;
            console.log("Current user:", currentUser);
            if (!currentUser) {
                console.error('Utilizatorul nu este autentificat!');
                return;
            }

            const isAdmin = await checkAdmin(currentUser.uid);
            console.log("Is admin:", isAdmin);
            const isOwner = review.userId === currentUser.uid;
            console.log("Is owner:", isOwner);
            if (isAdmin || isOwner) {
                await deleteDoc(doc(firestore, 'manga', mangaId, 'reviews', review.id)); 
                onDelete(review.id);
            } else {
                console.error('Utilizatorul nu are permisiunea să șteargă această recenzie!');
            }
        } catch (error) {
            console.error('Eroare la ștergerea recenziei:', error);
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Card sx={{ maxWidth: 345, margin: "auto", marginBottom: 20 }}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {review.userId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {review.text}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Rating: {review.rating}
                </Typography>
                <Button onClick={handleOpenDialog} color="secondary">Șterge</Button>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Confirmare ștergere</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">Ești sigur că vrei să ștergi această recenzie?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">Anulează</Button>
                        <Button onClick={handleDelete} color="secondary">Șterge</Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
        </Card>
    );
};

export default ReviewMangaCard;
