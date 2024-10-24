import React from 'react'
import "./spinner.css";

const Spinner:React.FC = () => {
  return (
    <div className="loading-container">
    <div className="ball"></div>
    <div className="ball"></div>
    <div className="ball"></div>
    <div className="ball"></div>
    <div className="ball"></div>
  </div>
  )
}


export default Spinner