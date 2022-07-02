import React, { useState, useEffect } from "react";
import "../App.css";
import Clock from "./Clock";
import web3 from "../web3";
import Contract from "../Contract";
import { postQuestion, reveal } from "../API";

function Admin() {
  const [details, setDetails] = useState({});
  const [revealPassword, setRevealPassword] = useState("");
  const [data, setData] = useState([]);
  const [qid, setQid] = useState();
  const [message, setMessage] = useState("");

  async function temp() {
    const q = await Contract.methods.Qid().call();
    setQid(q);
  }

  useEffect(() => {
    temp();
  }, []);

  /*
  emergencyRepay for testing at the moment
  */
  async function clickEmergencyRepay(e) {
    if (window.confirm("Perform Emergency Repay?") === false) {
      return;
    }
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    console.log("emergencyRepay ran");
    await Contract.methods
      .emergencyRepay()
      .send({ from: accounts[0], gas: 3000000 });
  }

  /*
  clickReveal for testing at the moment
  */
  async function clickReveal(e) {
    if (window.confirm("Perform Reveal?") === false) {
      return;
    }
    e.preventDefault();
    setMessage("Waiting on transaction...");
    const accounts = await web3.eth.getAccounts();
    async function submitToSmartContract(data) {
      await Contract.methods
        .reveal(data)
        .send({ from: accounts[0], gas: 3000000 });
      setMessage("Transaction completed");
    }

    try {
      reveal(revealPassword, qid).then((res) => {
        console.log(res.data.map(Object.values));
        submitToSmartContract(res.data.map(Object.values));
      });
    } catch {
      setMessage("Password incorrect");
    }
  }

  function handleSubmit() {
    const { content, optionzero, optionone, password } = details;
    postQuestion(content, optionzero, optionone, password);
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
            <input
              type="text"
              name="content"
              placeholder="Enter full question including punctuations"
              onChange={(e) =>
                setDetails({ ...details, content: e.target.value })
              }
            />
            <input
              type="text"
              name="optionzero"
              placeholder="Enter option zero"
              onChange={(e) =>
                setDetails({ ...details, optionzero: e.target.value })
              }
            />
            <input
              type="text"
              name="optionone"
              placeholder="Enter option one"
              onChange={(e) =>
                setDetails({ ...details, optionone: e.target.value })
              }
            />
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={(e) =>
                setDetails({ ...details, password: e.target.value })
              }
            />
            <button onClick={handleSubmit}> Submit</button>
          </form>
          <br />
          <form>
            <label>emergencyRepay</label>
            <button
              onClick={(e) => {
                clickEmergencyRepay(e);
              }}
            >
              {" "}
              Emergency Repay
            </button>
          </form>
          <br />
          <form>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={(e) => setRevealPassword(e.target.value)}
            />
            <button
              onClick={(e) => {
                clickReveal(e);
              }}
            >
              Reveal
            </button>
            {message}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Admin;
