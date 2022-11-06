import React, { useState, useEffect } from "react";
import "./UserHome.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserHome() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios
      .get("https://ezappoint.herokuapp.com/fetchClinics")
      .then((response) => {
        setResults(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const userName = location.state.name;
  const userContact = location.state.contact;

  const handleChange = (event) => {
    const name = event.target.parentNode.getAttribute("name");
    const address = event.target.parentNode.getAttribute("address");
    navigate("/userAppoint", {
      state: {
        clinicName: name,
        clinicAddress: address,
        userName,
        userContact,
      },
    });
  };

  return (
    <>
    <div className="container">
      {results.map((result, index) => {
        return (
          
            <div className="result card text-center">
              <div className="text-center" key={index}>
                <div className="display-4 card-header">
                  {result.nameOfClinic}
                </div>
                <div className="card-body">
                  <h5 className="card-title">{result.address}</h5>
                  <p className="card-text">Best Clinics in the Town</p>
                  <div className="card-special">Specialized in : {result.fos}</div>
                    {/* <img src="https://img.icons8.com/ios-filled/50/000000/arrow.png" /> */}
                  
                </div>
                <div className="card-footer">
                  <button
                    name={`${result.nameOfClinic}`}
                    address={`${result.address}`}
                    onClick={handleChange}
                    className="btn"
                  >Book Appointment</button>
                  </div>
              </div>
            </div>
         
        );
      })} 
      </div>
    </>
  );
}
