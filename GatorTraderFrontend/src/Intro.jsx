
import './App.css';
import './Login.css';
import './components/Navbar.jsx';
import React, { useState, useEffect } from 'react';
import './Intro.css'; // Optional styling
import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const [level, setLevel] = useState("");
  

  const questions = [
    {
      id: 1,
      question: "What level of financial knowledge do you believe you have?",
      options: ["I feel comfortable investing and making wise financial decisions.", "I feel like I know what to do, but I could learn more.", "I am completely lost on where to begin with my finances and investing."],
      adv: "I feel comfortable investing and making wise financial decisions.",
      inter: "I feel like I know what to do, but I could learn more.",
      begin: "I am completely lost on where to begin with my finances and investing.",

    },
    {
      id: 2,
      question: "Are you currently invested in the stock market?",
      options: ["I am not and I have no clue where to begin", "I am somewhat familiar but am not invested", "I am invested and am confident in my level of knowledge"],
      begin: "I am not and I have no clue where to begin.",
      inter: "I am somewhat familiar but am not invested",
      adv: "I am invested and am confident in my level of knowledge",
    },
    {
      id: 3,
      question: "Do you feel your college major/minor teaches you about finances?",
      options: [
        "Yes, I am in the College of Business or have an economic related major/minor",
        "Not sure, I may take a class about it but I already feel ok with my knowledge level on finance subjects.",
        "My college major/minor will not discuss finances to a significant degree if at all",
        
      ],
      begin: "My college major/minor will not discuss finances to a significant degree if at all",
      inter: "Not sure, I may take a class about it but I already feel ok with my knowledge level on finance subjects.",
      adv: "Yes, I am in the College of Business or have an economic related major/minor",
    },
  ];

  const handleOptionChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.begin) {
        newScore++;
      }
      else if(answers[q.id] == q.inter) {
        newScore += 2;
      }
      else if(answers[q.id] == q.adv) {
        newScore += 3;
      }
    });
    setScore(newScore);
    setSubmitted(true);
    
  };

  const getLevel = () => {
    let lev = "";
    if(score <= 3){
      lev = "beginner";
    } else if(score <= 6){
      lev = "intermediate";
    } else if(score > 6){
      lev = "advanced";
    }
    setLevel(lev);
  }

  useEffect(() => {
    if (submitted) {
      getLevel();
    }
  }, );

  const handleClose = () => {
    setShowQuiz(false);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    navigate('/TrackedStocks');
  };

  return (
    <div>
        <div className="popup-overlay">
          <div className="quiz-popup">
            <h2>Financial Literacy Survey</h2>
            {questions.map((q) => (
              <div key={q.id} className="question-block">
                <p>{q.question}</p>
                {q.options.map((opt) => (
                  <label key={opt} className="option-label">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={opt}
                      onChange={() => handleOptionChange(q.id, opt)}
                      checked={answers[q.id] === opt}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}

            {!submitted ? (
              <button onClick={handleSubmit}>Submit</button>
            ) : (
              <>
          
                <p>Your level: {level} </p>
                <button onClick={handleClose}>Close</button>
            
              </>
            )}
          </div>
        </div>
      
    </div>
  );
};

export default Intro;
