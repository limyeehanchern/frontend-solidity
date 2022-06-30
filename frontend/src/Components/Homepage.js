import React, { useState, useEffect } from "react";
import "../App.css";
import Clock from "./Clock";
import Question from "./Question";
import OptionZero from "./OptionZero";
import OptionOne from "./OptionOne";
import Contract from "../Contract";
import web3 from "../web3.js";
import CircularProgress from "@mui/material/CircularProgress";
import KeepMountedModal from "./Modal";
import { castVote, getCurrentQuestion, getCurrentSalt } from "../API";

function Homepage() {
  const dateOptions = { day: "numeric", month: "numeric", year: "numeric" };
  const [date, setDate] = useState(
    new Date().toLocaleString("en-GB", dateOptions).split("/").join(" . ")
  );
  const [message, setMessage] = useState("");
  const [participants, setParticipants] = useState(0);
  const [questionDetails, setQuestionDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [qid, setQid] = useState();

  /*
  Function to set question ID
  */
  async function getQuestionId() {
    setQid(await Contract.methods.Qid().call());
  }
  /*
  Invoking function to get accounts to get question ID
  */
  getQuestionId();

  /*
  Function to fetch current question from backend
  */
  async function getQuestion(qid) {
    if (qid === undefined) {
      return;
    }
    getCurrentQuestion(qid).then((res) => {
      setLoading(false);
      setQuestionDetails(res.data);
    });
  }

  /*
 usEffect to invoke getting of current question in the event qid is changed
  */
  useEffect(() => {
    getQuestion(qid);
  }, [qid]);

  /*
  useEffect to change participant number when user has successfully voted. The dependency array is 
  the message variable.
  */
  useEffect(() => {
    async function func() {
      setParticipants(await Contract.methods.getPlayersNumber().call());
    }
    return func;
    // setParticipants(0);
  }, [message]);

  /*
  On submitVote, the message will be changed to indicate that it is loading, a commitHash string is created
  by hashing the address, the option and the salt which is fetched from DB.

  Try Catch is used to check if the transaction is successful
  */
  const submitVote = async (option) => {
    const accounts = await web3.eth.getAccounts();
    const salt = await getCurrentSalt(qid);
    setMessage("Waiting on transaction success...");

    const unix = Math.floor(Date.now() / 1000);

    const commitHash = web3.utils.soliditySha3(
      { t: "address", v: accounts[0] },
      { t: "uint256", v: option },
      { t: "string", v: salt },
      { t: "uint256", v: unix }
    );
    // Sending vote with hashed
    try {
      // await Contract.methods
      //   .vote(commitHash)
      //   .send({ from: accounts[0], value: web3.utils.toWei("0.01", "ether") });

      // Sending data to backend to DB
      castVote(accounts[0], option, unix, salt);

      setMessage("You have submitted your vote");
    } catch {
      setMessage("Transaction failed.");
      return;
    }
  };

  return (
    <div>
      <div className="App">
        <KeepMountedModal />
        <div className="logo-date">
          <h1 className="logo">limmy</h1>
          <h1 className="dot">&#8226; </h1>
          <Clock />
        </div>
        <div className="instructions">
          <div>new questions every sunday</div>
        </div>
        <div className="main-container">
          {loading ? (
            "Loading"
          ) : (
            <div className="daily-container color1">
              <div className="question-date">{date}</div>
              <div className="question-option">
                <h1>
                  <Question
                    participants={participants}
                    content={questionDetails.content}
                  />
                </h1>
                <div className="daily-option">
                  <OptionZero
                    submitVote={submitVote}
                    optionZero={questionDetails.optionzero}
                  />
                  <OptionOne
                    submitVote={submitVote}
                    optionOne={questionDetails.optionone}
                  />
                </div>
                <div>
                  {message}
                  {message === "Waiting on transaction success..." ? (
                    <CircularProgress color="inherit" size="1em" />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
