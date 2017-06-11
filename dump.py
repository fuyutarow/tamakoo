from neo4jrestclient.client import GraphDatabase
import secure
url = secure.url
gdb = GraphDatabase(url)

from datetime import datetime

now = datetime.now().strftime("%Y%m%dT%H%M%S")
fname = '/home/tamakoo/dump/tamakoo.'+now+'.dump.csv'
f= open(fname,'w')
results = gdb.query('\
    MATCH p=(a)-[r:Toot]->(b) RETURN\
    ID(a) as user_id, a.name as user_name, r.when as toot_when,\
    ID(b) as card_id, b.text as card_text, b.url as card_url\
    ')
for result in results:
    result = [ str(e) for e in result]
    line = ','.join(result)+'\n'
    f.write(line)
