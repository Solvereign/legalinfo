import React, { useState } from 'react';
import Switch from '@mui/material/Switch';
import { Paper, FormControlLabel, IconButton, Divider, TextField, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { sentenceToCypher } from '../lib/sentenceQuery.js';

const Controller = ({
	isMini, setMini, runWithType
}) => {
	const [open, setOpen] = useState(false);
	const [cypher, setCypher] = useState("match p = (l:Хууль {дугаар: 8928})<-[]-() return p");

	return (
		<div style={{position:"absolute", left: 0, zIndex: 1}}>
			<IconButton
				onClick={() => setOpen(!open)}
				// sx={{ position: "absolute", left: 0, zIndex: 1 }}
			>
				<MenuIcon />
			</IconButton>
			{open && (
				<Paper elevation={3} 
				// sx={{ position: "absolute", left: 0, top: 40, width: 400, padding: 2, zIndex: 1 }} 
				sx={{ width: 400, padding: 2}} 
				>

					<FormControlLabel control={
						<Switch
							checked={isMini}
							onChange={(evt) => { setMini(evt.target.checked) }}
							inputProps={{ 'aria-label': 'controlled' }}
						/>}
						label="Хялбар дүрслэл"
					/>
					<Divider />
					<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, m: 1 }}>
						<TextField
							multiline
							maxRows={8}
							value={cypher}

							onChange={(evt => setCypher(evt.target.value))}
							sx={{
								flex: '0 1 90%',
								'& .MuiInputBase-input': {
									color: 'black',
									fontSize: 14,
									fontFamily: 'Monospace',
									fontWeight: 'normal'
								},
							}}

						/>

						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, p: 0, m: 0 }}>
							<IconButton
								color='success'
								size='small'
								sx={{ padding: 0, margin: 0 }}
								onClick={() => {runWithType(sentenceToCypher(cypher))}}
							>
								<PlayArrowRoundedIcon />
							</IconButton>
							<IconButton
								color='primary'
								size='small'
								sx={{ padding: 0, margin: 0 }}
								aria-label='Нэмэх'
								onClick={() => {runWithType(sentenceToCypher(cypher), true)}}
							>
								<AddIcon />
							</IconButton>
						</Box>
					</Box>


				</Paper>
			)
			}
		</div>


	);
}

export default Controller;