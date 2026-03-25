import React from 'react';
import './DateDisplay.css'; // Optional: For styling
import image from "../assets/photosandicons/schdule.png"


function DateDisplay() {
// Create a Date object for February 17, 2025
const date = new Date(); // Note: Months are 0-indexed (0 = January, 1 = February)

// Format the date as "Month Day, Year"
const formattedDate = date.toLocaleDateString('en-US', {
month: 'long', // Full month name (e.g., "February")
day: 'numeric', // Day of the month (e.g., "17")
year: 'numeric', // Full year (e.g., "2025")
});


return (
<div className="date-display">
    <img src={image} alt="" className='roznama' />
    <p className='date-p'>{formattedDate}</p>
</div>
);
}

export default DateDisplay;