import React, { useState } from 'react';
import Switch from '@mui/material/Switch';
import { Paper, FormControlLabel, IconButton, Divider, TextField, Box, FormControl, InputLabel, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { sentenceToCypher, sentenceQuery } from '../lib/sentenceQuery.js';
import CustomInput from './CustomInput.js';


const Controller = ({
	isMini, setMini, runWithType
}) => {
	const [open, setOpen] = useState(false);
	const [dialogOpen, setDialog] = useState(false);
	const [cypher, setCypher] = useState("match p = (l:Хууль {дугаар: 8928})<-[]-() return p");
	const [predefined, setPredefined] = useState('');
	const [selectOp, setSelect] = useState('');

	const handleDialogClose = ( change=false) => {
		console.log(change);
		if (change) {
			setPredefined(selectOp);
			setCypher(selectOp.query);
		}
		setDialog(false);
	}

	return (
		<div style={{ position: "absolute", left: 0, zIndex: 1 }}>
			<IconButton
				onClick={() => setOpen(!open)}
			>
				<MenuIcon />
			</IconButton>
			{open && (
				<Paper elevation={3}
					sx={{ width: 400, padding: 2 }}
				>

					<FormControlLabel control={
						<Switch
							checked={isMini}
							onChange={(evt) => { setMini(evt.target.checked) }}
							inputProps={{ 'aria-label': 'controlled' }}
						/>}
						label="Хялбар дүрслэл"
					/>
					<Button color='primary.dark' variant='outlined' onClick={() => setDialog(true)} sx={{ textTransform: 'none' }}>Асуулга сонгох</Button>

					<Dialog disableEscapeKeyDown open={dialogOpen} onClose={() => handleDialogClose()}>
						<DialogTitle>Асуулга сонгох</DialogTitle>
						<DialogContent>
							<Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
								<FormControl size="small" sx={{ m: 1, width: 300 }} >
									<InputLabel>Урьдаас тодорхойлсон асуулга</InputLabel>
									<Select
										id='select-predefined'
										value={selectOp}
										onChange={(evt) => { setSelect(evt.target.value) }}
										sx={{
											'& .MuiInputBase-input': {
												// color: 'black',
												fontSize: 14,
												fontFamily: 'Monospace',
												fontWeight: 'normal'
											},
											maxWidth: 380,
											'& .Mui-focused': {
												color: '#000000'
											},
										}}
									>
										<MenuItem value={''} key={'query-none'}> <em>None</em> </MenuItem>
										{sentenceQuery.map((elm) => <MenuItem value={elm} key={elm.sentence} >{elm.sentence}</MenuItem>)}
									</Select>
								</FormControl>

							</Box>
						</DialogContent>
						<DialogActions>
							<Button color='black' onClick={() => handleDialogClose()}>Болих</Button>
							<Button color='black' onClick={() => handleDialogClose(true)} autoFocus>Сонгох</Button>
						</DialogActions>

					</Dialog>

					<Divider />

					<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, m: 1 }}>
						{predefined ?
							<CustomInput
								obj={predefined}
								setCypher={setCypher}
							/> :
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
						}

						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, p: 0, m: 0 }}>
							<IconButton
								color='success'
								size='small'
								sx={{ padding: 0, margin: 0 }}
								onClick={() => { runWithType(sentenceToCypher(cypher)) }}
							>
								<PlayArrowRoundedIcon />
							</IconButton>
							<IconButton
								color='primary'
								size='small'
								sx={{ padding: 0, margin: 0 }}
								aria-label='Нэмэх'
								onClick={() => { runWithType(sentenceToCypher(cypher), true) }}
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