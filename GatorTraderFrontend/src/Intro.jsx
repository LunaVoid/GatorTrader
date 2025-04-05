
import './App.css';
import './Login.css';
import './components/Navbar.jsx';
import React, { useState } from 'react';
import './Intro.css'; // Optional styling
import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

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
      options: ["React", "Angular", "Vue", "Django"],
      begin: "I am not and I have no clue where to begin.",
      inter: "I am somewhat familiar but am not invested",
      adv: "I am invested and am confident in my level of knowledge",
    },
    {
      id: 3,
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "Highlevel Text Markup Language",
        "Hyper Tool Multi Language",
        "Hyperlink Text Machine Language",
      ],
      begin: "Hyper Text Markup Language",
      inter: "Highlevel Text Markup Language",
      adv: "Hyperlink Text Machine Language",
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
      else(answers[q.id] == q.adv); {
        newScore += 3;
      }
    });
    setScore(newScore);
    setSubmitted(true);
    navigate('/TrackedStocks');
  };

  const handleClose = () => {
    setShowQuiz(false);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
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
                <p>Your score: {score} / {questions.length}</p>
                <button onClick={handleClose}>Close</button>
            
              </>
            )}
          </div>
        </div>
      
    </div>
  );
};

export default Intro;
