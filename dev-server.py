#( -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, abort, make_response, send_from_directory, redirect
import os
import json
import string
import random
from random import randint
randstr = lambda n : ''.join([random.choice(string.ascii_letters + string.digits) for i in range(n)])
randcolor = lambda : '#'+str(random.randint(0,16777215))#ffffff

import secure
from neo4jrestclient.client import GraphDatabase
url = secure.url
gdb = GraphDatabase(url)

import numpy as np
import gensim
from gensim.models import doc2vec
from sklearn.metrics.pairwise import cosine_similarity
wakati = lambda sentence: gensim.utils.simple_preprocess(sentence, min_len=1)

from datetime import datetime

api = Flask(__name__, static_folder='dist')



@api.route('/', defaults={'path': ''})
@api.route('/<path:path>')
def index(path):
    return render_template('index.html')

@api.route('/dist/bundle.js')
def bundle():
    return open('dist/bundle.js', encoding='utf-8').read()

@api.route('/dist/bundle.js.map')
def bundle_map():
    return send_from_directory(os.path.join(api.root_path, 'dist'),'bundle.js.map')

@api.route('/tamakoo.png')
def face():
    return send_from_directory(os.path.join(api.root_path, 'dist'),'tamakoo.png')

@api.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(api.root_path, 'dist'),'favicon.ico')

@api.route('/api/addAcc/<string:state>', methods=['GET'])
def api_addAcc(state):
    state = json.loads(state)
    user_id = state['user_id']
    handle = state['handle']
    access = 'public'
    now = datetime.now().strftime('%Y%m%dT%H%M%S+0900')
    alias = randstr(randint(6,8))
    print(user_id, handle, now, alias, now, randcolor)
    gdb.query('\
        MATCH (a:User) WHERE ID(a)=%s\
        CREATE (a)-[:Have]->(:Account {handle:"%s",alias:"%s",since:"%s",color:"%s"})'\
        %( user_id, handle, alias, now, randcolor() ), data_contents=True)
    result = {
        'user': get_user(user_id)
        }
    return make_response(jsonify(result))

@api.route('/api/anchor/<string:state>', methods=['GET'])
def api_anchor(state):
    state = json.loads(state)
    account_id = state['account_id']
    card_id = state['card_id']
    toot_text = state['toot_text']
    now = datetime.now().strftime('%Y%m%dT%H%M%S+0900')
    gdb.query('\
        MATCH (a:Account),(b:Card) WHERE ID(a)=%s AND ID(b)=%s\
        CREATE (a)-[:Toot {when:"%s"}]->(:Card {text:"%s",when:"%s"})-[:Anchor {when:"%s"}]->(b)'\
        %( account_id, card_id, now, toot_text, now, now ), data_contents=True)
    result = {
        }
    return make_response(jsonify(result))

def get_account(account_id):
    line = gdb.query('\
        MATCH (a:Account) WHERE ID(a)={}\
        RETURN ID(a), a.alias, a.name, a.bio\
        '.format(account_id))[0]
    account =  {
        'id': line[0],
        'alias': line[1],
        'name': line[2],
        'bio': 'None' if line[3]==None else line[3],
    }
    return account

def get_hiscards(account_id,amount):
    lines = []
    for line in gdb.query('\
        MATCH p=(a)-[r:Toot]->(b) WHERE ID(a)={}\
        RETURN ID(a), a.name, r.when, ID(b), b.text, b.url LIMIT 200\
        '.format(account_id))[:amount]:
        lines.append({
            'account': {
                'id': line[0],
                'name': line[1],
            },
            'toot': {
                'when': line[2],
            },
            'card': {
                'id': line[3],
                'text': line[4],
                'url':'None' if line[5]==None else line[5],
            },
            'mode': 'called',
        })
    return lines

@api.route('/api/account/<string:state>', methods=['GET'])
def api_get_account(state):
    state = json.loads(state)
    account_id = state['account_id']
    amount = 0 if not 'amount' in state or state['amount'] < 0 or state['amount'] > 1000 else\
        state['amount']
    result = {
        'account': get_account(account_id),
        'cards': get_hiscards(account_id,amount)
    }
    print(result)
    return  make_response(jsonify(result))

