import emailjs from 'emailjs-com';
import { useEffect } from 'react';
const SendNoti = (item) => {
	// var temp = `You have an interview scheduled scheduled at ${item.date} from ${item.start_time} to ${item.end_time}`;
	// console.log(temp, 'helyyyaya');
	for (var i = 0; i < item.participants.length; i++) {
		emailjs
			.send(
				'service_ls0ny0c',
				'template_vgw6cd4',
				{
					to_name: `${item.participants[i].name}`,
					to_user: `${item.participants[i].email}`,
					message: `You have an interview scheduled scheduled at ${item.date} from ${item.start_time} to ${item.end_time}.`,
				},
				'yevbpnArqpH8s41lR'
			)
			.then(
				(result) => {
					console.log(result.text);
				},
				(error) => {
					console.log(error.text);
				}
			);
	}
};

export default SendNoti;
