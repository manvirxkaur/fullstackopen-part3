import React from 'react'

const Filter = ({ filterString, handleFilterChange }) => {
    return (
        <div>
            filter shown with <input
                value={filterString}
                onChange={handleFilterChange} />
        </div>
    )
}

export default Filter