def get_card(card_id):
    line = gdb.query('\
        MATCH p=(a)<-[t:Toot]-(c) WHERE ID(a)={}\
        RETURN ID(c), c.name, t.when, ID(a), a.text, a.url\
        '.format(card_id))[0]
    line = {
        'account': {
            'id': line[0],
            'name': line[1],
        },
        'toot': {
            'when': line[2],
        },
        'card': {
            'id': line[3],
            'text': line[4],
            'url':'None' if line[5]==None else line[5],
        },
        'mode': 'called',
    }
    return line

def wind_card(card_id, amount):
    cnt_cards = 0
    now_id = card_id

    now_line = get_card(card_id)
    cnt_cards+=1
    print(cnt_cards)

    pre_id = now_id
    pre_lines = []
    for i in range(100):
        try:
            line = gdb.query('\
                MATCH p=(a)-[r:Anchor]->(b)<-[t:Toot]-(c) WHERE ID(a)={}\
                RETURN ID(c), c.name, t.when, ID(b), b.text, b.url\
                '.format(pre_id))[0]
            pre_lines.append({
                'account': {
                    'id': line[0],
                    'name': line[1],
                },
                'toot': {
                    'when': line[2],
                },
                'card': {
                    'id': line[3],
                    'text': line[4],
                    'url':'None' if line[5]==None else line[5],
                },
                'mode':'winded',
            })
            pre_id = line[3]
            cnt_cards+=1
        except:
            break

    next_id = now_id
    next_lines = []
    for i in range(100):
        try:
            line = gdb.query('\
                MATCH p=(a)-[r:Anchor]->(b)<-[t:Toot]-(c) WHERE ID(a)={}\
                RETURN ID(c), c.name, t.when, ID(b), b.text, b.url\
                '.format(next_id))[0]
            next_lines.append({
                'account': {
                    'id': line[0],
                    'name': line[1],
                },
                'toot': {
                    'when': line[2],
                },
                'card': {
                    'id': line[3],
                    'text': line[4],
                    'url':'None' if line[5]==None else line[5],
                },
                'mode':'winded',
            })
            next_id = line[3]
            cnt_cards+=1
            print(cnt_cards)
        except:
            break

    lines = pre_lines[::-1] + [now_line] + next_lines
    return lines

@api.route('/api/callCard/<string:state>', methods=['GET'])
def api_callCard(state):
    print(state)
    state = json.loads(state)
    card_id = state['card_id']
    amount = 100 if not 'amount' in state or state['amount'] < 0 or state['amount'] > 1000 else\
        state['amount']

    cards = wind_card(card_id, amount)
    if len(cards) < amount:
        cards+=draw_card(card_id, amount-len(cards))

    result = {
        'cards': cards
        }
    print(result)
    return make_response(jsonify(result))

@api.route('/api/entry/<string:state>', methods=['GET'])
def api_entry(state):
    state = json.loads(state)
    print(state)
    account_id = state['account_id']
    user_id = gdb.query('\
        MATCH (a:Account)<-[:Have]-(b:User) WHERE ID(a)={} RETURN ID(b)\
        '.format(account_id))[0][0]
    result = {
        'user': get_user(user_id),
    }
    return  make_response(jsonify(result))

def get_user(user_id):
    line =  gdb.query('\
        MATCH (a:User) WHERE ID(a)={}\
        RETURN ID(a), a.mailaddr, a.givenname, a.familyname, a.birthday, a.gender, a.since'\
        .format(user_id))[0]
    user = {
        'id': line[0],
        'mailaddr': line[1],
        'givenname': line[2],
        'familyname': line[3],
        'birthday': line[4],
        'gender': line[5],
        'since': line[6],
    }

    has_accounts = []
    for line in gdb.query('\
            MATCH (a:Account)<-[:Have]-(b:User) WHERE ID(b)={}\
            RETURN ID(a), a.alias, a.handle, a.bio, a.since, a.access\
            '.format(user_id)):
        account =  {
            'id': line[0],
            'alias': line[1],
            'handle': line[2],
            'bio': 'None' if line[3]==None else line[3],
            'since': line[4],
            'access': line[5],
        }
        has_accounts.append(account)
    user['hasAcc'] = has_accounts
    return user

@api.route('/api/user/<int:user_id>', methods=['GET'])
def api_get_user(user_id):
    result = {
        'user': get_user(user_id)
    }
    return make_response(jsonify(result))


