const sentenceQuery = [
	{
		"sentence": "{{num}} дугаартай хуулийн {{numbering}}-г харуул",
		"query": "MATCH (n { хууль: {{num}} , дугаар: '{{numbering}}' }) WHERE n:Зүйл OR n:Заалт RETURN n"
	},
	{
		"sentence": "{{name}} хуулийн {{numbering}}-г харуул",
		"query": "MATCH (l:Хууль {нэр: '{{name}} хууль'}) with l.дугаар AS lawNo match (z {хууль: lawNo, дугаар:'{{numbering}}' }) where z:Заалт or z:Зүйл return z"
	},
	{
		"sentence": "{{num}} дугаартай хуулийг дурдсан хуулиудыг харуул",
		"query": "MATCH (z)-[r]->(n:Хууль {дугаар: {{num}} }) WITH z, z.хууль AS relatedLaw, collect(r) as rels, n MATCH p = shortestPath((n1:Хууль {дугаар: relatedLaw})-[*]->(z)) RETURN z, n1, p, rels, n"
	},
	{
		"sentence": "{{name}} хуулийг дурдсан хуулиудыг харуул",
		"query": "MATCH (z)-[r]->(n:Хууль {нэр: '{{name}} хууль' }) WITH z, z.хууль AS relatedLaw, collect(r) as rels, n MATCH p = shortestPath((n1:Хууль {дугаар: relatedLaw})-[*]->(z)) RETURN z, n1, p, rels, n"
	},
	{
		"sentence": "{{name}}... хуулийг дурдсан хуулиудыг харуул",
		"query": "MATCH (z)-[r]->(n:Хууль ) WHERE n.нэр STARTS WITH '{{name}}' WITH z, z.хууль AS relatedLaw, collect(r) as rels, n MATCH p = shortestPath((n1:Хууль {дугаар: relatedLaw})-[*]->(z)) RETURN z, n1, p, rels, n"
	},
	{
		"sentence": "{{num}} дугаартай хуулийг бүхэлд нь харуул",
		"query": "MATCH (l:Хууль {дугаар: {{num}} })-[r1]->(z1:Зүйл) OPTIONAL MATCH (z1)-[r2:БАГТААСАН*1..5]->(z2:Заалт) RETURN l, r1, z1, collect(z2) AS nodes, collect(r2) AS relationships"
	},
	{
		"sentence": "{{name}} хуулийг бүхэлд нь харуул",
		"query": "MATCH (l:Хууль {нэр: '{{name}} хууль' })-[r1]->(z1:Зүйл) OPTIONAL MATCH (z1)-[r2:БАГТААСАН*1..5]->(z2:Заалт) RETURN l, r1, z1, collect(z2) AS nodes, collect(r2) AS relationships"
	},
	{
		"sentence": "{{name}}-",
		"query": "MATCH (l:Хууль )-[r1]->(z1:Зүйл) WHERE l.нэр STARTS WITH '{{name}}' OPTIONAL MATCH (z1)-[r2:БАГТААСАН*1..5]->(z2:Заалт) RETURN l, r1, z1, collect(z2) AS nodes, collect(r2) AS relationships"
	},
	{
		"sentence": "{{num}} дугаартай хуулийг харуул",
		"query": "MATCH (l:Хууль {дугаар: {{num}} }) RETURN l"
	},
	{
		"sentence": "{{name}} хуулийг харуул",
		"query": "MATCH (l:Хууль {нэр: '{{name}} хууль' }) RETURN l"
	},
	{
		"sentence": "{{num1}} болон {{num2}} дугаартай хуулиудын холбоог харуул",
		"query": "MATCH path = shortestPath((startNode:Хууль {дугаар: {{num1}} })-[*]->(endNode:Хууль {дугаар: {{num2}} })) RETURN path"
	},
	{
		"sentence": "олон тодорхойлогдсон нэр томьёог харуул",
		"query": "MATCH (l)-[r]->(n:Томьёо) WITH n, collect(DISTINCT l) AS lNodes, count(DISTINCT l) AS distinctLCount, collect(r) as rels WHERE distinctLCount > 1 RETURN n, lNodes, rels"
	},
	{
		"sentence": "{{term}} нэр томьёог хэрхэн ашигласан бэ",
		"query": "MATCH (l)-[r]->(n:Томьёо {нэршил: '{{term}}' }) RETURN l, r, n"
	},
]



export const sentenceToCypher = (str) => {
	if(typeof str !== 'string') return '';
	let inputSentence = str.trim().toLowerCase();
	if(inputSentence.includes('match')) return str;

    for (let item of sentenceQuery) {
        const matches = inputSentence.match(new RegExp(item.sentence.replace(/{{\w+}}/g, '(.*?)')));
        if (matches) {
			console.log(matches);
            const extractedValues = {};
            const placeholderMatches = item.sentence.match(/{{(\w+)}}/g);

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







