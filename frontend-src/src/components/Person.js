import React from 'react'

const Person = ({ person, removePerson }) =>
  <div>
    {person.name} {person.number}
    <button onClick={() => removePerson(person)}>
      delete
    </button>
  </div>

export default Person
