// == Import : npm
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

// == Import : local
// Composants
import App from "src/components/App";

// == Render

const rootReactElement = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

const target = document.getElementById("root");

ReactDOM.render(rootReactElement, target);
