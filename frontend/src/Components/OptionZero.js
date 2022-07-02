import React, { useState, useEffect } from "react";
import "./Option.css";

function OptionZero({ submitVote, optionZero }) {
  const [option] = useState(optionZero);
  /*
  Handling voting function 
  */
  async function handleClick(e) {
    e.preventDefault();
    if (
      window.confirm(
        'Are you sure you want to vote for "' + option + '" for 0.01 ETH?'
      ) === false
    ) {
      return;
    }
    submitVote(0);
  }
  return (
    <div>
      <h3
        className="option noselect"
        onClick={(e) => {
          handleClick(e);
        }}
      >
        {option}
      </h3>
    </div>
  );
}

export default OptionZero;
