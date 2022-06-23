import React, { useState } from "react";
import "./Question.css";

function Question() {
  const [participants, setParticipants] = useState(0);
  return (
    <div className="daily-question">
      <div className="question">Who was the better president?</div>
      <div className="total-participants">
        Number of participants: {participants}
      </div>
    </div>
  ); //#TODO get question from backend
}

export default Question;
