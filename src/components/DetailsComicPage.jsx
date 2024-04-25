import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, addDoc, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from '../common/firebase';
import ReviewComicCard from './ReviewComicCard';
import NewReviewComicCard from './NewReviewComicCard';

const ComicDetailsPage = () => {
    const { comicId } = useParams();
    const [comicsData, setComicsData] = useState(null);
    const [comicsReviews, setComicsReviews] = useState([]);

    const handleNewReviewSubmit = async (newReview) => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                newReview.userId = currentUser.uid;
                newReview.userName = currentUser.displayName;
                await addDoc(collection(firestore, 'comics', comicId, 'reviews'), newReview);
                console.log('Recenzia a fost adăugată cu succes în baza de date!');
            } else {
                console.error('Utilizatorul nu este autentificat!');
            }
        } catch (error) {
            console.error('Eroare la adăugarea recenziei:', error);
        }
    };

    const handleDeleteReview = (reviewId) => {
        setComicsReviews(comicsReviews.filter(review => review.id !== reviewId)); 
    };

    useEffect(() => {
        const fetchComicsDetails = async () => {
            try {
                const comicsRef = doc(firestore, 'comics', comicId);
                const comicsSnapshot = await getDoc(comicsRef);
                if (comicsSnapshot.exists()) {
                    setComicsData(comicsSnapshot.data());
                    const comicsReviewsQuery = query(collection(firestore, 'comics', comicId, 'reviews'));
                    const comicsReviewsSnapshot = await getDocs(comicsReviewsQuery);
                    const comicsReviewsData = comicsReviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), comicId }));
                    console.log("Datele recenziilor din baza de date:", comicsReviewsData);
                    setComicsReviews(comicsReviewsData);
                } else {
                    console.error('Comics not found');
                }
            } catch (error) {
                console.error('Error fetching comics details:', error);
            }
        };

        fetchComicsDetails();
    }, [comicId]);

    return (
        <div>
            <h2>Detalii comics</h2>
            {comicsData && (
                <div>
                    <h3>Titlu: {comicsData.Titlu}</h3>
                    <h3>Autor: {comicsData.Autor}</h3>
                    <h3>Rating: {comicsData.rating}</h3>
                </div>
            )}
            <h3>Recenzii</h3>
            <ul>
                <NewReviewComicCard onSubmit={handleNewReviewSubmit} />
                {comicsReviews.map((review, index) => (
                    <li key={index}>
                        <ReviewComicCard review={review} comicId={comicId} onDelete={handleDeleteReview} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ComicDetailsPage;
