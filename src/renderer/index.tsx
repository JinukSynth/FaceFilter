import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import Mainview from "./components/MainView";


console.log("React is starting...");

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<Mainview />);

console.log("App component rendered.");
