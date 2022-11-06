import React, { useEffect, useState } from "react";
import "./UserAppoint.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function UserAppoint() {
  const location = useLocation();
  const clinicName = location.state.clinicName;
  const clinicAddress = location.state.clinicAddress;
  const [queueL, setQueueL] = useState();
  const [min, setMin] = useState(null);
  const [sec, setSec] = useState(null);
  const [stateRetain, setStateRetain] = useState(false);
  const [bookStatus, setBookStatus] = useState(false);
  let minCounter;
  let secCounter;

  useEffect(() => {
    getQueue();
  }, [stateRetain]);

  const getQueue = () => {
    console.log("queue accessed");
    axios
      .post(`http://localhost:5000/getQueue`, {
        clinicName,
        clinicAddress,
      })
      .then((response) => {
        setQueueL(response.data);
        if (response.data !== 0) {
          if (stateRetain) {
            setStateRetain(!stateRetain);
          }
          setMin(response.data * 5 - 1);
          setSec(59);
          minCounter = response.data * 5 - 1;
          secCounter = 59;
          setInterval(startTimer, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const startTimer = () => {
    if (stateRetain) {
      return;
    }
    secCounter--;
    if (secCounter < 0) {
      if (minCounter === 0) {
        return;
      }
      minCounter--;
      secCounter = 59;
      setMin(minCounter);
      setSec(secCounter);
    } else setSec(secCounter);
  };

  const bookingHandler = (e) => {
    const user = {
      name: location.state.userName,
      contact: location.state.userContact,
    };
    axios
      .post(`http://localhost:5000/updateQueue`, {
        clinicName,
        user,
      })
      .then((response) => {
        console.log(response);
        setStateRetain(!stateRetain);
      })
      .catch((err) => {
        console.log(err);
      });

    // getQueue();

    e.target.textContent = "Appointment Booked!";
    e.target.style.backgroundColor = "green";
    setBookStatus(true);
  };

  return (
    <div className="Main">
      <div className="container">
        <h1 id="head" className="text-center">
          Welcome {location.state.userName}
        </h1>
        <div className="row">
          <div className="col-lg-6">
            <h2 className="text-center">{location.state.clinicName}</h2>
            <div className="row">
              <div className="col-12">
                <h3>Address:</h3>
                <p id="">{location.state.clinicAddress}</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 text-center Box d-flex flex-column align-items-center justify-content-sm-around">
            <button
              className="btn btn-primary btn-lg mb-4"
              onClick={bookingHandler}
              disabled={bookStatus ? true : false}
            >
              Book Your Appointment
            </button>

            <h3>
              Estimated queue time left : &nbsp; {min} :: {sec}
            </h3>

            <div className="row Stat">
              <div className="tot-tok col-12 text-center">
                <i className="fa fa-group"></i>
                <span>Your turn after : &nbsp; {queueL} &nbsp; patients</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