@api.route('/api/login/<string:mailaddr>', methods=['GET'])
def api_login(mailaddr):
    import smtplib
    from email.mime.text import MIMEText

    try:
        user_id = gdb.query('\
            MATCH (a:User) WHERE a.mailaddr="%s" RETURN ID(a)'\
            %(mailaddr), data_contents=True)[0]
        user = get_user(user_id)

        url = 'tamakoo.com/entry/{}'.format(user['hasAcc'][0]['id'])

    except:
        url = 'tamakoo.com/signup/'+mailaddr

    jp='iso-2022-jp'
    fromaddr = 'ytro@tamakoo.com'
    toaddr = mailaddr
    subject = 'hello from tamakoo.com'

    body = 'Click {} to entry tamakoo.com'.format(url)
    msg = MIMEText(body.encode(jp), 'plain', jp,)
    msg['Subject'] = subject
    msg['From'] = fromaddr
    msg['To'] = toaddr

    try:
        mail = smtplib.SMTP('localhost')
        mail.send_message(msg)
        print('Successfully sent email to '+mailaddr)
    except Exception:
        print('Error: unable to send email to '+mailaddr)

    result = {
        'mailaddr': mailaddr
    }
    return  make_response(jsonify(result))

@api.route('/api/signup/<string:user>', methods=['POST'])^M
def api_signup(user):^M
    user = json.loads(user)^M
    now = datetime.now().strftime('%Y%m%dT%H%M%S+0900')^M
    access = 'public'^M
    user_id = gdb.query('\^M
        CREATE (a:User {mailaddr:"%s",givenname:"%s",familyname:"%s",birthday:"%s",gender:"%s",since:"%s"})\^M
        RETURN ID(a)'\^M
        %(user['mailaddr'], user['givenname'], user['familyname'], user['birthday'], user['gender'], now), data_    contents=True)[0][0]^M
    alias = randstr(randint(6,8))^M
^M
    gdb.query('\^M
        MATCH (a:User) WHERE ID(a)=%s\^M
        CREATE (a)-[:Have]->(:Account {handle:"%s", alias:"%s", since:"%s", access:"%s"})'\^M
        %(user_id, user['hasAcc'][0]['handle'], alias, now, access), data_contents=True)^M
^M
    result = {
        user: {
            'id': user_id,
            'alias': alias,
            'handle': user['hasAcc'][0]['handle'],
            },
        }^M
    return make_response(jsonify(result))^M

def draw_card(text, amount):
    vec = model.infer_vector(wakati(text))
    sims = cosine_similarity([vec], doc_vecs)
    index = np.argsort(sims[0])[::-1]
    lines = []
    for i in range(amount):
        line = doc[index[i]][:-1].split('\t')
        line = {
            'account': {
                'id': line[0],
                'name': line[1],
            },
            'toot': {
                'when': line[2],
            },
            'card': {
                'id': line[3],
                'text': line[4],
                'url': line[5],
            },
            'mode': 'drawn',
        }
        lines.append(line)
    return lines

@api.route('/api/echo/<string:state>', methods=['GET'])
def api_echo(state):
    state = json.loads(state)

    account_id = state['account_id']
    toot_text = state['toot_text']
    amount = 100 if not 'amount' in state or state['amount'] < 0 or state['amount'] > 1000 else\
        state['amount']

    now = datetime.now().strftime('%Y%m%dT%H%M%S+0900')
    access = 'public'
    since = now
    gdb.query('\
        MATCH (a:Account) WHERE ID(a)=%s\
        CREATE (a)-[:Toot {when:"%s"}]->(:Card {text:"%s",since:"%s",access:"%s"})'\
        %(account_id,now,toot_text,since,access), data_contents=True)

    result = {
        'cards': draw_card(toot_text, amount)
        }
    print(result)
    return make_response(jsonify(result))

@api.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    model_name = 'echo_models/tamakoo.running.doc2vec.model'
    toots_fname = 'dump_toots/tamakoo.running.dump.tsv'
    
    model = gensim.models.Doc2Vec.load(model_name)
    doc = open(toots_fname, encoding='utf-8').readlines()
    doc_vecs = [ model.infer_vector(wakati(line.split('\t')[4])) for line in doc ]

    api.run(host='0.0.0.0', port=3000)
