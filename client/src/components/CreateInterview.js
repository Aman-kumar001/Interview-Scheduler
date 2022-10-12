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
	const selectInputRef = useRef();
	// const [flag, setFlag] = useState(false);

	useEffect(() => {
		//provides name and email of all the users to show in the dropdown menu
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
		//to get the participants for the interview
		setParticipants(options);
		// console.log(options, participants, 'options');
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
		setParList(temp);
		setEmails(temp2);
		// console.log(temp2, 'emails');
		// console.log(participants, parList, 'listto send');
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
		//flag gets raised whenever there is a overlap in the scheduled time.
		let flag = false;

		//api to get all the interviews that contains selected candidates as participants
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
				console.log(flag, 'inside');
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
		setParticipants([]);
		// console.log(flag, 'flag here');
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
		// console.log(flag, 'flag here');
	};

	console.log(...participants, obj, 'participants');
	return (
		<div className='createContainer'>
			<h1 className='leftHeading'>
				{edit ? 'Change' : 'Schedule'} a interview
			</h1>
			<div className='member'>
				<p>
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
					<label htmlFor='date'>Interview date</label>
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
					<label htmlFor='starttime'>Start time</label>
					<input
						type='number'
						name='start'
						id='start'
						value={startTime}
						min='0'
						max='24'
						onChange={(e) => {
							// console.log(e.target.value);
							setStartTime(e.target.value);
						}}
					/>
				</div>
				<div>
					<label htmlFor='endtime'>End time</label>
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
				<Button
					variant='contained'
					color='primary'
					style={{ width: '100%', margin: 'auto' }}
					onClick={() => {
						if (
							participants.length >= 2 &&
							interviewDate != '' &&
							startTime < endTime
						) {
							//scheduling interview
							if (!edit) {
								scheduleInterview();
								selectInputRef.current.select.clearValue();
								console.log('creating');
							} else {
								editSchedule();
								selectInputRef.current.select.clearValue();
							}
						} else {
							alert(
								'please select atleast 2 participants with all valid fields'
							);
						}
					}}
				>
					{!edit ? 'Schedule' : 'Confirm'}
				</Button>
			</div>
		</div>
	);
};

export default CreateInterView;
