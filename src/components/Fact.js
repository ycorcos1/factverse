import React, { useState, useEffect } from "react";
import axios from "axios";

const Fact = () => {
  const [fact, setFact] = useState(""); // Store the fact
  const [loading, setLoading] = useState(true); // Show loading state
  const [copyText, setCopyText] = useState("📋 Copy Fact"); // Track button text
  const [savedFacts, setSavedFacts] = useState([]); // Store saved facts
  const [showSaved, setShowSaved] = useState(false); // Toggle saved facts display

  // Fetch saved facts from localStorage on load
  useEffect(() => {
    const storedFacts = JSON.parse(localStorage.getItem("savedFacts")) || [];
    setSavedFacts(storedFacts);
    fetchFact();
  }, []);

  // Function to fetch a new fact
  const fetchFact = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://uselessfacts.jsph.pl/random.json?language=en"
      );
      setFact(response.data.text); // Set the fetched fact
    } catch (error) {
      console.warn("Primary API failed, switching to backup.");
      try {
        // 🔄 Backup API: Numbers API (random trivia)
        let backupResponse = await axios.get(
          "http://numbersapi.com/random/trivia?json"
        );
        setFact(backupResponse.data.text);
      } catch (backupError) {
        console.error("Both APIs failed.");
        setFact("Oops! Could not fetch a fact. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to copy the fact to clipboard and temporarily update button text
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fact);
    setCopyText("✅ Copied!"); // Change button text

    setTimeout(() => {
      setCopyText("📋 Copy Fact"); // Reset after 2 seconds
    }, 500);
  };

  // Function to read the fact aloud
  const speakFact = () => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(fact);
      speech.voice = window.speechSynthesis.getVoices()[0]; // Choose default voice
      window.speechSynthesis.speak(speech);
    } else {
      alert("Text-to-Speech is not supported in this browser.");
    }
  };

  // Function to save a fact
  const saveFact = () => {
    if (!savedFacts.includes(fact)) {
      const newSavedFacts = [...savedFacts, fact];
      setSavedFacts(newSavedFacts);
      localStorage.setItem("savedFacts", JSON.stringify(newSavedFacts));
    }
  };

  // Function to delete a saved fact
  const deleteFact = (index) => {
    const newSavedFacts = savedFacts.filter((_, i) => i !== index);
    setSavedFacts(newSavedFacts);
    localStorage.setItem("savedFacts", JSON.stringify(newSavedFacts));
  };

  return (
    <div className="fact-container">
      <div className="fact-box">
        {loading ? <p>Loading...</p> : <p>{fact}</p>}
      </div>
      <div className="button-container">
        <button onClick={fetchFact}>🔄 Get New Fact</button>
        <button onClick={copyToClipboard}>{copyText}</button>
        <button onClick={speakFact}>🔊 Read Fact</button>
        <button onClick={saveFact}>⭐ Save Fact</button>
        <button onClick={() => setShowSaved(!showSaved)}>
          📂 View Saved Facts
        </button>
      </div>

      {showSaved && (
        <div className="saved-facts">
          <h3>Saved Facts</h3>
          {savedFacts.length === 0 ? (
            <p>No saved facts yet.</p>
          ) : (
            <ul>
              {savedFacts.map((savedFact, index) => (
                <li key={index}>
                  {savedFact}
                  <button
                    className="delete-button"
                    onClick={() => deleteFact(index)}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Fact;
