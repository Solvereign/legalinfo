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
			return (<List sx={{ maxHeight: '100vh' }}>
				<ListItem key={'turul'}>
					<ListItemText primary="Холбоос" />
					<ListItemText secondary={rel.type} />
				</ListItem>
				{objList(rel.properties)}
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

	const objList = (obj, label = '', n = 1) => {
		label=label.toLowerCase();
		const propList = ['нэр', 'төрөл', 'нэршил', 'хууль', 'дугаар', 'гарчиг', 'агуулга', 'баталсан', 'хэрэгжсэн', 'утга'];
		const formatValue = (val) => {
			if (['number', 'bigint'].includes(typeof val)) return val.toString();
			if (val.year && val.month && val.day) return `${val.year.low}-${val.month.low}-${val.day.low}`;
			return capitalizeFirstLetter(val);
		};

		const getListItem = (key, val) => {
			const isLawLink = key === 'хууль' || ((label==='хууль') && key === 'дугаар');
			const href = isLawLink ? `https://legalinfo.mn/mn/detail?lawId=${val}` : null;

			return (
				<ListItem
					key={n + key}
					sx={{ display: 'flex', justifyContent: 'space-between', color:'black' , textDecoration: href ? 'underline' : 'none', }}
					component={href ? 'a' : 'div'}
					href={href}
					target={href ? '_blank' : undefined}
				>
					<ListItemText primary={capitalizeFirstLetter(key)} sx={{ flex: 4 }} />
					<ListItemText secondary={formatValue(val)} sx={{ flex: 11, textAlign: 'left' }} />
				</ListItem>
			);
		};

		return (
			<>
				{propList
					.filter((elm) => obj.hasOwnProperty(elm))
					.map((key) => (
						<React.Fragment key={n + key}>
							<Divider />
							{getListItem(key, obj[key])}
						</React.Fragment>
					))}
			</>
		);
	}


	const nodeInfo = (node, n = 1) => {
		return (
			<>
				<ListItem key={'turul'}>
					<ListItemText
						primary={node.label}
					/>

				</ListItem>
				{objList(node.properties, node.label, n)}
			</>
		)
	}

	return (
		activeItem ?
			<Paper elevation={3} sx={{ position: "absolute", right: 0, top: 0, width: 400, padding: 2 }}>
				{processItem()}
			</Paper>
			: null
	);
}

export default Info;