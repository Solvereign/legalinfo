import { getNodesRels, normalizeNode, normalizeRel } from './functions';

const neo4j = require('neo4j-driver');

// const driver = neo4j.driver(
// 	process.env.URI,
// 	neo4j.auth.basic(process.env.USER, process.env.PASSWORD)
// )
const driver = neo4j.driver(
	'neo4j+s://acde1762.databases.neo4j.io',
	neo4j.auth.basic('neo4j', 'QVCFjrixawtnmMUPrbwWNlp0Gup_qM_hGPbZZ9sfAMM')
)
export const runQuery = async (query) => {
	const session = driver.session();
	try{
		const result = await session.run(query);
		// console.log(result);
		const nodeMap = new Map();
		const relMap = new Map();
		const items = [];

		result.records.forEach(record => {
			const keys = record.keys;
			keys.forEach(key => {
				// console.log(record[key])
				const value = record.get(key);
				if(!value) return;
				console.log(value)
				if(value.elementId) {items.push(value);}
				else {
					items.push(...getNodesRels(value));
					
				}
			})
			// console.log("++", keys);
			// keys.forEach(key => {
			// 	const value = record.get(key);
			// 	console.log(value);
			// 	if(value) {

			// 		// console.log("--",key, value)
			// 		if(value.labels) { // node
			// 			const node = normalizeNode(value);
			// 			nodeMap.set(node.elmId, node);
			// 		} else { // rel
			// 			const rel = normalizeRel(value);
			// 			relMap.set(rel.elmId, rel);
			// 		}
			// 	}
			// })
		});

		items.forEach((value) => {
			if(!value) return;
			if(value.labels) {
				const node = normalizeNode(value);
				nodeMap.set(node.elmId, node);
			} else {
				const rel = normalizeRel(value);
				relMap.set(rel.elmId, rel);
			}
		})

		return {nodes: nodeMap, rels: relMap};

	}catch (error) {
		console.error('Алдаа гарлаа:', error);
	  } finally {
		await session.close();
	  }
} 

export const nodeToString = (label, props) => {
	switch (label.toLowerCase()) {
		case 'хууль':
			return `{дугаар: ${props['дугаар']}}`;
		case 'зүйл': case 'заалт':
			return `{хууль: ${props['хууль']}, дугаар: '${props['дугаар']}'}`;
		case 'төрөл':
			return `{дугаар: ${props['дугаар']}}`;
		case 'томьёо':
			return `{нэршил: '${props['нэршил']}'}`;
		default:
			return '';
	}
}

export const expandNodeQueryString = (node, type = 'both') => {
	let qstr = `MATCH p = (l: ${node.label} ${nodeToString(node.label, node.properties)} )`
	switch (type) {
		case 'parent':
			return findParentLawQueryString(node);
		case 'lawparent':
			return findLawReferencesNodeString(node);
		case 'both':
			qstr += '-[]-() return p;'
			break;
		case 'coming':
			qstr += '<-[]-() return p;'
			break;
		default:
			qstr += '-[]->() return p;'
			break;
	}
	return qstr;
}

export const findParentLawQueryString = (node) => {
	// if(![зүйл])
	return `MATCH path = allShortestPaths((s:Хууль {дугаар: ${node.properties['хууль']}})-[*]->(endNode:${node.label} ${nodeToString(node.label, node.properties)})) RETURN path`;
}

export const findLawReferencesNodeString = (node) => {
	return `MATCH (z)-[r]->(n:Хууль {дугаар: ${node.properties['дугаар']}})
WITH z, z.хууль AS relatedLaw, collect(r) as rels, n
MATCH p = shortestPath((n1:Хууль {дугаар: relatedLaw})-[*]->(z))
RETURN z, n1, p, rels, n`
}