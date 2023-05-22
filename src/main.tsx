import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TextEditor from "./components/TextEditor";

const App = () => {
  return <TextEditor />;
};

const container = document.getElementById("app");
const root = createRoot(container as HTMLElement); // createRoot(container!) if you use TypeScript
root.render(<App />);
