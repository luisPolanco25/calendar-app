import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import { Navbar } from '../ui/Navbar';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { eventClearActiveEvent, eventSetActive, eventStartLoading } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

const localizer = momentLocalizer(moment);

export const CalendarScreen = () => {

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month')
    const dispatch = useDispatch();
    const {events} = useSelector(state => state.calendar)
    const {uid} = useSelector(state => state.auth)

    useEffect(() => {

        dispatch(eventStartLoading());

    }, [dispatch]);
    
    const onDoubleClick = (e) => {
        dispatch(uiOpenModal());
    }

    const onSelectEvent = (e) => {
        dispatch(eventSetActive(e));
    }

    const onViewChange = (e) => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }

    const onSelectSlot = (e) => {
        dispatch(eventClearActiveEvent());
    }

    const eventStyleGetter = (event, start, end, isSelected) => {

        const style = {
            backgroundColor: (uid === event.user._id) ? '#367fc7' : '#465660',
            borderRadius: '0px',
            opacity: '0.8',
            display: 'block',
            color: 'white'
        }

        return {style};
    }
    
    return (
        <div className="calendar-screen">

            <Navbar />

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelectEvent}
                onSelectSlot={onSelectSlot}
                selectable={true}
                onView={onViewChange}
                view={lastView}
                components={{
                    event: CalendarEvent
                }}
            />

            <AddNewFab />
            <DeleteEventFab />

            <CalendarModal />

        </div>
    )
}
