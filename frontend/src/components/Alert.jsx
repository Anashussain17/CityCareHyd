import React from 'react'
import '../styles/alert.css';
const Alert = ({showAlert}) => {
  if(!showAlert) return null;
  return (
<>

<div className={`alert-${showAlert.type}`}>{showAlert.msg}</div>

</> 
)
}

export default Alert