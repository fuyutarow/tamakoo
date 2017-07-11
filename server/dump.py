import os
import csv
import random
from neo4jrestclient.client import GraphDatabase
import secure
url = secure.url
gdb = GraphDatabase(url)

from datetime import datetime
from pytz import timezone
now = lambda: datetime.now(timezone('UTC')).isoformat()
url = lambda n: 'http://alfalfalfa.com/articles/{}.html'.format(n)
iso2utc = lambda iso: timezone('UTC').localize(pd.to_datetime(iso))

def docs():
    is_only_running =\
        True if random.randint(0,20) else\
        False

    header = ['note_id','note_text']
    lines = gdb.query('''
        MATCH (a:Note) RETURN 
        ID(a), a.text
        ''')

    current_dir = os.path.dirname(os.path.abspath(__file__))
    running_fname = os.path.join(current_dir, '../docs/tamakoo.running.dump.csv')
    with open(running_fname,'w', encoding='utf-8') as f:
        writer = csv.writer(f, lineterminator='\n')
        writer.writerow(header)
        writer.writerows(lines)
    print('dump {} at {}'.format(running_fname,now()))

    if is_only_running:
        return

    chkpoint_fname = os.path.join(current_dir, '../docs/tamakoo.{}.dump.csv'.format(now()))
    cf = open(chkpoint_fname,'w')
    with open(chkpoint_fname,'w', encoding='utf-8') as f:
        writer = csv.writer(f, lineterminator='\n')
        writer.writerow(header)
        writer.writerows(lines)
    print('dump {} at {}'.format(chkpoint_fname,now()))

def dump_csv():
    is_only_running =\
        True if random.randint(0,20) else\
        False

    now = datetime.now().strftime("%Y%m%dT%H%M%S+0900")

    header = ['account_id','account_alias','toot_when','card_id','card_text','card_url','card_since','card_access','card_imgs']
    lines = gdb.query('''
MATCH p=(a:Account)-[r:Toot]->(b) RETURN
ID(a) as account_id, a.alias as account_alias, r.when as toot_when,
ID(b) as card_id, b.text as card_text, b.url as card_url, b.since as card_since, b.access as card_access, b.imgs as card_imgs
''')
    lines = [ 
        line[:-1]+[''] if not line[-1] else line[:-1]+['\t'.join(line[-1])] \
        for line in lines ] 

    current_dir = os.path.dirname(os.path.abspath(__file__))
    running_fname = os.path.join(current_dir, 'dump_toots/tamakoo.running.dump.csv')
    with open(running_fname,'w', encoding='utf-8') as f:
        writer = csv.writer(f, lineterminator='\n')
        writer.writerow(header)
        writer.writerows(lines)
    print('dump {} at {}'.format(running_fname,now))

    if is_only_running:
        return

    chkpoint_fname = '/home/tamakoo/dump_toots/tamakoo.{}.dump.csv'.format(now)
    cf = open(chkpoint_fname,'w')
    with open(chkpoint_fname,'w', encoding='utf-8') as f:
        writer = csv.writer(f, lineterminator='\n')
        writer.writerow(header)
        writer.writerows(lines)
    print('dump {} at {}'.format(chkpoint_fname,now))

def json():
    is_only_running =\
        True if random.randint(0,20) else\
        False

    now = datetime.now().strftime("%Y%m%dT%H%M%S+0900")

    start = time.time()
    print('start')

    header = ['account_id','account_alias','toot_when','card_id','card_text','card_url','card_since','card_access','card_imgs']
    lines = gdb.query('''
        MATCH p=(account:Account)-[toot:Toot]->(card:Card) RETURN {
            account: {
                id: ID(account),
                alias: account.alias
            },
            toot: {
                when: toot.when
            },
            card: {
                id: ID(card),
                text: card.text,
                url: card.url,
                since: card.since,
                access: card.access,
                imgs: card.imgs
            }
        }''')
    chk = time.time()
    print('load finish',chk-start)

    current_dir = os.path.dirname(os.path.abspath(__file__))
    running_fname = os.path.join(current_dir, 'dump_toots/tamakoo.running.dump.json')
    with open(running_fname,'w', encoding='utf-8') as f:
        for line in lines:
            j = json.dumps(line)
            print(j,file=f)
    print('dump finish',time.time()-chk)
    print('dump {} at {}'.format(running_fname,now))

    if is_only_running:
        return

    chkpoint_fname = '/home/tamakoo/dump_toots/tamakoo.{}.dump.json'.format(now)
    cf = open(chkpoint_fname,'w')
    with open(chkpoint_fname,'w', encoding='utf-8') as f:
        for line in lines:
            j = json.dumps(line)
            print(j,file=f)
    print('dump {} at {}'.format(chkpoint_fname,now))

if __name__ == '__main__':
    docs()
