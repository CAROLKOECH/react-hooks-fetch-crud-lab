import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:4000/questions");
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateQuestion = async (newQuestion) => {
    try {
      const response = await fetch("http://localhost:4000/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuestion),
      });
      if (!response.ok) {
        throw new Error("Failed to create question");
      }
      const data = await response.json();
      setQuestions([...questions, data]);
      setPage("List"); // After creating a question, go back to the question list
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete question");
      }
      setQuestions(questions.filter((question) => question.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateQuestion = async (id, correctIndex) => {
    try {
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correctIndex }),
      });
      if (!response.ok) {
        throw new Error("Failed to update question");
      }
      const updatedQuestions = questions.map((question) =>
        question.id === id ? { ...question, correctIndex } : question
      );
      setQuestions(updatedQuestions);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onCreateQuestion={handleCreateQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      )}
    </main>
  );
}

export default App;
