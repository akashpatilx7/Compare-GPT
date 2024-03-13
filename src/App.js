import React, { useState } from "react";
import axios from "axios";

import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [userInput, setUserInput] = useState("");
  const [openaiResponse, setOpenaiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");

  const GEMINI_API_KEY = "AIzaSyCvMlTmIc0CucAM23DLjUbdC3v1Yvkbrhk";
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  const handleChange = (e) => {
    setUserInput(e.target.value);
    setPrompt(e.target.value);
  };
  const run = async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    setGeneratedContent(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    run();

    try {
      const response = await fetchOpenaiResponse(userInput);
      console.log(response);
      setOpenaiResponse(response.choices[0].message.content);

      console.log(openaiResponse);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOpenaiResponse = async (input) => {
    const OPENAI_API_KEY =
      "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";
    const result = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input }],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    return result.data;
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={userInput}
          onChange={handleChange}
          placeholder="Enter your Prompt here..."
        />
        <button type="submit" className="btn">
          Submit
        </button>
      </form>

      <div className="main-container">
        <div className="open-ai">
          <h2 className="headings">GPT-3.5's Response</h2>
          {isLoading && <p className="loading">Loading...</p>}
          {openaiResponse && <p className="response">{openaiResponse}</p>}
        </div>
        <div className="single-line" />
        <div className="gemini">
          <h2 className="headings">Gemini's Response</h2>
          {isLoading && <p className="loading">Loading...</p>}
          {generatedContent && <p className="response">{generatedContent}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
