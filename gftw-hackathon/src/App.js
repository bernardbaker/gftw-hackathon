import React from "react";

import "./App.css";

class Snippet extends HTMLElement {
  constructor() {
    super();
    return (
      <div>
        <p>Title</p>
        <p>Snippet of text</p>
      </div>
    );
  }
}

window.customElements.define("app-snippet", Snippet);

function App() {
  return (
    <div className="App">
      <app-snippet></app-snippet>
    </div>
  );
}

export default App;
