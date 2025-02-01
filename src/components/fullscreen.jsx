import React, { useRef, useState,useEffect } from "react";
import { getUserData,storeexamstate,getexamstate } from "./storage";
import Quiz from "./questions";

const FullScreenComponent = () => {
  const containerRef = useRef(null);
  const [isvisible, setisvisible] = useState(false);
  const userdata=JSON.parse(getUserData());
  
  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setisvisible(true); // Exit fullscreen
      }
    };

    // if(getexamstate()==1){
    //   handleEnterFullScreen();
    // }
    

    // Add event listener for fullscreen change
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {

    
       
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Nothing"; // Standard message (browsers will show a default prompt)
    };

    window.addEventListener("beforeunload", handleBeforeUnload);


    const handleKeyDown = (event) => {
      var charCode = event.charCode || event.keyCode || event.which;
      if (charCode == 27){
        event.preventDefault();
        alert("Not Allowed!");
      }
      if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
        event.preventDefault();
        alert("Page refresh is disabled!");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      
    };
  }, []);


  const handleEnterFullScreen1 = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) { // Safari
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) { // Firefox
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.msRequestFullscreen) { // IE/Edge
        containerRef.current.msRequestFullscreen();
      }
    }
  };

  const handleEnterFullScreen = () => {
    setisvisible(true);
    storeexamstate(1);
    setTimeout(handleEnterFullScreen1, 300);
  };

  const handleExitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }
  };

  return (
    <>
     {/* Header */}
     <header className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm bg-white" style={{height:'10vh'}}>
        <div>
          <img
            src="/logokodebloom.png"
            alt="KodeBloom Logo"
            className="logo ms-5"
            style={{ width: "180px" }}
          />
        </div>
        <h3 className="me-5">Testing Platform</h3>
      </header>
    
    <div className="d-flex flex-column align-items-center justify-content-center" style={{height:'90vh',backgroundColor:'#ccc'}}>
      {isvisible && (
        <div
          ref={containerRef}
          onClick={handleEnterFullScreen1}
          style={{
            width: "100%",
            height: "100%",
            background: "lightblue",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid black",
            
          }}
        >
          <Quiz />
        </div>
      )}
      {!isvisible &&
      
      <div className="d-flex flex-column align-items-center justify-content-center p-3 bg-light shadow" style={{borderRadius:'8px',width:'600px'}}>
            <div>
              <h3 className="text-center text-primary">Hi. {userdata.name}</h3>
              <h2 className="text-center">Welcome to the Quiz App</h2>
              <p className="text-center">By starting the quiz, you agree to our terms and conditions. Ensure you remain on the quiz page throughout the session. Any attempt to switch tabs or navigate away may lead to warnings or termination of the quiz. Your activity may be monitored for integrity purposes.</p>
            </div>
         <button onClick={handleEnterFullScreen} className="btn btn-primary ">Start Exam</button>
      </div>
      }
    </div>
    </> 
  );
};

export default FullScreenComponent;
