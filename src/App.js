// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;




import React, { useState } from "react";
import axios from "axios";

const VoiceAssistant = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [listening, setListening] = useState(false);

  // Initialize SpeechRecognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  // Start voice recognition
  const startListening = () => {
    setListening(true);
    recognition.start();
  };

  // Handle speech recognition result
  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    setQuery(transcript);
    recognition.stop();
    setListening(false);
    
    // Send the query to the backend
    try {
      const res = await axios.post("https://webspeechbackend.onrender.com/api", { prompt: transcript });
      console.log(res.data);
      setResponse(res.data.message);
      speakResponse(res.data.message);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };


  // Handle speech recognition errors
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    setListening(false);
  };

  // Speak the response
  const speakResponse = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Voice Assistant</h2>
      <button onClick={startListening} disabled={listening}>
        {listening ? "Listening..." : "Speak"}
      </button>
      <p><strong>Your Query:</strong> {query}</p>
      <p><strong>Response:</strong> {response}</p>
    </div>
  );
};

export default VoiceAssistant;