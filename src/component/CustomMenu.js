import React from 'react';
import { Divider, Menu, MenuItem } from '@mui/material';
import { expandNodeQueryString } from '../lib/neo4jFunctions';
import { BoldDivider, isZuilZaalt } from '../lib/functions';

const CustomMenu = ({
	menu, setMenu, runQuery, remove
}) => {

	const handleClose = (type = null) => {
		if (type) {
			if(type.startsWith('remove')) remove(menu.node, type); 
			else runQuery(expandNodeQueryString({ ...menu.node }, type), true);
		}
		setMenu(null)
	};

	return (
		<Menu
			open={Boolean(menu)}
			onClose={() => handleClose()}
			anchorReference="anchorPosition"
			anchorPosition={menu.pos}
		>
			{isZuilZaalt(menu.node) &&
				[<MenuItem onClick={() => { handleClose('parent') }} key='parentLaw' >Хуулийг харах</MenuItem>,
				<BoldDivider key={'divider-cond'} sx={{margin: '1px !important'}}/>]

			}
			{menu.node.label.toLowerCase() === 'хууль' &&
				[<MenuItem onClick={() => { handleClose('lawparent') }} key='seeReferences' >Дурдсан хуулиудыг харах</MenuItem>,
				<BoldDivider key={'divider-cond'} sx={{margin: '1px !important'}}/>]
			}
			<MenuItem onClick={() => { handleClose('remove') }} key='remove'>Хасах</MenuItem>
			<Divider key={'divider-1'} sx={{margin: '1px !important'}}/>
			<MenuItem onClick={() => { handleClose('removeChild') }} key='removeAll'>Зүйл, заалттай хасах</MenuItem>
			<BoldDivider key={'divider-2'} sx={{margin: '1px !important'}}/>
			<MenuItem onClick={() => { handleClose('both') }} key='expand'>Тэлэх</MenuItem>
			<Divider key={'divider-3'} sx={{margin: '1px !important'}}/>
			<MenuItem onClick={() => { handleClose('coming') }} key={'incoming'} >Орох холбоо</MenuItem>
			<Divider key={'divider-4'} sx={{margin: '1px !important'}}/>
			<MenuItem onClick={() => { handleClose('going') }} key='outgoing' >Гарах холбоо</MenuItem>
		</Menu>
	);
}

export default CustomMenu;
