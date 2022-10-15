import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import Button from '@material-ui/core/button';
import '../styles/create.css';
import axios from 'axios';

const CreateInterView = ({
	users,
	setParticipants,
	setInterviewDate,
	setStartTime,
	setEndTime,
	startTime,
	endTime,
	interviewDate,
	participants,
	interviewID,
	setInterviewID,
	refresh,
	setRefresh,
	setAllInterviews,
	edit,
	setEdit,
}) => {
	const [allUsers, setAllUsers] = useState([]);
	const [parList, setParList] = useState([]);
	const [existingInterviews, setExistingInterviews] = useState([]);
	const [emails, setEmails] = useState([]);
	const [dateError, setDateError] = useState(false);
	const [timeError, setTimeError] = useState(false);
	const [participantError, setParticipantError] = useState(false);
	const [error, setError] = useState(false);
	const selectInputRef = useRef();

	useEffect(() => {
		var temp = [];
		if (users != undefined) {
			// console.log(users);
			for (var i = 0; i < users.length; i++) {
				var obj = {
					label: `${users[i].name}`,
					value: `${users[i].email}`,
				};

				temp.push(obj);
			}
			setAllUsers(temp);
			console.log(allUsers);
		}
	}, [users]);

	const handleChange = (options) => {
		setParticipants(options);
		var temp = [];
		var temp2 = [];
		for (var i = 0; i < options.length; i++) {
			var obj = {
				name: `${options[i].label}`,
				email: `${options[i].value}`,
			};
			temp2.push(options[i].value);
			temp.push(obj);
		}
		//storing participant list
		setParList(temp);

		//storing emails to fetch data accordingly
		setEmails(temp2);
	};

	var obj = [];
	for (var i = 0; i < participants.length; i++) {
		obj.push(participants[i]);
	}

	const scheduleInterview = () => {
		var payLoad = {
			date: `${interviewDate}`,
			start_time: `${startTime}`,
			end_time: `${endTime}`,
			participants: parList,
		};
		let flag = false;

		axios
			.get('http://localhost:8000/api/interview/validateSlots', {
				params: {
					email: emails,
				},
			})
			.then((res) => {
				console.log(res.data, 'other interviews');
				setExistingInterviews(res.data);

				//validation to prevent collisions
				for (var i = 0; i < res.data.length; i++) {
					if (res.data[i].date == interviewDate) {
						if (
							(res.data[i].start_time <= startTime &&
								startTime <= res.data[i].end_time) ||
							(res.data[i].start_time <= endTime &&
								endTime <= res.data[i].end_time)
						) {
							console.log('timing matches');
							flag = true;
							break;
						}
					}
				}

				if (flag === false) {
					// request to create new interview if it validates all the conditions
					axios
						.post('http://localhost:8000/api/interview', payLoad)
						.then((res) => {
							console.log(res.data);

							setRefresh(!refresh);
						});
				} else {
					alert(
						'Few participants are not free during this period of time, please choose accordingly.'
					);
				}
			});
		setStartTime(0);
		setEndTime(0);
		setInterviewDate('');
		setParticipants([]);
	};

	//function runs when user tries to edit a schedule
	const editSchedule = () => {
		var payLoad = {
			date: `${interviewDate}`,
			start_time: `${startTime}`,
			end_time: `${endTime}`,
			participants: parList,
		};

		//same as creating schedule...checks and validates the time slot
		let flag = false;
		axios
			.get('http://localhost:8000/api/interview/validateSlots', {
				params: {
					email: emails,
				},
			})
			.then((res) => {
				console.log(res.data, 'other interviews');
				setExistingInterviews(res.data);
				for (var i = 0; i < res.data.length; i++) {
					if (
						res.data[i].date == interviewDate &&
						interviewID != res.data[i]._id
					) {
						if (
							(res.data[i].start_time <= startTime &&
								startTime <= res.data[i].end_time) ||
							(res.data[i].start_time <= endTime &&
								endTime <= res.data[i].end_time)
						) {
							console.log('timing matches');
							flag = true;
							break;
						}
					}
				}
				console.log(flag, 'inside');
				if (flag === false) {
					// request to create new interview if it validates all the conditions
					axios
						.put(`http://localhost:8000/api/interview/${interviewID}`, payLoad)
						.then((res) => {
							console.log(res.data);
							setRefresh(!refresh);
						});
				} else {
					alert(
						'Few participants are not free during this period of time, please choose accordingly.'
					);
				}
			});
		setStartTime(0);
		setEndTime(0);
		setParticipants([]);
		setEdit(false);
		setInterviewDate('');
	};

	console.log(...participants, obj, 'participants');
	return (
		<div className='createContainer'>
			<h1 className='leftHeading'>
				{/*changing text accoring to the action*/}
				{edit ? 'Change' : 'Schedule'} a interview
			</h1>
			<div className='member'>
				<p style={{ color: `${participantError ? '#f44336' : ''}` }}>
					{edit
						? 'Make the required changes'
						: 'Select the participants for the Interview'}
				</p>
				<Select
					value={[...participants]}
					options={allUsers}
					isMulti={true}
					ref={selectInputRef}
					onChange={handleChange}
				/>
			</div>
			<div className='time'>
				<div>
					<label
						htmlFor='date'
						/*if there is some error we will change the colour of the label ot red*/
						style={{ color: `${dateError ? '#f44336' : ''}` }}
					>
						Interview date
					</label>
					<input
						style={{ width: 'auto' }}
						type='date'
						name='date'
						id='date'
						value={interviewDate}
						onChange={(e) => {
							setInterviewDate(e.target.value);
							console.log(e.target.value);
						}}
					/>
				</div>
			</div>
			<div className='time'>
				<div>
					<label
						htmlFor='starttime'
						style={{ color: `${timeError ? '#f44336' : ''}` }}
					>
						Start time
					</label>
					<input
						type='number'
						name='start'
						id='start'
						value={startTime}
						min='0'
						max='24'
						onChange={(e) => {
							setStartTime(e.target.value);
						}}
					/>
				</div>
				<div>
					<label
						htmlFor='endtime'
						style={{ color: `${timeError ? '#f44336' : ''}` }}
					>
						End time
					</label>
					<input
						type='number'
						name='end'
						id='end'
						value={endTime}
						min='0'
						max='24'
						onChange={(e) => {
							setEndTime(e.target.value);
						}}
					/>
				</div>
			</div>

			<div className='scheduleButton'>
				{!edit && (
					<Button
						variant='contained'
						style={{
							width: '100%',
							margin: 'auto',
							color: 'white',
							backgroundColor: `${!error ? '#3f51b5' : '#f44336'}`,
						}}
						onClick={() => {
							if (
								participants.length >= 2 &&
								interviewDate != '' &&
								startTime < endTime
							) {
								//scheduling interview

								scheduleInterview();
								selectInputRef.current.select.clearValue();
								console.log('creating');
							} else {
								setError(true);
								if (interviewDate == '') {
									setDateError(true);
								}
								if (startTime >= endTime) {
									setTimeError(true);
								}
								if (participants.length < 2) {
									setParticipantError(true);
								}
								setTimeout(() => {
									setDateError(false);
									setTimeError(false);
									setParticipantError(false);
									setError(false);
								}, 1500);
							}
						}}
					>
						Schedule
					</Button>
				)}
				{edit && (
					<div
						style={{
							width: '100%',
							columnGap: '2rem',
							display: 'flex',
							flexDirection: 'row',
						}}
					>
						<Button
							variant='contained'
							style={{
								flex: '1',
								margin: 'auto',
								color: 'white',
								backgroundColor: `${!error ? '#3f51b5' : '#f44336'}`,
							}}
							onClick={() => {
								if (
									participants.length >= 2 &&
									interviewDate != '' &&
									startTime < endTime
								) {
									//scheduling interview

									editSchedule();
									selectInputRef.current.select.clearValue();
								} else {
									setError(true);
									if (interviewDate == '') {
										setDateError(true);
									}
									if (startTime >= endTime) {
										setTimeError(true);
									}
									if (participants.length < 2) {
										setParticipantError(true);
									}
									setTimeout(() => {
										setDateError(false);
										setTimeError(false);
										setParticipantError(false);
										setError(false);
									}, 1500);
								}
							}}
						>
							Confirm
						</Button>
						<Button
							variant='contained'
							style={{
								flex: '1',
								margin: 'auto',
								color: 'white',
								backgroundColor: 'gray',
							}}
							onClick={() => {
								setStartTime(0);
								setEndTime(0);
								setParticipants([]);
								setEdit(false);
								setInterviewDate('');
							}}
						>
							cancel
						</Button>
					</div>
				)}
			</div>
			<div style={{ textAlign: 'center' }}>
				{participantError && (
					<p>Please more than 1 participant to schedule a meeting</p>
				)}
				{timeError && (
					<p>Please check starting and ending time of the meeting</p>
				)}
				{dateError && <p>Select a date</p>}
			</div>
		</div>
	);
};

export default CreateInterView;
