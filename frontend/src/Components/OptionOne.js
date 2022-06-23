import React, { useState, useEffect } from "react";
import "./Option.css";

function OptionOne() {
  //#TODO get question from backend
  const [option, setOption] = useState("Biden");
  async function handleClick(e){
    e.preventDefault();
    if (
      window.confirm("Are you sure you want to vote for " + option + "?") ==
      false
    ) {
      return;
    }
    console.log(option);
  };
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

export default OptionOne;
