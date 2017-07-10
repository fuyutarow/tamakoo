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

def main():
    is_only_running =\
        True if random.randint(0,20) else\
        False
    
    now = now()

    header = ['card_id','card_text']
    lines = gdb.query('''
MATCH (a:Card) RETURN 
ID(a), a.text
''')

    current_dir = os.path.dirname(os.path.abspath(__file__))
    running_fname = os.path.join(current_dir, 'docs/tamakoo.running.dump.csv')
    with open(running_fname,'w', encoding='utf-8') as f:
        writer = csv.writer(f, lineterminator='\n')
        writer.writerow(header)
        writer.writerows(lines)
    print('dump {} at {}'.format(running_fname,now))

    if is_only_running:
        return

    chkpoint_fname = os.path.join(current_dir, 'docs/tamakoo.{}.dump.csv'.format(now))
    cf = open(chkpoint_fname,'w')
    with open(chkpoint_fname,'w', encoding='utf-8') as f:
        writer = csv.writer(f, lineterminator='\n')
        writer.writerow(header)
        writer.writerows(lines)
    print('dump {} at {}'.format(chkpoint_fname,now))

if __name__ == '__main__':
    main()
