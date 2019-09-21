import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ filterString, setFilterString] = useState('')
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationStatus, setNotificationStatus] = useState(null)

  useEffect(() => {
    getAllPersons()
  }, [])

  const getAllPersons = () => {
    personService
      .getAll()
      .then(allPersons => setPersons(allPersons))
  }

  const resetForm = () => {
    setNewName('')
    setNewNumber('')
  }

  const setNotification = (message, status) => {
    setNotificationMessage(message)
    setNotificationStatus(status)
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationStatus(null)
    }, 5000)
  }

  const createPerson = newPersonObject => {
    personService
      .create(newPersonObject)
      .then(addedPerson => {
        setNotification(`Added ${addedPerson.name}`, 'success')
        setPersons(persons.concat(addedPerson))
        resetForm()
      })
  }

  const updatePerson = (id, newPersonObject) => {
    personService
      .update(id, newPersonObject)
      .then(updatedPerson => {
        setNotification(`Updated ${updatedPerson.name}`, 'success')
        setPersons(persons.map(person => person.id !== id ? person : updatedPerson))
        resetForm()
      })
  }

  const addPerson = (event) => {
    event.preventDefault()

    const newPersonObject = {
      name: newName,
      number: newNumber,
    }

    const existingPerson = persons.some(person => person.name.toLowerCase() === newName.toLowerCase())

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personId = persons.find(person => person.name.toLowerCase() === newName.toLowerCase()).id
        updatePerson(personId, newPersonObject)
      }
      return
    }

    createPerson(newPersonObject)
  }

  const removePerson = (person) => {
    if (window.confirm(`Delete ${person.name}`)) {
      personService
        .remove(person.id)
        .then(() => getAllPersons())
        .catch(() => {
          const errorMessage = `Information of ${person.name} has already been removed from the server`
          setNotification(errorMessage, 'error')
          getAllPersons()
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterString(event.target.value)
  }


  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} status={notificationStatus} />

      <Filter
        filterString={filterString}
        handleFilterChange={handleFilterChange}
      />
      <h2>Add a new</h2>      
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filterString={filterString}
        removePerson={removePerson}
      />
    </div>
  )
}

export default App
