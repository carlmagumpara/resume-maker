import React, { useState, useEffect } from 'react';
import moment from 'moment';

const CountdownTimer = ({ date }) => {

  // Set the target date and time for the countdown
  const targetDate = moment(date);

  // State to store the remaining time
  const [remainingTime, setRemainingTime] = useState(calculateTimeRemaining());

  // Function to calculate the remaining time
  function calculateTimeRemaining() {
    const now = moment();
    const duration = moment.duration(targetDate.diff(now));
    
    return {
      days: Math.floor(duration.asDays()),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  }

  // useEffect to update the remaining time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateTimeRemaining());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <span>{remainingTime.days} days, {remainingTime.hours} hours, {remainingTime.minutes} minutes, {remainingTime.seconds} seconds</span>
  );
};

export default CountdownTimer;
