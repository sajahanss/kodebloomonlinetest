import React, { useState,useEffect } from "react";
import "./question.css";
import axios from "axios";
import { getUserData,removeUserData } from "./storage";
import { useNavigate } from "react-router-dom";

 
const uploadquest=()=>{
axios.get('https://onlinetestbackend-66yo.onrender.com/questions')
      .then((res)=>{
          var   questions1=res.data
             console.log(questions1);
             questions1.map(item=>questions.push(item))
      })
      .catch((err)=>console.log(err))

    }
var questions = [];
uploadquest();

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [numbers, setNumbers] = useState([]);
  const [suffleno,setsuffleno]=useState(0);
  const [startTime, setstartTime] = useState(new Date().toLocaleTimeString());
  const [seconds, setSeconds] = useState(1800);
  const [isRunning, setIsRunning] = useState(true);
  const [timemin,setTimmin]=useState(0);
  const [timesec,setTimsec]=useState(0);
  const [warnings,setwarning]=useState(0);
  const [closetimer,setclosetimer]=useState(10);
  const userdatas=JSON.parse(getUserData());
  const navigate=useNavigate();
  const [useranswers,setuseranswers]=useState([]);
 

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
        setTimmin(Math.floor(seconds / 60));  
        setTimsec(seconds % 60);
        if(seconds<=1){
            setIsRunning(false);
        }
      }, 1000);
    } else {
      clearInterval(interval);
      alert('Time Up!, Quiz Closed')
      setIsQuizFinished(true);
      handleRestart();
    }
    return () => clearInterval(interval);
  }, [isRunning,seconds]);
  
  useEffect(() => {
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert("You switched tabs! Please stay on this page.");
        setwarning(warnings+1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handlePopState = (event) => {
      event.preventDefault();
      alert("Navigation is disabled!");
      navigate(1); // Prevent going back
    };

    window.addEventListener("popstate", handlePopState);


    return () => {
      
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("popstate", handlePopState);
    };

  }, [warnings,navigate]);

  useEffect(()=>{
    generateUniqueNumbers();
      
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Required for modern browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);


    const handleKeyDown = (event) => {
      var charCode = event.charCode || event.keyCode || event.which;
      if (charCode == 27){
        event.preventDefault();
        alert("Not Allowed!");
      }
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  },[]);

  useEffect(()=>{
    if(warnings==1){
      alert('1st Warning!, if You tab again, Quiz Will be Terminat')
    }
    if(warnings==2){
      alert('2nd Warning!, Quiz Closed')
      setIsQuizFinished(true);
      handleRestart();
    }
  },[warnings]);

  const generateUniqueNumbers = () => {
    let arr = Array.from({ length: 30 }, (_, i) => (i-1) + 1); // [0,1, 2, 3, ..., 25]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
    setNumbers(arr);
    setsuffleno(arr[0]);
  };
  
   

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
      var answ=''; 
     if(selectedOption==questions[suffleno].options.a){
      answ='a';
     }else if(selectedOption==questions[suffleno].options.b){
      answ='b';
     }else if(selectedOption==questions[suffleno].options.c){
       answ='c';
     }else if(selectedOption==questions[suffleno].options.d){
       answ='d';
     }
    
    if (answ ===  questions[suffleno].answer) {
      setScore(score + 1);
    }
     const quizanswers={
          QNo:currentQuestion+1,
          question:questions[suffleno].question,
          options:questions[suffleno].options,
          answer: questions[suffleno].answer,
          useranswer:answ
     }
     setuseranswers([...useranswers,quizanswers])

    setSelectedOption("");
    if (currentQuestion + 1 < questions.length-5) {
      setCurrentQuestion(currentQuestion + 1);
      setsuffleno(numbers[currentQuestion + 1])
     
    } else {
      setIsQuizFinished(true);
      handleRestart();
    }
  };


 const handleRestart = () => {
  
  const  timercloser=setInterval(() => {
      setclosetimer((prev)=>prev-1)
      setTimeout(() => {
        clearInterval(timercloser);
        navigate('/');
      }, 9000);
   }, 1000);

   setTimeout(() => {

    const result={
      examStartTime:startTime,
      score:score,
      totalQuiz:questions.length-5,
      warningCount:warnings,
      email:userdatas.email,
      phoneNumber:userdatas.phoneNumber,
      teststatus:1,
      useranswers:useranswers
    }
     axios.post('https://onlinetestbackend-66yo.onrender.com/result',result)
        .then((respo)=>{
          console.log(respo);
          removeUserData();
        })
        .catch((err)=>{
          console.log(err);
        })
    
   }, 1000);
   
  }

     

  
  
  
 
  return (
    <div className="quesform">
     
      {!isQuizFinished ? (
        <div className="quiz-container" style={{position:'relative'}}>
          <div style={{position:'absolute',right:'10px',top:'-30px',zIndex:'99',fontWeight:'bolder'}}><span>Time Remining</span> {`${timemin<10 ? "0" : ''}${timemin}:${timesec < 10 ? "0" : ""}${timesec}`}</div>
          <div style={{position:'absolute',left:'10px',bottom:'0',zIndex:'99',fontWeight:'bolder'}}>{`warning: ${warnings}`}</div>
          <h3 className="ms-5">
            Question {currentQuestion + 1} of {questions.length-5}
          </h3>
          <p className="ms-5">{questions[suffleno].question}</p>  
          <ul className="options-list">
            {/* {questions[suffleno].options.map((option, index) => ( */}
              <li className="option-item">
                <label>
                  <input
                    type="radio"
                    name="option"
                    value={questions[suffleno].options.a}
                    checked={selectedOption === questions[suffleno].options.a}
                    onChange={() => handleOptionSelect(questions[suffleno].options.a)}
                    className="me-3 ms-5"
                  />
                  {questions[suffleno].options.a}
                </label>
              </li>

              <li className="option-item">
                <label>
                  <input
                    type="radio"
                    name="option"
                    value={questions[suffleno].options.b}
                    checked={selectedOption === questions[suffleno].options.b}
                    onChange={() => handleOptionSelect(questions[suffleno].options.b)}
                    className="me-3 ms-5"
                  />
                  {questions[suffleno].options.b}
                </label>
              </li>

              <li className="option-item">
                <label>
                  <input
                    type="radio"
                    name="option"
                    value={questions[suffleno].options.c}
                    checked={selectedOption === questions[suffleno].options.c}
                    onChange={() => handleOptionSelect(questions[suffleno].options.c)}
                    className="me-3 ms-5"
                  />
                  {questions[suffleno].options.c}
                </label>
              </li>
  
              <li className="option-item">
                <label>
                  <input
                    type="radio"
                    name="option"
                    value={questions[suffleno].options.d}
                    checked={selectedOption === questions[suffleno].options.d}
                    onChange={() => handleOptionSelect(questions[suffleno].options.d)}
                    className="me-3 ms-5"
                  />
                  {questions[suffleno].options.d}
                </label>
              </li>
              
            {/* ))} */}
          </ul>
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="submit-btn"
          >
            {currentQuestion + 1 === questions.length ? "Finish" : "Next"}
          </button>
        </div>
      ) : (
        <div className="result-container">
          <h2>Quiz Finished!</h2>
          <p>
            Thank You ! page will close in {closetimer}
          </p>
         
        </div>
      )}
    </div>
  );
}

export default Quiz;