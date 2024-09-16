import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import InstagramIcon from "@material-ui/icons/Instagram";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import ProfileImage from "../../../images/AboutPageLogo.jpeg"


const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/tiwarii.exe";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
            //   src="https://res.cloudinary.com/tripleayt/image/upload/v1631555947/products/jpyibarlaxawvcvqjv5b.png"
            src={ProfileImage}
              alt="Founder"
            />
            <Typography>Vivek Tiwari</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is a sample wesbite made by @tiwarii.exe. Only with the
              purpose to learn MERN Stack.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="https://www.linkedin.com/in/vivek-tiwari-11631024a/"
              target="blank"
            >
              <LinkedInIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://instagram.com/tiwarii.exe" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;