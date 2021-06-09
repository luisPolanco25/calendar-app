import React from 'react'

export const CalendarEvent = ({event}) => {
    
    const {title, user: {name}} = event;
    
    return (
        <div>
            <strong>{title}</strong>
            <span> - {name}</span>
        </div>
    )
}
