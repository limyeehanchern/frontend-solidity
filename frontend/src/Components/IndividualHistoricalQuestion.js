import React, { useState } from "react";
import "./Question.css";

function IndividualHistoricalQuestion(question) {
  const [clickedReveal, setClickedReveal] = useState(false);

  function handleClick(e) {
    e.preventDefault();
    setClickedReveal(true);
  }
  return (
    <div className={`daily-container color${Math.random(1, 12)}`}>
      <div className="question-option">
        <h1>
          <div className="daily-question">
            <div className="question">{question.content}</div>
          </div>
        </h1>
        <div className="daily-option">
          <div>
            <h3
              className="option noselect"
              onClick={(e) => {
                handleClick(e);
              }}
            >
              {history.optionzero}
            </h3>
          </div>
          <div>
            <h3
              className="option noselect"
              onClick={(e) => {
                handleClick(e);
              }}
            >
              {history.optionone}
            </h3>
          </div>
        </div>
        {clickedReveal ? (
          history.result
        ) : (
          <div>Vote to reveal how you would have fared</div>
        )}
      </div>
    </div>
  );
}

export default IndividualHistoricalQuestion;
