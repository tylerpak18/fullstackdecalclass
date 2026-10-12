
import React from "react";

function CounterControls({ increment, decrement }) {
  return (
    <div>
      <button onClick={decrement}>Decrease</button>
      <button onClick={increment}>Increase</button>
    </div>
  );
}

export default CounterControls;
