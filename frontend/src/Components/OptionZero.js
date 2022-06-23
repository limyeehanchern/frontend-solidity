import React from "react";
import "./Option.css";

function OptionZero() {
  //#TODO get question from backend
  let option = "Trump";
  async function handleClick(e) {
    e.preventDefault();
    if (
      window.confirm("Are you sure you want to vote for " + option + "?") ==
      false
    ) {
      return;
    }
    console.log("optionzero clicked");
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
