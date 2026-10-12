
import React, { useState, useEffect } from "react";
import CounterDisplay from "./CounterDisplay";
import CounterControls from "./CounterControls";

function CounterPage() {
  const [counter, setCounter] = useState(0);
  const [message, setMessage] = useState("");

  const increment = () => {
    setCounter(prev => prev + 1);
  };

  const decrement = () => {
    setCounter(prev => prev - 1);
  };

  useEffect(() => {
    if (counter > 5) {
      setMessage("You passed 5!");
    } else {
      setMessage("");
    }
  }, [counter]);

  useEffect(() => {
    if (counter < 0) {
      setCounter(0);
    }
  }, [counter]);

  return (
    <div>
      <h1>Counter Page</h1>
      <CounterDisplay counter={counter} />
      <CounterControls
        increment={increment}
        decrement={decrement}
      />
      {counter > 5 && <p>{message}</p>}
    </div>
  );
}

export default CounterPage;
