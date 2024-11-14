import React, { useState, useEffect } from 'react';
import { InteractiveNvlWrapper } from '@neo4j-nvl/react';
import Info from './Info.js';
import { graphMapToList, minimizeGraph, expandGraph} from '../lib/functions.js';
import Controller from './Controller.js';
import { runQuery } from '../lib/neo4jFunctions.js';
import CustomMenu from './CustomMenu.js';


const Legalinfo = () => {
	const [isMini, setMini] = useState(false); // jijig haruulah esehiig shiidne
	const [graph, setGraph] = useState(null); // serverees awsan medeelel end hadgalagdana.
	const [activeItem, setItem] = useState(null);
	const [showGraph, setShowGraph] = useState(null); // delgetsend haruulah medeelel end haragdana. herwee mini===false baiwal graph-g ter chigeer ni haruulna.
	const [menuNode, setMenuNode] = useState(null);

	const mouseEventCallbacks = {
		// onHover: (element, hitTargets, evt) =>
		//   console.log('onHover', element, hitTargets, evt),
		onRelationshipRightClick: (rel, hitTargets, evt) =>
			console.log('onRelationshipRightClick', rel, hitTargets, evt),
		onNodeClick: (node, hitTargets, evt) => setItem([graph.nodes.get(node.id)]),
		//   console.log('onNodeClick', node, hitTargets, evt),
		onNodeRightClick: (node, hitTargets, evt) => {
			console.log('onNodeRightClick', node, hitTargets, evt)
			setMenuNode({
				node:graph.nodes.get(node.id),
				pos: {
					top:evt.y,
					left: evt.x
				}
			});
		},
		// onNodeDoubleClick: (node, hitTargets, evt) =>
		//   console.log('onNodeDoubleClick', node, hitTargets, evt),
		onRelationshipClick: (rel, hitTargets, evt) => {
			const r = graph.rels.get(rel.id);
			const n1 = graph.nodes.get(r.startId);
			const n2 = graph.nodes.get(r.endId);
			setItem([r, n1, n2]);
		},
		// onRelationshipDoubleClick: (rel, hitTargets, evt) =>
		//   console.log('onRelationshipDoubleClick', rel, hitTargets, evt),
		onCanvasClick: (evt) => setItem(null),
		// onCanvasDoubleClick: (evt) => console.log('onCanvasDoubleClick', evt),
		// onCanvasRightClick: (evt) => console.log('onCanvasRightClick', evt),
		onDrag: (nodes) => console.log('onDrag', nodes),
		onPan: (evt) => {},
		onZoom: (zoomLevel) => console.log('onZoom', zoomLevel)
	}

	useEffect(() => {
		if (!graph || Object.keys(graph).length === 0) return;
		if (isMini) {
			setShowGraph(minimizeGraph(graph));
			console.log(minimizeGraph(graph));
		} else {
			setShowGraph(graphMapToList(graph));
		}
	}, [isMini, graph]);

	const queryResult = async (cypher, add = false) => {
		console.log(cypher);
		try {
			const res = await runQuery(cypher);
			console.log(res);
			if(add) {
				setGraph(expandGraph(graph, res));
			} else {
				setGraph(res);
			}
			console.log(graph)
		} catch (error) {
			console.error("Өгөгдлийн сантай харьцахад алдаа гарлаа:", error);
		}
		

	}


	// hamgiin ehend ymar 1 query unshuulchihsan jisheetai baih heregtei.
	useEffect(() => {
		const testQueries = [
			'MATCH (l:Хууль {дугаар: 8928})-[r1]->(z1:Зүйл) OPTIONAL MATCH (z1)-[r2]->(z2:Заалт) OPTIONAL MATCH (z2)-[r3]->(z3:Заалт) OPTIONAL MATCH (z3)-[r4]->(z4:Заалт) return l, r1, r2, r3, r4, z1, z2, z3, z4',
			'MATCH (l)-[r:АШИГЛАСАН]->(t:Томьёо {нэршил:"хэрэглэгч"}) WITH t, COUNT(l) AS l_count WHERE l_count > 2 MATCH (l)-[r:АШИГЛАСАН]->(t) RETURN l, r, t',
			'MATCH (n)-[r]-> (l:Хууль {дугаар: 8928}) return n, r, l',
			'MATCH path = allShortestPaths((startNode:Хууль {дугаар: 1})-[*]->(endNode:Хууль {дугаар: 8928})) RETURN path',
			'match p = (l:Хууль {дугаар: 8928})-[]-() return p'
		];
		queryResult(testQueries[3]);
		// const fetchData = async () => {
		// 	try {
		// 		const res = await runQuery(testQueries[3]);
		// 		console.log(res);
		// 		setGraph(res);
		// 	} catch (error) {
		// 		console.error("Өгөгдлийн сантай харьцахад алдаа гарлаа:", error);
		// 	}
		// };

		// fetchData();
	}, []);

	return (
		<div style={{ height: "100vh", width: "100vw" }}>
			<Controller
				isMini={isMini}
				setMini={setMini}
				runWithType={queryResult}
			/>
			{menuNode && <CustomMenu
				menu={menuNode}
				setMenu={setMenuNode}
				runQuery={queryResult}
			/>}
			{showGraph && <InteractiveNvlWrapper nodes={showGraph['nodes']} rels={showGraph['rels']} mouseEventCallbacks={mouseEventCallbacks} />}
			<Info
				activeItem={activeItem}
			/>
		</div>
	);
}

export default Legalinfo;