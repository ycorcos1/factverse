// App.js
import "./App.css";
import DarkMode from "./components/DarkMode";
import Fact from "./components/Fact";

function App() {
  return (
    <div className="app-container">
      {/* Styled FactVerse Text Logo */}
      <h1 className="logo">
        Fact<span className="verse">Verse</span>
      </h1>
      <DarkMode />
      <Fact />
    </div>
  );
}

export default App;
