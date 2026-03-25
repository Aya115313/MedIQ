import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Doctors.css';
import Header from "./header.jsx";
import Doc0 from "../assets/photosandicons/Doc0.jpg";
import fav2 from "../assets/photosandicons/fav.png";
import nofav from "../assets/photosandicons/nofav.png";

function Favorites() {
    const [favoriteDoctors, setFavoriteDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load favorite doctors from localStorage
        const loadFavorites = () => {
            const savedFavorites = JSON.parse(localStorage.getItem('favoriteDoctors')) || [];
            setFavoriteDoctors(savedFavorites.map(doc => ({ ...doc, isfav: true })));
        };
        
        loadFavorites();
        
        // Add event listener for storage changes
        window.addEventListener('storage', loadFavorites);
        
        return () => {
            window.removeEventListener('storage', loadFavorites);
        };
    }, []);

    const removeFavorite = (e, doctor) => {
        e.stopPropagation();
        const updatedFavorites = favoriteDoctors.filter(doc => doc.id !== doctor.id);
        setFavoriteDoctors(updatedFavorites);
        localStorage.setItem('favoriteDoctors', JSON.stringify(updatedFavorites));
        
        // Update allDoctors in localStorage
        const allDoctors = JSON.parse(localStorage.getItem('allDoctors')) || [];
        const updatedAllDoctors = allDoctors.map(doc => 
            doc.id === doctor.id ? {...doc, isfav: false} : doc
        );
        localStorage.setItem('allDoctors', JSON.stringify(updatedAllDoctors));

        // Dispatch storage event to update other components
        window.dispatchEvent(new Event('storage'));
    };

    const viewDoctorDetails = (doctor) => {
        navigate('/doctors');
    };

    return (
        <div className='Doctors-Body'>
            <Header />
            <div className='Doctors-cont'>
                <div className='search-Doc'>
                    <div className='desc-date' style={{ marginBottom: '20px' }}>
                        <button 
                            onClick={() => navigate('/doctors')} 
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#97C7D7',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '30px',
                            }}
                        >
                            Back to Doctors
                        </button>
                        <h2 style={{
                            color: '#333',
                            textAlign: 'center',
                            flex: 1
                        }}>Your Favorite Doctors</h2>
                    </div>

                    {favoriteDoctors.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#666'
                        }}>
                            <p>You don't have any favorite doctors yet.</p>
                            <button 
                                onClick={() => navigate('/doctors')}
                                style={{
                                    marginTop: '20px',
                                    padding: '10px 20px',
                                    backgroundColor: '#97C7D7',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    alignItemsc: 'center',
                                }}
                            >
                                Browse Doctors
                            </button>
                        </div>
                    ) : (
                        <div className="doctors-container">
                            <div className="doctors-grid">
                                {favoriteDoctors.map((doctor, index) => (
                                    <div key={index} className="doctor-card" onClick={() => viewDoctorDetails(doctor)}>
                                        <img src={doctor.photo || Doc0} alt={doctor.fullName} className='DocN' />
                                        <div className='doc-fav'>
                                            <h2>{doctor.fullName}</h2>
                                            <img 
                                                src={doctor.isfav ? fav2 : nofav}
                                                alt="Remove from favorites" 
                                                className='fav' 
                                                onClick={(e) => removeFavorite(e, doctor)}
                                            />
                                        </div>
                                        <p className='spec-doc'>{doctor.specialty}</p>
                                        <p className={`status ${doctor.status?.toLowerCase()}`}>
                                            {doctor.status}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Favorites;