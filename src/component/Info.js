import React from 'react';
import { Divider, List, ListItem, ListItemText, Paper } from '@mui/material';
import { BoldDivider, capitalizeFirstLetter } from '../lib/functions';

const Info = ({
	activeItem
}) => {

	const processItem = () => {
		if (!activeItem) return null;
		if (activeItem.length === 1) {
			return (<List>
				{nodeInfo(activeItem[0])}
			</List>);
		}
		else {
			const rel = activeItem[0];
			return (<List sx={{maxHeight: '100vh'}}>
				<ListItem key={'turul'}>
					<ListItemText primary="Холбоос" />
					<ListItemText secondary={rel.type} />
				</ListItem>
				{objList(rel.properties) }
				<BoldDivider />
				<ListItem key={'desc'}>
					<ListItemText secondary='Дараах 2 оройг холбосон.' />
				</ListItem>
				<BoldDivider />
				{nodeInfo(activeItem[1])}
				<BoldDivider />
				{nodeInfo(activeItem[2], 2)}
			</List>);
		}
		// return activeItem;
	}

	const objList = (obj, n=1) => {
		return (
			<>
			{Object.entries(obj).map(([key, val], index) => {
				return (<>
					<Divider />
					<ListItem key={n + key} sx={{display:'flex', justifyContent:'space-between' }}>
						<ListItemText
							primary={capitalizeFirstLetter(key)}
							sx={{flex: 4}}
						// sx={{ width: 50 }}
						/>
						<ListItemText
							secondary={(['number', 'bigint'].includes(typeof val)) ? val.toString() : val.year ? `${val.year.low}-${val.month.low}-${val.day.low}` : capitalizeFirstLetter(val)}
	
							// sx={{ marginLeft: val.length && val.length > 20 ? 8 : 0 }}
							sx={{ flex: 11, textAlign: 'left' }}
						/>
					</ListItem>
				</>)
			})}
			</>

		);
	}

	const nodeInfo = (node, n = 1) => {
		return (
			<>
				<ListItem key={'turul'}>
					{/* <ListItemText
						primary='Оройн төрөл'
						sx={{ marginRight: -1 }}
					/> */}
					<ListItemText
						primary={node.label}
						// sx={{ marginLeft: 0 }}
					/>

				</ListItem>
				{objList(node.properties, n)}
			</>
		)
	}


	// processItem();
	return (
		activeItem ?
			<Paper elevation={3} sx={{ position: "absolute", right: 0, top: 0, width: 400, padding: 2 }}>
				{processItem()}
			</Paper>
			: null
	);
}

/*
songogdson node/relationship-n medeelliig haruuldag baina.

 - expand: uur luu ni zaasan relationship, node-g query yvuulj haruulna
 
 
 https://github.com/neo4j-examples/movies-javascript-bolt/blob/main/src/neo4jApi.js
 https://neo4j.com/docs/javascript-manual/current/query-simple/
*/
export default Info;