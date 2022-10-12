import '../styles/header.css';

const Header = () => {
	let newDate = new Date();
	let date = newDate.getDate();
	let month = newDate.getMonth() + 1;
	let year = newDate.getFullYear();
	// console.log(date, month, year);
	return (
		<div className='headContainer'>
			<div className='leftPart'>INTERVIEW</div>
			<div className='rightPart'></div>
		</div>
	);
};

export default Header;
