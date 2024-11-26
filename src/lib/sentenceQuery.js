export const sentenceQuery = [
	{
		"sentence": "{{хуулийн дугаар}} дугаартай хуулийн {{зүйл, заалтын дугаар}}-г харуул",
		"query": "MATCH (n { хууль: {{хуулийн дугаар}} , дугаар: '{{зүйл, заалтын дугаар}}.' }) WHERE n:Зүйл OR n:Заалт RETURN n"
	},
	{
		"sentence": "{{хуулийн нэр}} хуулийн {{зүйл, заалтын дугаар}}-г харуул",
		"query": "MATCH (l:Хууль {нэр: '{{хуулийн нэр}} хууль'}) with l.дугаар AS lawNo match (z {хууль: lawNo, дугаар:'{{зүйл, заалтын дугаар}}.' }) where z:Заалт or z:Зүйл return z"
	},
	{
		"sentence": "{{хуулийн дугаар}} дугаартай хуулийг дурдсан хуулиудыг харуул",
		"query": "MATCH (z)-[r]->(n:Хууль {дугаар: {{хуулийн дугаар}} }) WITH z, z.хууль AS relatedLaw, collect(r) as rels, n MATCH p = shortestPath((n1:Хууль {дугаар: relatedLaw})-[*]->(z)) RETURN z, n1, p, rels, n"
	},
	{
		"sentence": "{{хуулийн нэр}} хуулийг дурдсан хуулиудыг харуул",
		"query": "MATCH (z)-[r]->(n:Хууль {нэр: '{{хуулийн нэр}} хууль' }) WITH z, z.хууль AS relatedLaw, collect(r) as rels, n MATCH p = shortestPath((n1:Хууль {дугаар: relatedLaw})-[*]->(z)) RETURN z, n1, p, rels, n"
	},
	{
		"sentence": "{{хуулийн нэр}}... хуулийг дурдсан хуулиудыг харуул",
		"query": "MATCH (z)-[r]->(n:Хууль ) WHERE n.нэр STARTS WITH '{{хуулийн нэр}}' WITH z, z.хууль AS relatedLaw, collect(r) as rels, n MATCH p = shortestPath((n1:Хууль {дугаар: relatedLaw})-[*]->(z)) RETURN z, n1, p, rels, n"
	},
	{
		"sentence": "{{хуулийн дугаар}} дугаартай хуулийг бүхэлд нь харуул",
		"query": "MATCH (l:Хууль {дугаар: {{хуулийн дугаар}} })-[r1]->(z1:Зүйл) OPTIONAL MATCH (z1)-[r2:БАГТААСАН*1..5]->(z2:Заалт) RETURN l, r1, z1, collect(z2) AS nodes, collect(r2) AS relationships"
	},
	{
		"sentence": "{{хуулийн нэр}} хуулийг бүхэлд нь харуул",
		"query": "MATCH (l:Хууль {нэр: '{{хуулийн нэр}} хууль' })-[r1]->(z1:Зүйл) OPTIONAL MATCH (z1)-[r2:БАГТААСАН*1..5]->(z2:Заалт) RETURN l, r1, z1, collect(z2) AS nodes, collect(r2) AS relationships"
	},
	{
		"sentence": "{{хуулийн дугаар}} дугаартай хуулийн нэр",
		"query": "MATCH (l:Хууль {дугаар: {{хуулийн дугаар}} }) RETURN l"
	},
	{
		"sentence": "{{хуулийн нэр}} хуулийг харуул",
		"query": "MATCH (l:Хууль {нэр: '{{хуулийн нэр}} хууль' }) RETURN l"
	},
	{
		"sentence": "{{хуулийн дугаар1}} болон {{хуулийн дугаар2}} дугаартай хуулиудын холбоог харуул",
		"query": "MATCH path = shortestPath((startNode:Хууль {дугаар: {{хуулийн дугаар1}} })-[*]->(endNode:Хууль {дугаар: {{хуулийн дугаар2}} })) RETURN path"
	},
	{
		"sentence": "олон тодорхойлогдсон нэр томьёог харуул",
		"query": "MATCH (l)-[r]->(n:Томьёо) WITH n, collect(DISTINCT l) AS lNodes, count(DISTINCT l) AS distinctLCount, collect(r) as rels WHERE distinctLCount > 1 RETURN n, lNodes, rels"
	},
	{
		"sentence": "{{нэр томьёо}} нэр томьёог хэрхэн ашигласан бэ",
		"query": "MATCH (l)-[r]->(n:Томьёо {нэршил: '{{нэр томьёо}}' }) RETURN l, r, n"
	},
]



export const sentenceToCypher = (str) => {
	if(typeof str !== 'string') return '';
	let inputSentence = str.trim().toLowerCase();
	if(inputSentence.includes('match')) return str;

    for (let item of sentenceQuery) {
		console.log(item.sentence.replace(/{{[\s\S]+?}}/g, '(.*?)'))
        const matches = inputSentence.match(new RegExp(item.sentence.replace(/{{[\s\S]+?}}/g, '(.*?)')));
        if (matches) {
            const extractedValues = {};
            const placeholderMatches = item.sentence.match(/{{([\s\S]+?)}}/g);

            if (placeholderMatches) {
                placeholderMatches.forEach((placeholder, index) => {
                    const key = placeholder.replace(/[{{}}]/g, ''); 
                    extractedValues[key] = matches[index + 1];
					console.log(matches[index+1])
                });
            }

            let generatedQuery = item.query;
            Object.keys(extractedValues).forEach(key => {
                generatedQuery = generatedQuery.replace(`{{${key}}}`, extractedValues[key]);
            });

            return generatedQuery;
        }
    }

    return inputSentence;
}







