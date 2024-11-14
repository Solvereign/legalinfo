import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { expandNodeQueryString } from '../lib/neo4jFunctions';
import { isZuilZaalt } from '../lib/functions';

const CustomMenu = ({
	menu, setMenu, runQuery
}) => {

	const handleClose = (type = null) => {
		if (type) {
			runQuery(expandNodeQueryString({ ...menu.node }, type), true);
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
				<MenuItem onClick={() => { handleClose('parent') }} >Эцэг хуулийг олох</MenuItem>
			}
			{menu.node.label.toLowerCase() === 'хууль' &&
				<MenuItem onClick={() => { handleClose('lawparent') }} >Дурдсан хуулиудыг харах</MenuItem>
			}
			<MenuItem onClick={() => { handleClose('both') }}>Тэлэх</MenuItem>
			<MenuItem onClick={() => { handleClose('coming') }}>Орох холбоо</MenuItem>
			<MenuItem onClick={() => { handleClose('going') }}>Гарах холбоо</MenuItem>
		</Menu>
	);
}

export default CustomMenu;
