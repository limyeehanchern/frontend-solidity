import React from "react";
import "./Question.css";

function Question({ participants }) {
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
