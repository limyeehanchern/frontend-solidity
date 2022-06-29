import React, { useState } from "react";
import "../App.css";
import Clock from "./Clock";
import web3 from "../web3";
import Contract from "../Contract";
import { postQuestion } from "../API";

function Admin() {
  const [details, setDetails] = useState({});

  /*
  emergencyRepay for testing at the moment
  */
  async function clickEmergencyRepay() {
    if (window.confirm("Perform Emergency Repay?") === false) {
      return;
    }
    const accounts = await web3.eth.getAccounts();
    console.log("emergencyRepay ran");
    await Contract.methods
      .emergencyRepay()
      .send({ from: accounts[0], gas: 3000000 });
  }

  /*
  clickReveal for testing at the moment
  */
  async function clickReveal() {
    if (window.confirm("Perform Reveal?") === false) {
      return;
    }
  }

  function handleSubmit() {
    const { content, optionzero, optionone } = details;
    postQuestion(content, optionzero, optionone);
  }

  return (
    <div>
      <div className="App">
        <div className="logo-date">
          <h1 className="logo">admin</h1>
          <h1 className="dot">&#8226; </h1>
          <Clock />
        </div>
        <div className="main-container">
          <div> Submit new question </div>
          <form>
            <label htmlFor="email">content:</label>
            <input
              type="text"
              name="content"
              placeholder="Enter full question including punctuations"
              onChange={(e) =>
                setDetails({ ...details, content: e.target.value })
              }
            />
            <label htmlFor="email">option zero:</label>
            <input
              type="text"
              name="optionzero"
              placeholder="Enter option zero"
              onChange={(e) =>
                setDetails({ ...details, optionzero: e.target.value })
              }
            />
            <label htmlFor="email">option one:</label>
            <input
              type="text"
              name="optionone"
              placeholder="Enter option one"
              onChange={(e) =>
                setDetails({ ...details, optionone: e.target.value })
              }
            />
            <button onClick={handleSubmit}> Submit</button>
          </form>
          <br />
          <div onClick={clickEmergencyRepay}>emergencyRepay</div>
          <br />
          <div onClick={clickReveal}>reveal</div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
