import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, addDoc, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from '../common/firebase';
import ReviewBookCard from './ReviewBookCard';
import NewReviewBookCard from './NewReviewBookCard';

const BookDetailsPage = () => {
    const { bookId } = useParams();
    const [bookData, setBookData] = useState(null);
    const [reviews, setReviews] = useState([]);

    const handleNewReviewSubmit = async (newReview) => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                newReview.userId = currentUser.uid;
                newReview.userName = currentUser.displayName;
                await addDoc(collection(firestore, 'books', bookId, 'reviews'), newReview);
                console.log('Recenzia a fost adăugată cu succes în baza de date!');
            } else {
                console.error('Utilizatorul nu este autentificat!');
            }
        } catch (error) {
            console.error('Eroare la adăugarea recenziei:', error);
        }
    };

    const handleDeleteReview = (reviewId) => {
        setReviews(reviews.filter(review => review.id !== reviewId)); 
    };

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const bookRef = doc(firestore, 'books', bookId);
                const bookSnapshot = await getDoc(bookRef);
                if (bookSnapshot.exists()) {
                    setBookData(bookSnapshot.data());
                    const bookReviewsQuery = query(collection(firestore, 'books', bookId, 'reviews'));
                    const bookReviewsSnapshot = await getDocs(bookReviewsQuery);
                    const bookReviewsData = bookReviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), bookId }));
                    console.log("Datele recenziilor din baza de date:", bookReviewsData);
                    setReviews(bookReviewsData);
                } else {
                    console.error('Book not found');
                }
            } catch (error) {
                console.error('Error fetching book details:', error);
            }
        };

        fetchBookDetails();
    }, [bookId]);

    return (
        <div>
            <h2>Detalii carte</h2>
            {bookData && (
                <div>
                    <h3>Titlu: {bookData.Titlu}</h3>
                    <h3>Autor: {bookData.Autor}</h3>
                    <h3>Rating: {bookData.rating}</h3>
                </div>
            )}
            <h3>Recenzii</h3>
            <ul>
                <NewReviewBookCard onSubmit={handleNewReviewSubmit} />
                {reviews.map((review, index) => (
                    <li key={index}>
                        <ReviewBookCard review={review} bookId={bookId} onDelete={handleDeleteReview} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookDetailsPage










