import { useState, useEffect, useRef } from 'react';
import ChatbotIcon from './components/ChatbotIcon';
import ChatForm from './components/ChatForm';
import ChatMessage from './components/ChatMessage';
import { faqData } from './components/Faqs';

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [visibleMainQuestions, setVisibleMainQuestions] = useState([]);
  const [remainingQuestions, setRemainingQuestions] = useState([]);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [visibleRelatedQuestions, setVisibleRelatedQuestions] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const chatBodyRef = useRef();

  // Initialize main questions and remaining questions
  useEffect(() => {
    const initialQuestions = faqData.slice(0, 5); // Show the first 5 questions
    const remaining = faqData.slice(5); // Remaining questions
    setVisibleMainQuestions(initialQuestions);
    setRemainingQuestions(remaining);
  }, []);

  useEffect(() => {
    if (chatBodyRef.current && chatBodyRef.current instanceof HTMLElement) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Handle FAQ selection
  useEffect(() => {
    if (selectedFAQ) {
      // Show related questions
      setVisibleRelatedQuestions(selectedFAQ.related.slice(0, 4)); // Show first 4 related questions
      setShowMore(selectedFAQ.related.length > 4); // Show "Show More" if more than 4 related questions

      // Show the selected FAQ's answer
      setChatHistory((prev) => [
        ...prev,
        { role: "user", text: selectedFAQ.question },
        { role: "model", text: selectedFAQ.answer },
        { role: "model", text: `Related questions: ${selectedFAQ.related.join(', ')}` },
      ]);
    }
  }, [selectedFAQ]);

  // Show more related questions
  const handleShowMore = () => {
    if (selectedFAQ) {
      setVisibleRelatedQuestions(selectedFAQ.related); // Show all related questions
      console.log("selectedFAQ>>>>.",selectedFAQ);
      setShowMore(false); // Hide "Show More" button
    }
  };

  // Handle "Other" option for main questions
  const handleOtherClick = () => {
    setVisibleMainQuestions(remainingQuestions.slice(0, 5)); // Show next 5 questions
    setRemainingQuestions((prev) => prev.slice(5)); // Update remaining questions
  };

  // Handle click on FAQ chip
  const handleFAQClick = (faq) => {
    console.log("faq >>>>>>>>>>>.",faq);
    if (faq && faq.id) {
      setSelectedFAQ(faq);
    }
  };

  return (
    <div className="container">
      {/* Chatbot Toggle Button */}
      <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
        <span className={`material-symbols-rounded ${showChatbot ? "rotate" : ""}`}>
          {showChatbot ? "close" : "mode_comment"}
        </span>
      </button>

      {/* Chatbot Popup */}
      <div className={`chatbot-popup ${showChatbot ? "visible" : "hidden"}`}>
        {/* Chat Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">BGNU Chatbot</h2>
          </div>
          <button onClick={() => setShowChatbot((prev) => !prev)} className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>

        {/* FAQ Chips */}
        <div className="faq-chips">
          {visibleMainQuestions.map((faq) => (
            <button key={faq.id} className="faq-chip" onClick={() => handleFAQClick(faq)}>
              {faq.question}
            </button>
          ))}
          {remainingQuestions.length > 0 && (
            <button className="faq-chip" onClick={handleOtherClick}>
              Other
            </button>
          )}
        </div>

        {/* Chat Body */}
        <div ref={chatBodyRef} className="chat-body">
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        

        {/* Chat Footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
