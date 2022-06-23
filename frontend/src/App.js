import React, { useState } from "react";
import "./App.css";
import Clock from "./Components/Clock";
import Question from "./Components/Question";
import OptionZero from "./Components/OptionZero";
import OptionOne from "./Components/OptionOne";

function App() {
  const dateOptions = { day: "numeric", month: "numeric", year: "numeric" };
  const [date, setDate] = useState(
    new Date().toLocaleString("en-GB", dateOptions).split("/").join(" . ")
  );

  // useEffect(() => {
  //   async function func() {
  //     setManager(await Lottery.methods.manager().call());
  //     setPlayers(await Lottery.methods.getPlayers().call());
  //     const eth = await web3.eth.getBalance(Lottery.options.address);
  //     setEther(web3.utils.fromWei(eth.toString(), "ether"));
  //   }
  //   return func;
  // }, []);

  return (
    <div className="App">
      <div className="logo-date">
        <h1 className="logo">limmy</h1>
        <h1 className="dot">&#8211; </h1>
        <Clock />
      </div>
      <div className="instructions">
        <div>choose the minority option</div>
        <div>new questions every midnight</div>
      </div>
      <div className="main-container">
        <div className="daily-container">
          <div className="question-date">{date}</div>
          <div className="question-option">
            <h1>
              <Question />
            </h1>
            <div className="daily-option">
              <OptionZero />
              <OptionOne />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
