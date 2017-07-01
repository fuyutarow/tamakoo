import os
from neo4jrestclient.client import GraphDatabase
import secure
url = secure.url
gdb = GraphDatabase(url)

from datetime import datetime

def main():
    now = datetime.now().strftime("%Y%m%dT%H%M%S+0900")
    #chkpoint_fname = '/home/tamakoo/dump_toots/tamakoo.{}.dump.tsv'.format(now)
    #cf = open(chkpoint_fname,'w')
    current_dir = os.path.dirname(os.path.abspath(__file__))
    running_fname = os.path.join(current_dir, 'dump_toots/tamakoo.running.dump.tsv')
    rf = open(running_fname,'w', encoding='utf-8')
    results = gdb.query('\
        MATCH p=(a:Account)-[r:Toot]->(b) RETURN\
        ID(a) as account_id, a.name as account_name, r.when as toot_when,\
        ID(b) as card_id, b.text as card_text, b.url as card_url\
        ')
    for result in results:
        result = [ str(e) for e in result]
        line = '\t'.join(result)+'\n'
        #cf.write(line)
        rf.write(line)
    print('dump {} at {}'.format(running_fname,now))

if __name__ == '__main__':
    main()
