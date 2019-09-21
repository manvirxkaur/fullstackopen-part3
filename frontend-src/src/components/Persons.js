import React from 'react'
import Person from './Person'

const Persons = ({persons, filterString, removePerson}) => persons
    .filter(person => person.name.toLowerCase().includes(filterString))
    .map(person => <Person key={person.name} person={person} removePerson={removePerson} />)

export default Persons
