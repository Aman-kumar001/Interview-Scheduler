import '../styles/allint.css';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@material-ui/core/button';
import DeleteIcon from '@mui/icons-material/Delete';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SendNoti from '../functions/SendNoti';

const AllInterviews = ({
	allInterviews,
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
	edit,
	setEdit,
}) => {
	//reminder function that will send a mail to the participants
	const [expanded, setExpanded] = useState('');

	console.log(allInterviews, 'all');

	const handleChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : false);
	};

	const callDelete = (id) => {
		console.log(id);

		axios.delete('http://localhost:8000/api/interview/' + id).then((res) => {
			console.log('interview deleted');
			setRefresh(!refresh);
		});
	};

	return (
		<div className='AllInterviews'>
			{/* <h1>Scheduled Interviews</h1> */}

			<div className='interviewList'>
				{allInterviews &&
					//maping through the array to get all the items
					allInterviews.map((item, index) => {
						return (
							<div key={index} style={{ marginBottom: '1rem' }}>
								<Accordion
									expanded={expanded === `panel${index + 1}`}
									onChange={handleChange(`panel${index + 1}`)}
									style={{
										boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.1)',
										borderRadius: '10px',
									}}
								>
									<AccordionSummary>
										<div style={{ width: '100%' }}>
											<h2
												style={{
													display: 'flex',
													margin: '0',
													color: 'rgb(113,111,111)',
													alignItems: 'center',
													marginBottom: '1rem',
												}}
											>
												<p style={{ margin: '0', flex: '1' }}>
													Interview-{index + 1}
												</p>
												<p
													style={{
														margin: '0',
														flex: '1',
														textAlign: 'right',
														display: 'flex',
														columnGap: '1rem',
														justifyContent: 'right',
													}}
												>
													<NotificationsActiveIcon
														onClick={() => {
															SendNoti(item);
														}}
													/>
													<CreateIcon
														onClick={() => {
															setEndTime(item.end_time);
															setStartTime(item.start_time);
															setInterviewDate(item.date);
															setInterviewID(item._id);
															setEdit(!edit);
															var temp = [];
															for (
																var i = 0;
																i < item.participants.length;
																i++
															) {
																var obj = {
																	value: `${item.participants[i].email}`,
																	label: `${item.participants[i].name}`,
																};
																temp.push(obj);
															}
															setParticipants(temp);
															console.log('hello', participants);
														}}
													/>
													<DeleteIcon
														onClick={() => {
															console.log(item._id, 'item id');
															callDelete(item._id);
														}}
													/>
												</p>
											</h2>
											<div className='listItem'>
												<div>
													<p style={{ fontSize: '0.8rem' }}>Date</p>
													<p
														style={{ fontSize: '0.72rem', color: '#52505099' }}
													>
														{item.date}
													</p>
												</div>
												<div>
													<p style={{ fontSize: '0.8rem' }}>Start Time</p>

													<p
														style={{ fontSize: '0.72rem', color: '#52505099' }}
													>
														{item.start_time}
														{item.start_time < '12:00' ? ' AM' : ' PM'}
													</p>
												</div>
												<div>
													<p style={{ fontSize: '0.8rem' }}>End Time</p>
													<p
														style={{ fontSize: '0.72rem', color: '#52505099' }}
													>
														{item.end_time}
														{item.end_time < '12:00' ? ' AM' : ' PM'}
													</p>
												</div>
												<div>
													<p style={{ fontSize: '0.8rem' }}>Participants</p>
													<p
														style={{ fontSize: '0.72rem', color: '#52505099' }}
													>
														{item.participants.length}
													</p>
												</div>
											</div>
										</div>
									</AccordionSummary>
									<AccordionDetails>
										<h4>Participants:</h4>
										{item.participants.map(
											(participantItem, indexParticipant) => {
												return (
													<div
														key={indexParticipant}
														style={{
															color: 'grey',
															display: 'flex',
															flexDirection: 'row',
															justifyContent: 'space-between',
														}}
													>
														<p>{participantItem.name}</p>
														<p className='participantEmail'>
															{participantItem.email}
														</p>
													</div>
												);
											}
										)}
									</AccordionDetails>
								</Accordion>
							</div>
						);
					})}
				{/*appears when array is empty or when data is being fetched*/}
				{allInterviews.length == 0 && (
					<div style={{ textAlign: 'center' }}>
						<CircularProgress />
					</div>
				)}
			</div>
		</div>
	);
};

export default AllInterviews;
