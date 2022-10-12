import Header from './components/Header';
import './App.css';
import Button from '@material-ui/core/button';
import CreateInterView from './components/CreateInterview';
import { useEffect, useState } from 'react';
import AllInterviews from './components/AllInterviews';
import axios from 'axios';

function App() {
	const [users, setUsers] = useState([]);
	const [allInterviews, setAllInterviews] = useState([]);
	const [startTime, setStartTime] = useState(0);
	const [endTime, setEndTime] = useState(0);
	// const [schedule, setSchedule] = useState();
	const [interviewDate, setInterviewDate] = useState('');
	const [participants, setParticipants] = useState([]);
	const [interviewID, setInterviewID] = useState('');
	const [refresh, setRefresh] = useState(false);
	const [edit, setEdit] = useState(false);
	// const [data,setData]=useState();
	useEffect(() => {
		//to get all the users in our data base
		axios
			.get('http://localhost:8000/api/user', (req, res) => {
				res.json();
			})
			.then((data) => setUsers(data.data));
		// console.log(users, ' in app.js');
	}, []);

	useEffect(() => {
		//to get all the interviews in our data base
		axios
			.get('http://localhost:8000/api/interview', (req, res) => {
				res.json();
			})
			.then((data) => {
				console.log(data.data);
				setAllInterviews(data.data);
			});
	}, [refresh]);

	// console.log(allInterviews, 'app');

	return (
		<div className='App'>
			<Header />
			<div className='body'>
				<div className='leftBody'>
					<CreateInterView
						users={users}
						startTime={startTime}
						endTime={endTime}
						interviewDate={interviewDate}
						participants={participants}
						setInterviewDate={setInterviewDate}
						setStartTime={setStartTime}
						setEndTime={setEndTime}
						setParticipants={setParticipants}
						interviewID={interviewID}
						setInterviewID={setInterviewID}
						setAllInterviews={setAllInterviews}
						refresh={refresh}
						setRefresh={setRefresh}
						edit={edit}
						setEdit={setEdit}
					/>
				</div>
				<div className='rightBody'>
					{
						<AllInterviews
							allInterviews={allInterviews}
							startTime={startTime}
							endTime={endTime}
							interviewDate={interviewDate}
							participants={participants}
							setInterviewDate={setInterviewDate}
							setStartTime={setStartTime}
							setEndTime={setEndTime}
							setParticipants={setParticipants}
							interviewID={interviewID}
							setInterviewID={setInterviewID}
							refresh={refresh}
							setRefresh={setRefresh}
							edit={edit}
							setEdit={setEdit}
						/>
					}
				</div>
			</div>
		</div>
	);
}

export default App;
