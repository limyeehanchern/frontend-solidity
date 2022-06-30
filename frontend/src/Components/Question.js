import React, { useState, useEffect } from "react";
import "./Question.css";

function Question({ participants, content }) {
  return (
    <div className="daily-question">
      <div className="question">{content}</div>
      <div className="total-participants">
        Number of participants: {participants}
      </div>
    </div>
  ); //#TODO get question from backend
}

export default Question;
