// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [messages, setMessages] = useState([
    { text: 'Welcome! Are you looking for a Software estimate?', sender: 'bot' },
  ]);
  const [userInput, setUserInput] = useState('');
  const [category, setCategory] = useState('');

  const handleUserInput = async (event) => {
    event.preventDefault();
    const userText = userInput.trim().toLowerCase();
    if (!userText) return;

    // Add user message to chat
    setMessages((prevMessages) => [...prevMessages, { text: userText, sender: 'user' }]);
    setUserInput('');

    // Determine response based on user input
    if (!category) {
      if (userText === 'mobile' || userText === 'desktop') {
        setCategory(userText);
        const nextOptions = userText === 'mobile' ? 'Android or iOS?' : 'Mac, Linux, or Windows?';
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `You selected ${userText}. Which platform do you need an estimate for? ${nextOptions}`, sender: 'bot' },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Please select either Mobile or Desktop.', sender: 'bot' },
        ]);
      }
    } else {
      // Fetch estimate from backend based on the platform
      try {
        const response = await axios.get(`http://localhost:5000/estimate/${userText}`);
        const price = response.data.price;
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `The estimated price for ${userText} is INR ${price.toLocaleString()}.`, sender: 'bot' },
        ]);
        setCategory(''); // Reset category to allow new queries
      } catch {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Sorry, I couldn't find an estimate for "${userText}". Try another platform.`, sender: 'bot' },
        ]);
      }
    }
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleUserInput} className="chat-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
