from datetime import datetime
from pytz import timezone
now = lambda: datetime.now(timezone('UTC')).isoformat()
url = lambda n: 'http://alfalfalfa.com/articles/{}.html'.format(n)
iso2utc = lambda iso: timezone('UTC').localize(pd.to_datetime(iso))
import time

import secure
from neo4jrestclient.client import GraphDatabase
url = secure.url
gdb = GraphDatabase(url)

import argparse
parser = argparse.ArgumentParser(description='tamakoo echo')
parser.add_argument('--dev','-d',default=False,
                    help=':Dev')
args = parser.parse_args()

def anchor(text, alias, note_id):
    if args.dev:
        note_id = gdb.query('''
            MATCH (a:Account),(b:Note) WHERE a.alias="%s" AND ID(b)=%s
            CREATE (a)-[:Toot {when:"%s"}]->
            (c:Note:Dev {text:"%s",when:"%s"})-[:Anchor {when:"%s"}]->(b)
            RETURN ID(c)
            '''%( alias, note_id, now(), text, now(), now() ), data_contents=True)[0][0]
    else:
        note_id = gdb.query('''
            MATCH (a:Account),(b:Note) WHERE a.alias="%s" AND ID(b)=%s
            CREATE (a)-[:Toot {when:"%s"}]->
            (c:Note:Prod {text:"%s",when:"%s"})-[:Anchor {when:"%s"}]->(b)
            RETURN ID(c)
            '''%( alias, note_id, now(), text, now(), now() ), data_contents=True)[0][0]
    return note_id

def toot(text, alias='tamako',access='public'):
    if args.dev:
        note_id = gdb.query('''
            MATCH (a:Account) WHERE a.alias="%s"
            CREATE (a)-[:Toot {when:"%s"}]->(b:Note:Dev {text:"%s",since:"%s",access:"%s"})
            RETURN ID(b)
            '''%(alias,now(),text,now(),access), data_contents=True)[0][0]
    else:
        note_id = gdb.query('''
            MATCH (a:Account) WHERE a.alias="%s"
            CREATE (a)-[:Toot {when:"%s"}]->(b:Note:Prod {text:"%s",since:"%s",access:"%s"})
            RETURN ID(b)
            '''%(alias,now(),text,now(),access), data_contents=True)[0][0]
    return note_id

if __name__ == '__main__':
    alias = input('alias>')
    alias = alias if alias else 'tamako'

    print('alias',alias)
    text = input('text>')
    while text:
        note_id = toot(text,alias) 
        print('{} toot {} at card.id={}'.format(alias, text, note_id)) 
        text = input('text>')
