import { Divider } from '@mui/material';

const getRep = (node) => {
	const label = node.label.toLowerCase();
	switch (label) {
		case "хууль":
			return node.properties['нэр'];
		case "зүйл": case "заалт":
			return node.properties['дугаар'];
		case "томьёо":
			return node.properties['нэршил'];
		case 'төрөл':
			return node.properties['төрөл'];
		default:
			return '!!!';
	}
}
export const capitalizeFirstLetter = (str) => {
	if ( str.length === 0) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}
export const BoldDivider = () => {
	return (
		<Divider
			sx={{
				borderBottomWidth: 1,
				borderColor: 'black',
			}}
		/>
	);
};
const colors = new Map([
	['хууль', '#94ac00'],
	['төрөл', '#dccbf5'],
	['заалт', '#9cdeff'],
	['зүйл', '#a7a4db'],
	['томьёо', '#f4dba9'],
]);
export const isZuilZaalt = (node) => {
	return ['зүйл', 'заалт'].includes(node.label.toLowerCase());
}

export const minimizeGraph = (graph) => {
	let miniNodes = [];
	let miniRel = [];
	graph.nodes.forEach(node => {
		if (!isZuilZaalt(node)) {
			miniNodes.push(node);
		}
	});
	graph.rels.forEach(rel => {
		const startNode = graph.nodes.get(rel.startId);
		const endNode = graph.nodes.get(rel.endId);
		const newNodeIds = [startNode, endNode].map(node => {
			if (isZuilZaalt(node)) {
				const huuliId = node.properties['хууль'];
				const parent = miniNodes.filter((node) => (node.label.toLowerCase() === 'хууль' && node.properties['дугаар'] === huuliId));
				return parent.length !== 0 ? parent[0].elmId : 0;
			}
			else return node.elmId;
		});
		if (newNodeIds[0] !== newNodeIds[1] && newNodeIds[0] * newNodeIds[1] !== 0) {
			miniRel.push({
				elmId: rel.elmId,
				startId: newNodeIds[0],
				endId: newNodeIds[1],
				type: rel.type
			})
		}
	})
	return graphMapToList({ nodes: miniNodes, rels: miniRel });
}

export const graphMapToList = (graph) => {
	const nodeList = [];
	const relList = [];
	const nodeCountMap = new Map();

	graph.rels.forEach(rel => {
		[rel.startId, rel.endId].forEach((id) => {
			const a = nodeCountMap.has(id) ? nodeCountMap.get(id) : 0;
			nodeCountMap.set(id, a + 1);
		});
		relList.push({
			id: rel.elmId,
			from: rel.startId,
			to: rel.endId,
			captions: [{ styles: ["bold"], value: rel.type }]
		});
	})

	graph.nodes.forEach(node => {
		nodeList.push({
			id: node.elmId,
			size: 40 + (nodeCountMap.has(node.elmId) ? nodeCountMap.get(node.elmId) * 2 : 0),
			captions: [{ styles: "", value: getRep(node) }],
			color: node.color
		})
	});

	return { nodes: nodeList, rels: relList };
}


export const normalizeNode = (node) => {
	const label = node.labels[0].toLowerCase();
	const properties = node.properties;
	const elmId = node.elementId;
	let id;
	let color = colors.get(label);
	switch (label) {
		case "хууль":
			id = properties['дугаар'];
			break;
		case "зүйл": case "заалт":
			id = `${properties['хууль']}+${properties['дугаар']}`;
			break;
		case "томьёо":
			id = properties['нэршил'];
			break;
		case 'төрөл':
			id = `т${properties['дугаар']}`
			break;
		default:
			id = '-1';
			break;
	}

	const np = {};
	Object.entries(properties).forEach(([key, val]) => {
		if (val.low) {
			// eslint-disable-next-line no-undef
			const adjustedLow = val.low < 0 ? (val.low + Math.pow(2, 32)) : val.low;
			// eslint-disable-next-line no-undef
			np[key] = (BigInt(val.high) << 32n) + BigInt(adjustedLow);
		} else { np[key] = val }
	})
	return {
		elmId: elmId,
		id: id,
		label: node.labels[0],
		color: color,
		properties: np
	};
}

export const normalizeRel = (rel) => {
	return {
		elmId: rel.elementId,
		startId: rel.startNodeElementId,
		endId: rel.endNodeElementId,
		type: rel.type,
		properties: rel.properties
	};
}

export const expandGraph = (original, additional) => {
	const tmp = { ...original }
	additional.nodes.forEach(node => {
		if (!tmp.nodes.has(node.elmId)) {
			tmp.nodes.set(node.elmId, node);
		}
	})
	additional.rels.forEach(rel => {
		if (!tmp.rels.has(rel.elmId)) {
			tmp.rels.set(rel.elmId, rel);
		}
	})
	return tmp;
}

export const getNodesRels = (obj) => {
	const items = [];
	if (obj.elementId) {
		return [obj];
	} else if (Array.isArray(obj)) {
		obj.forEach((elm) => {
			if (elm.elementId) { items.push(elm) }
			// else if(Array.isArray(elm)) {items.push(...getNodesRels(elm));}
			else { items.push(...getNodesRels(elm)); }
		});
	}
	else if (typeof obj === 'object') {
		Object.entries(obj).forEach(([key, val]) => {
			items.push(...getNodesRels(val));
		});
	} else {
		return [];
	}
	return items;
}
