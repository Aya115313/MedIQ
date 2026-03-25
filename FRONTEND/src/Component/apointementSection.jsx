import IM1 from "../assets/photosandicons/1.png"
import IM2 from "../assets/photosandicons/2.png"
import IM3 from "../assets/photosandicons/3.png"
import IM4 from "../assets/photosandicons/4.png"
import IM5 from "../assets/photosandicons/5.png"
import IM6 from "../assets/photosandicons/6.png"
import {Link} from "react-router-dom"
function Apointement(){
    return( 
        <div className="Apointement-container">
            <div className="descripton">
                <p className="welcome">Welcome to our site</p>
                <p className="title">Make an Apointement</p>
                <p className="browse">Find your Doctor<br></br> and make an apointement</p>
                
                    <Link to="/Doctors" className="book-container">
                    <button className="book">Book now</button>
                    <p className="Arrow">&rarr;</p>
                    </Link>

            </div>
            <div className="theme">
                <img src={IM1} alt=""  className="image1 im"/>
                <img src={IM2} alt=""  className="image2 im"/>
                <img src={IM3} alt=""  className="image3 im"/>
                <img src={IM4} alt=""  className="image4 im"/>
                <img src={IM5} alt=""  className="image5 im"/>
                <img src={IM6} alt="" className="image6 im"/>
            </div>
        

        
        </div>
    )
}

export default Apointement;