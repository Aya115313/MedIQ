import DateDisplay from './DateDisplay.jsx';
import './Doctors.css';
import Header from "./header.jsx";
import Chat from "./Chat.jsx";
import Appointment from "./Appointment.jsx";

import Doc0 from "../assets/photosandicons/Doc0.jpg";
import ears from "../assets/photosandicons/ears.png";
import heart from "../assets/photosandicons/heart.png";
import bone from "../assets/photosandicons/bone.png";
import virus from "../assets/photosandicons/virus.png";
import asab from "../assets/photosandicons/3asab.png";
import teeth from "../assets/photosandicons/teeth.png";
import mind from "../assets/photosandicons/mind.png";
import nofav from "../assets/photosandicons/nofav.png";
import fav2 from "../assets/photosandicons/fav.png";
import exp from "../assets/photosandicons/experience.png";
import star from "../assets/photosandicons/stars.png";
import totalP from "../assets/photosandicons/total.png";
import chat from "../assets/photosandicons/chat.png";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from "../Services/authSerivice";

function Doctors() {
    const [searchTerm, setSearchTerm] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [clickedSpec, setClickedSpec] = useState(null);
    const [clickedDoc, setClickedDoc] = useState(null);
    const [viewAllDocs, setViewAllDocs] = useState(false);
    const [viewAllSpecs, setViewAllSpecs] = useState(false);
    const [expClicked, setExpClicked] = useState(false);
    const [schClicked, setSchClicked] = useState(false);
    const [revClicked, setRevClicked] = useState(false);
    const [locClicked, setLocClicked] = useState(false);
    const [favourite, setFavourite] = useState(true);
    const navigate = useNavigate();

    const specialties = [
        { spec: "GP", img: ears },
        { spec: "Cardiologist", img: heart },
        { spec: "Orthopedic", img: bone },
        { spec: "Oncologist", img: virus },
        { spec: "Neurologist", img: asab },
        { spec: "Dentist", img: teeth },
        { spec: "Psychiatrist", img: mind }
    ];

    // Fixed filtering logic - combine specialty and search filtering
    const getFilteredDoctors = () => {
        let filtered = doctors;
        
        // Filter by specialty if one is selected
        if (clickedSpec) {
            filtered = filtered.filter(doc => doc.specialty === clickedSpec);
        }
        
        // Filter by search term if one is entered
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(doc => 
                doc.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return filtered;
    };

    const filteredDoctors = getFilteredDoctors();
    const displayedDoctors = viewAllDocs ? filteredDoctors : filteredDoctors.slice(0, 5);
    const displayedSpecs = viewAllSpecs ? specialties : specialties.slice(0, 6);

    const Welcome = () => {
        const [username, setUsername] = useState('');

        useEffect(() => {
            const fetchUserInfo = async () => {
                try {
                    const response = await instance.get('/api/user-info/');
                    setUsername(response.data.username);
                } catch (error) {
                    console.error('Error fetching user info:', error);
                    if (error.response?.status === 401) {
                        navigate('/login');
                    }
                }
            };

            fetchUserInfo();
        }, []);

        return null; // Since this component is not being rendered currently
    }

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await instance.get('/api/doctors/');
                // Get saved favorites
                const savedFavorites = JSON.parse(localStorage.getItem('favoriteDoctors')) || [];
                // Mark doctors as favorites if they exist in savedFavorites
                const doctorsWithFavorites = response.data.map(doc => ({
                    ...doc,
                    isfav: savedFavorites.some(fav => fav.id === doc.id)
                }));
                setDoctors(doctorsWithFavorites);
            } catch (error) {
                if (error.response?.status === 401) {
                    navigate('/login');
                } else {
                    console.error('Error fetching doctors:', error);
                }
            }
        };
        fetchDoctors();
    }, [navigate]); 

    const toggleFavorite = (e, doc) => {
        e.stopPropagation();
        doc.isfav = !doc.isfav;
        
        // Update local state
        setDoctors([...doctors]);
        
        // Save to localStorage
        const savedFavorites = JSON.parse(localStorage.getItem('favoriteDoctors')) || [];
        if (doc.isfav) {
            // Check if doctor is already in favorites before adding
            const isDuplicate = savedFavorites.some(savedDoc => savedDoc.id === doc.id);
            if (!isDuplicate) {
                savedFavorites.push(doc);
            }
        } else {
            const index = savedFavorites.findIndex(d => d.id === doc.id);
            if (index > -1) {
                savedFavorites.splice(index, 1);
            }
        }
        localStorage.setItem('favoriteDoctors', JSON.stringify(savedFavorites));
        localStorage.setItem('allDoctors', JSON.stringify(doctors));
    };

    // Add button to navigate to favorites page
    const navigateToFavorites = () => {
        navigate('/favorites');
    };

    function expclick(){
        setExpClicked(true);
        setSchClicked(false);
        setRevClicked(false);
        setLocClicked(false);
    }

    function Review(){
        setExpClicked(false);
        setSchClicked(false);
        setRevClicked(true);
        setLocClicked(false);
    }

    function localistaion(){
        setExpClicked(false);
        setSchClicked(false);
        setRevClicked(false);
        setLocClicked(true);
    }

    function Schclick(){
        setExpClicked(false);
        setSchClicked(true);
        setRevClicked(false);
        setLocClicked(false);
    }

    return (
        <div className='Doctors-Body'>
            <Header />
            <div className='Doctors-cont'>
                <div className='search-Doc'>
                    <div className='desc-date'>
                        <p className='welcome'>Welcome, Patient</p>
                        <DateDisplay />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search doctors by name..." 
                        className='search-input'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="spec-section">
                        <p className='spec-welc'>Hello there! How can we assist you today?</p>
                        <p className='view' onClick={() => setViewAllSpecs(!viewAllSpecs)}>
                            {viewAllSpecs ? "View Less" : "View All"}
                        </p>
                    </div>
                    <div className="specialties-container">
                        <div className="specialties-list">
                            {displayedSpecs.map((spec, index) => (
                                <div key={index} className="specialty-item" onClick={() => setClickedSpec(clickedSpec === spec.spec ? null : spec.spec)}>
                                    <img src={spec.img} alt={spec.spec} className='spec-img' />
                                    <div>{spec.spec}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='Doctors-section'>
                        <div className='ay7aja'>
                            <p className='Recomended'>Recommended {clickedSpec || 'Doctors'}</p>
                            <p className='NofDoc'>{filteredDoctors.length}</p>
                        </div>
                        <p className='view' onClick={() => setViewAllDocs(!viewAllDocs)}>
                            {viewAllDocs ? "View Less" : "View All"}
                        </p>
                    </div>

                    <div className="doctors-container">
                        <div className="doctors-grid">
                            {displayedDoctors.map((doc, index) => (
                                <div key={index} className="doctor-card" onClick={() => setClickedDoc(doc)}>
                                    <img src={doc.photo} alt="Doctor" className='DocN' />
                                    <div className='doc-fav'>
                                        <h2>{doc.fullName}</h2>
                                        <img src={doc.isfav ? fav2 : nofav} alt="Favorite" className='fav' onClick={(e) => toggleFavorite(e, doc)} />
                                    </div>
                                    <p className='spec-doc'>{doc.specialty}</p>
                                    <p className={`status ${doc.status?.toLowerCase()}`}>{doc.status}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='Doc-Info'>
                    {clickedDoc && (
                        <div className='fixed-info'>
                            <div className='Doc-profile'>
                                <img src={clickedDoc.photo} alt="Doctor" className='DocN' />
                                <div className='doc-inf'>
                                    <p className='Doc-name'>{clickedDoc.fullName}</p>
                                    <p className='Doc-spec'>{clickedDoc.specialty}</p>
                                    <img src={clickedDoc.isfav ? fav2 : nofav} className='fav2' alt="Favorite" onClick={(e) => toggleFavorite(e, clickedDoc)} />
                                </div>
                            </div>
                            <div className="doc-overview">
                                <div className='experience-container'>
                                    <div className='exp-much'>
                                        <img src={exp} alt="Experience" className='exp-img' />
                                        <p>{clickedDoc.experience || "10 Years"}</p>
                                    </div>
                                    <p className='exp'>Experience</p>
                                </div>
                                <div className='experience-container'>
                                    <div className='exp-much'>
                                        <img src={totalP} alt="Patients" className='exp-img' />
                                        <p>{clickedDoc.total_patients || "10.5k"}</p>
                                    </div>
                                    <p className='exp'>Total Patients</p>
                                </div>
                                <div className='experience-container final-cont'>
                                    <div className='review'>
                                        <img src={star} alt="Reviews" className='star-img' />
                                        <p>{clickedDoc.reviews || "6.5k"}</p>
                                    </div>
                                    <p className='exp'>Reviews</p>
                                </div>
                            </div>
                            <div className='info'>
                                <p id='exp-info' onClick={() => expclick()} className={expClicked ? "active-btn" : ""}>Experience</p>
                                <p id='Sch-info' onClick={() => Schclick()} className={schClicked ? "active-btn" : ""}>Schedule</p>
                                <p id='local-info' onClick={() =>localistaion()} className={locClicked ? "active-btn" : ""}>Location</p>
                                <p id='rev-info' onClick={() =>Review()} className={revClicked ? "active-btn" : ""}>Review</p>
                            </div>
                            <div className='doctor-informations'>
                                {expClicked && <p>{clickedDoc.about || "Experience details here."}</p>}
                                {schClicked && <p>Schedule info here.</p>}
                                {revClicked && <p>Review info here.</p>}
                                {locClicked && <p>Location info here.</p>}
                            </div>
                            <div className='doc-services'>
                                <button className='chat-import' onClick={() => navigate('/Chat')}><p>Chat Now</p><img src={chat} alt="Chat" className='chat-img' /></button>
                                <button className='chat-import'>Import documents</button>
                                <button className='booking' onClick={() => {
                                    if (clickedDoc && clickedDoc.id) {
                                        navigate(`/Booking?doctorId=${clickedDoc.id}`);
                                        console.log(`Booking appointment with doctor ID: ${clickedDoc.id}`);
                                    }
                                }}>Book Appointment</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Doctors;