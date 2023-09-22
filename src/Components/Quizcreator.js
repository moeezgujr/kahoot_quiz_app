import React, { useState } from "react";
import "../Styles/quizcreator.css"; // Import the CSS file
import { useHistory } from "react-router-dom";

function QuizCreator({ socket }) {
  // Define state to manage form data and the list of questions
  const [quizData, setQuizData] = useState({
    quizTitle: "",
    questions: [
      {
        questionText: "",
        answers: ["", "", "", ""],
        correctAnswer: 1, // Default to the first answer as correct
      },
    ],
  });

  // Function to handle changes in form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle changes in question text inputs
  const handleInputChangeForQuestion = (e, index) => {
    const { name, value } = e.target;
    setQuizData((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((question, i) =>
        i === index ? { ...question, questionText: value } : question
      ),
    }));
  };

  // Function to handle changes in answer inputs
  const handleInputChangeForAnswer = (e, qIndex, aIndex) => {
    const { name, value } = e.target;
    setQuizData((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((question, qI) =>
        qI === qIndex
          ? {
              ...question,
              answers: question.answers.map((answer, aI) =>
                aI === aIndex ? value : answer
              ),
            }
          : question
      ),
    }));
  };

  // Function to handle changes in correct answer inputs
  const handleInputChangeForCorrectAnswer = (e, index) => {
    const { name, value } = e.target;
    setQuizData((prevState) => ({
      ...prevState,
      questions: prevState.questions.map((question, i) =>
        i === index ? { ...question, correctAnswer: value } : question
      ),
    }));
  };

  // Function to add another question to the list
  const addQuestion = () => {
    setQuizData((prevState) => ({
      ...prevState,
      questions: [
        ...prevState.questions,
        {
          questionText: "",
          answers: ["", "", "", ""],
          correctAnswer: 1,
        },
      ],
    }));
  };
  const history = useHistory();

  // Function to update the database with the quiz
  const updateDatabase = () => {
    const gamePin = Math.floor(Math.random() * 90000) + 10000;
    const newQuiz = {};
    // Implement the logic to update the database here
    socket.emit("newQuiz", { quizData, gamePin });
    socket.emit("showGamePin", gamePin);
    history.push("/host");
  };
  // Function to cancel and return to the quiz selection
  const cancelQuiz = () => {
    history.push("/");
    // Implement the logic to cancel the quiz and return here
    console.log("Quiz creation canceled");
  };

  return (
    <div className="container">
      <h1 id="title">Kahoot Quiz Creator Studio</h1>

      <div className="form-field">
        <label id="quizTitle" style={{ color: "white" }}>
          Quiz Title
        </label>
        <input
          id="quizTitle"
          type="text"
          name="quizTitle"
          value={quizData.quizTitle}
          onChange={handleInputChange}
          autoFocus
        />
      </div>
      <br />
      <br />
      <div id="allQuestions">
        {quizData.questions.map((question, index) => (
          <div key={index} className="question-field">
            <label>{`Question ${index + 1}: `}</label>
            <input
              className="question"
              type="text"
              name={`questionText-${index}`}
              value={question.questionText}
              onChange={(e) => handleInputChangeForQuestion(e, index)}
            />
            <br />
            <br />
            {question.answers.map((answer, ansIndex) => (
              <div key={ansIndex}>
                <label>{`Answer ${ansIndex + 1}: `}</label>
                <input
                  className="answer_input"
                  type="text"
                  name={`answer-${index}-${ansIndex}`}
                  value={answer}
                  onChange={(e) =>
                    handleInputChangeForAnswer(e, index, ansIndex)
                  }
                />
              </div>
            ))}
            <br />
            <br />
            <label>Correct Answer (1-4):</label>
            <input
              className="correct"
              type="number"
              name={`correctAnswer-${index}`}
              value={question.correctAnswer}
              onChange={(e) => handleInputChangeForCorrectAnswer(e, index)}
            />
          </div>
        ))}
      </div>
      <br />
      <button className="width-100" onClick={addQuestion}>
        Add another question
      </button>

      <br />
      <br />

      <div>
        <button className="width-100" onClick={updateDatabase}>
          Create Quiz
        </button>
      </div>

      <br />

      <button className="width-100" onClick={cancelQuiz}>
        Cancel quiz and return to quiz selection
      </button>
    </div>
  );
}

export default QuizCreator;
