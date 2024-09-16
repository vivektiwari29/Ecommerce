import React from 'react'
import playStore from "../../../images/playstore.png"
import appStore from "../../../images/Appstore.png"
import "./Footer.css"

const Footer = () => {
  return (
    <footer id="footer">

        <div className = "leftFooter">
            <h4>DOWNLOAD OUR APP</h4>
            <p>Download App for Andriod and IOS mobile phone</p>
            <img src={playStore} alt="playstore" />
            <img src = {appStore} alt="appstore" />
        </div>




        <div className = "midFooter">
            <h1>ECOMMERCE</h1>
            <p>High quality is our first priority</p>
            <p>Copyrights 2024 &copy; Tiwari.exe</p>
        </div>




        <div className = "rightFooter">
            <h4>Follow Us</h4>
            <a href='https://www.instagram.com/tiwarii.exe?igsh=MTJpdGQ4aDI0ajl3ZQ=='>Instagram</a>
            <a href='https://www.instagram.com/tiwarii.exe?igsh=MTJpdGQ4aDI0ajl3ZQ=='>Facebook</a>
            <a href='https://www.instagram.com/tiwarii.exe?igsh=MTJpdGQ4aDI0ajl3ZQ=='>Youtube</a>
        </div>


    </footer>
  )
}

export default Footer