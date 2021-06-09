import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';
import { uiCloseModal } from '../../actions/ui';
import { eventAddNew, eventClearActiveEvent, eventUpdated } from '../../actions/events';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
};

Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const finish = now.clone().add(1, 'hours');

const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: finish.toDate()
}

export const CalendarModal = () => {

    const [startDate, SetStartDate] = useState(now.toDate());
    const [endDate, SetEndDate] = useState(finish.toDate());
    const [validTitle, SetvalidTitle] = useState(true);

    const dispatch = useDispatch();
    const {modalOpen} = useSelector(state => state.ui);
    const {activeEvent} = useSelector(state => state.calendar);

    const [formValues, setFormValues] = useState(initEvent);

    
    const {title, notes, start, end} = formValues;

    useEffect(() => {

        if (activeEvent) {
            setFormValues(activeEvent);
        } else {
            setFormValues(initEvent);
        }
        
    }, [activeEvent, setFormValues]);

    const handleInputChange = ({target}) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const closeModal = () => {
        dispatch(uiCloseModal());
        dispatch(eventClearActiveEvent());
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        const momentStart = moment(start);
        const momentEnd = moment(end);

        if (momentStart.isSameOrAfter(momentEnd)) {
            return Swal.fire('Error', 'End date must be bigger', 'error');
        }

        if (title.trim().length < 2) {
            return SetvalidTitle(false);
        }

        if (activeEvent) {
            dispatch(eventUpdated(formValues));
        } else {
            dispatch(eventAddNew({
                ...formValues,
                id: new Date().getTime(),
                user: {
                    _id: '123',
                    name: 'Luis'
                }
            }));
        }

        
        SetvalidTitle(true);
        closeModal();
    }
    


    const handleStartDateChange =(e) => {
        SetStartDate(e);
        setFormValues({
            ...formValues,
            start: e,
        })
    }

    const handleEndDateChange =(e) => {
        SetEndDate(e);
        setFormValues({
            ...formValues,
            end: e,
        })
    }
    
    return (
        <Modal
        isOpen={modalOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        closeTimeoutMS={200}
        className="modal"
        overlayClassName="modal-background"
      >
            <h1> {(activeEvent) ? ' Edit event ' : ' New event '} </h1>
            <hr />
            <form className="container" onSubmit={handleSubmitForm}>

                <div className="form-group">
                    <label>Start date</label>
                    <DateTimePicker
                        onChange={handleStartDateChange}
                        value={startDate}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>End date</label>
                    <DateTimePicker
                        onChange={handleEndDateChange}
                        value={endDate}
                        className="form-control"
                        minDate={startDate}
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Title and notes</label>
                    <input 
                        type="text" 
                        className={`form-control ${(!validTitle) && 'is-invalid'}`}
                        placeholder="Title of event"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={handleInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">A short description</small>
                </div>

                <div className="form-group">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notes"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Additional info</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Save</span>
                </button>

            </form>
      </Modal>
    )
}
