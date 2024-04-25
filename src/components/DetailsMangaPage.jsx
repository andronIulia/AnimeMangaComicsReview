import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, addDoc, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from '../common/firebase';
import ReviewMangaCard from './ReviewMangaCard';
import NewReviewMangaCard from './NewReviewMangaCard';

const MangaDetailsPage = () => {
    const { mangaId } = useParams();
    const [mangaData, setMangaData] = useState(null);
    const [mangaReviews, setMangaReviews] = useState([]);

    const handleNewReviewSubmit = async (newReview) => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                newReview.userId = currentUser.uid;
                newReview.userName = currentUser.displayName;
                await addDoc(collection(firestore, 'manga', mangaId, 'reviews'), newReview);
                console.log('Recenzia a fost adăugată cu succes în baza de date!');
            } else {
                console.error('Utilizatorul nu este autentificat!');
            }
        } catch (error) {
            console.error('Eroare la adăugarea recenziei:', error);
        }
    };

    const handleDeleteReview = (reviewId) => {
        setMangaReviews(mangaReviews.filter(review => review.id !== reviewId)); 
    };

    useEffect(() => {
        const fetchMangaDetails = async () => {
            try {
                const mangaRef = doc(firestore, 'manga', mangaId);
                const mangaSnapshot = await getDoc(mangaRef);
                if (mangaSnapshot.exists()) {
                    setMangaData(mangaSnapshot.data());
                    const mangaReviewsQuery = query(collection(firestore, 'manga', mangaId, 'reviews'));
                    const mangaReviewsSnapshot = await getDocs(mangaReviewsQuery);
                    const mangaReviewsData = mangaReviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), mangaId }));
                    console.log("Datele recenziilor din baza de date:", mangaReviewsData);
                    setMangaReviews(mangaReviewsData);
                } else {
                    console.error('Manga not found');
                }
            } catch (error) {
                console.error('Error fetching manga details:', error);
            }
        };

        fetchMangaDetails();
    }, [mangaId]);

    return (
        <div>
            <h2>Detalii manga</h2>
            {mangaData && (
                <div>
                    <h3>Titlu: {mangaData.Titlu}</h3>
                    <h3>Autor: {mangaData.Autor}</h3>
                    <h3>Rating: {mangaData.rating}</h3>
                </div>
            )}
            <h3>Recenzii</h3>
            <ul>
                <NewReviewMangaCard onSubmit={handleNewReviewSubmit} />
                {mangaReviews.map((review, index) => (
                    <li key={index}>
                        <ReviewMangaCard review={review} mangaId={mangaId} onDelete={handleDeleteReview} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MangaDetailsPage;
