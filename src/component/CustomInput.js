import React, { useState, useEffect } from 'react';
import { TextField, Typography } from '@mui/material';

const CustomInput = ({ obj, setCypher }) => {

	// obj ni sentence/query hosmog baina. (sentenceQuery.js dotorh)
	const pattern = /{{([\s\S]+?)}}/g;// () haaltig awchihwal ...
	const match = obj.sentence.match(pattern); // Match full placeholders
	const extracted = match ? match.map(m => m.slice(2, -2)) : [];
	const sp = obj.sentence.split(pattern);

	const initObj = {}
	extracted.forEach(element => {
		initObj[element] = "";
	});

	const [queryInput, setInput] = useState(initObj);

	useEffect(() => {
		let newCypher = obj.query;
		Object.entries(queryInput).forEach( ([key, val]) => {
			newCypher = newCypher.replace(`{{${key}}}`, val);
		})
		setCypher(newCypher);
	}, [queryInput])

	return (
		<Typography
			variant='p'
			sx={{
				flex: '0 1 90%',
				borderRight: 1
			}}
		>
			{sp.map((val, idx) => idx % 2 === 0 ? val
				: <TextField
					key={val}
					onChange={(evt) => setInput({ ...queryInput, [val]: evt.target.value })}
					placeholder={val}
					sx={{
						'& .MuiInputBase-input': {
							color: 'black',
							fontSize: 14,
							fontFamily: 'Monospace',
							fontWeight: 'normal',
							width: '100px',
							height: '0px'
						},
					}}
					id='margin-none'
				/>
			)}
		</Typography>
	);
}

export default CustomInput;