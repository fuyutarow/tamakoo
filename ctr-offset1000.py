import os
from neo4jrestclient.client import GraphDatabase
import secure

url = secure.url
gdb = GraphDatabase(url)

from datetime import datetime

for i in range(1000):
    now = datetime.now().strftime("%Y%m%dT%H%M%S+0900")
    gdb.query('\
        CREATE (a:Space {since:"%s"})'\
        %(now), data_contents=True)
