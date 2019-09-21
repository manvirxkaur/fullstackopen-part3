import React from 'react'

const Notification = ({ message, status }) => {
  const baseStyle = {
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  const succesStyle = () => ({ ...baseStyle, color: 'green'})
  
  const errorStyle = () => ({ ...baseStyle, color: 'red'})

  if (message === null) {
    return null
  }

  return (
    <div style={status === 'success' ? succesStyle() : errorStyle()}>
      {message}
    </div>
  )
}

export default Notification
