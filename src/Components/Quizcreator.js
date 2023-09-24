import React, { useState } from "react";
import "../Styles/quizcreator.css"; // Import the CSS file
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify"; // Import the toast library

function QuizCreator({ socket }) {
  // Define state to manage form data and the list of questions
  const [quizData, setQuizData] = useState({
    quizTitle: "",
    questions: [
      {
        questionText: "",
        answers: ["", "", "", ""],
        correctAnswer: 1,
      },
    ],
  });

  const history = useHistory();

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

  // ... (previous code)

  // Function to validate form inputs
  const validateForm = () => {
    if (quizData.quizTitle.trim() === "") {
      toast.error("Quiz Title cannot be empty");
      return false;
    }

    for (const question of quizData.questions) {
      if (question.questionText.trim() === "") {
        toast.error("Question Text cannot be empty");
        return false;
      }

      // Check for duplicate answers within a question
      const uniqueAnswers = new Set(
        question.answers.map((answer) => answer.trim())
      );
      if (uniqueAnswers.size !== question.answers.length) {
        toast.error("Duplicate answers found within a question");
        return false;
      }

      for (const answer of question.answers) {
        if (answer.trim() === "") {
          toast.error("Answer cannot be empty");
          return false;
        }
      }
    }

    return true;
  };

  // ... (rest of the code)

  // Function to update the database with the quiz
  const updateDatabase = () => {
    if (validateForm()) {
      const gamePin = Math.floor(Math.random() * 90000) + 10000;
      // Implement the logic to update the database here
      socket.emit("newQuiz", { quizData, gamePin });
      socket.emit("showGamePin", gamePin);
      history.push("/host");
    }
  };

  // Function to cancel and return to the quiz selection
  const cancelQuiz = () => {
    history.push("/");
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
            <br />
          </div>
        ))}
      </div>
      <br />
      <div style={{ display: "flex", flexDirection: "row", justifyContent:"flex-end" }}>
        <button className="button-creater" onClick={addQuestion}>
          Add Question
        </button>
        <div>
          <button className="button-creater" onClick={updateDatabase}>
            Create
          </button>
        </div>
        <button className="button-creater" onClick={cancelQuiz}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default QuizCreator;
