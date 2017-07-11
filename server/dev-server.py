# -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, abort, make_response, send_from_directory, redirect
import os
import json
import pandas as pd
import string
from concurrent.futures import ThreadPoolExecutor, as_completed
import random
from random import randint
randstr = lambda n : ''.join([random.choice(string.ascii_letters + string.digits) for i in range(n)])
randcolor = lambda : '#'+str(random.randint(0,16777215))#ffffff

from datetime import datetime
from pytz import timezone
now = lambda: datetime.now(timezone('UTC')).isoformat()
url = lambda n: 'http://alfalfalfa.com/articles/{}.html'.format(n)
iso2utc = lambda iso: timezone('UTC').localize(pd.to_datetime(iso))

import secure
from neo4jrestclient.client import GraphDatabase
url = secure.url
gdb = GraphDatabase(url)

import numpy as np
import gensim
from gensim.models import doc2vec
from sklearn.metrics.pairwise import cosine_similarity

wakati = lambda sentence: gensim.utils.simple_preprocess(sentence, min_len=1)
print('without mecab')

from datetime import datetime

import get
import toot
import echo
import dump

api = Flask(__name__, static_folder='../dist')
import jinja2
my_loader = jinja2.ChoiceLoader([
    api.jinja_loader,
    jinja2.FileSystemLoader(os.path.join(api.root_path, '../dist')),
])
api.jinja_loader = my_loader

@api.route('/', defaults={'path': ''})
@api.route('/<path:path>')
def index(path):
    return render_template('index.html')

@api.route('/dist/bundle.js')
def bundle():
    return open('dist/bundle.js', encoding='utf-8').read()

@api.route('/dist/bundle.js.map')
def bundle_map():
    return send_from_directory(os.path.join(api.root_path, '../dist'),'bundle.js.map')

@api.route('/tamakoo.png')
def face():
    return send_from_directory(os.path.join(api.root_path, '../dist'),'tamakoo.png')

@api.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(api.root_path, '../dist'),'favicon.ico')

@api.route('/api/addAcc/<string:state>', methods=['GET'])
def api_addAcc(state):
    state = json.loads(state)
    user_id = state['user_id']
    handle = state['handle']
    access = 'public'
    now = datetime.now().strftime('%Y%m%dT%H%M%S+0900')
    alias = randstr(randint(6,8))
    gdb.query('\
        MATCH (a:User) WHERE ID(a)=%s\
        CREATE (a)-[:Have]->(:Account {handle:"%s",alias:"%s",since:"%s",color:"%s"})'\
        %( user_id, handle, alias, now, randcolor() ), data_contents=True)
    result = {
        'user': get.user(user_id)
        }
    return make_response(jsonify(result))

@api.route('/api/anchor/<string:state>', methods=['GET'])
def api_anchor(state):
    state = json.loads(state)
    account_alias = state['account_alias']
    note_id = state['note_id']
    note_text = state['note_text']
    note_id = toot.anchor(note_text, account_alias, note_id) 
    card = get.get_card(note_id) 
    card['mode'] = 'tooted'
    result = {
        'card': card 
        }
    return make_response(jsonify(result))

@api.route('/api/account/<string:account_alias>', methods=['GET'])
def api_get_account(account_alias):
    result = {
        'account': get.account(account_alias),
    }
    return  make_response(jsonify(result))

@api.route('/api/account/<string:account_alias>/amount/<int:amount>', methods=['GET'])
def api_get_toot(account_alias,amount):
    amount = 0 if amount < 0 or amount > 1000 else amount
    result = {
        'account': get.account(account_alias),
        'cards': get.hiscards(account_alias,amount)
    }
    return  make_response(jsonify(result))

@api.route('/api/card/<int:note_id>', methods=['GET'])
def api_get_card(note_id):
    card = get.get_card(note_id)
    card['mode'] = 'called'
    result = {
        'card': card 
        }
    return make_response(jsonify(result))

@api.route('/api/card/<int:note_id>/amount/<int:amount>', methods=['GET'])
def api_call_card(note_id,amount):
    amount = 100 if not amount or amount < 0 or amount > 1000 else amount
    cards = get.wind_card(note_id, amount)
    if len(cards) < amount:
        text = get.get_card(note_id)['note']['text']
        cards += echo.echo(text, model, notes, text_vecs, amount-len(cards))
    result = {
        'cards': cards
        }
    return make_response(jsonify(result))

@api.route('/api/entry/<string:alias>', methods=['GET'])
def api_entry(alias):
    user_id = gdb.query('\
        MATCH (a:Account)<-[:Have]-(b:User) WHERE a.alias="%s" RETURN ID(b)\
        '%(alias))[0][0]
    result = {
        'user': get.user(user_id),
    }
    return  make_response(jsonify(result))

@api.route('/api/user/<int:user_id>', methods=['GET'])
def api_get_user(user_id):
    result = {
        'user': get.user(user_id)
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
        user = get.user(user_id)
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

@api.route('/api/signup/<string:user>', methods=['GET'])
def api_signup(user):
    user = json.loads(user)
    handle = user['hasAcc'][0]['handle']
    now = datetime.now().strftime('%Y%m%dT%H%M%S+0900')
    access = 'public'
    user_id = gdb.query('\
        CREATE (a:User {mailaddr:"%s",givenname:"%s",familyname:"%s",birthday:"%s",gender:"%s",since:"%s"})\
        RETURN ID(a)'\
        %(user['mailaddr'], user['givenname'], user['familyname'], user['birthday'], user['gender'], now), data_contents=True)[0][0]
    alias = randstr(randint(6,8))

    gdb.query('\
        MATCH (a:User) WHERE ID(a)=%s\
        CREATE (a)-[:Have]->(:Account {handle:"%s", alias:"%s", since:"%s", access:"%s"})'\
        %(user_id, user['hasAcc'][0]['handle'], alias, now, access), data_contents=True)

    result = {
        'user': {
            'id': user_id,
            'alias': alias,
            'handle': handle,
            },
        }
    return make_response(jsonify(result))

@api.route('/api/echo/<string:state>', methods=['GET'])
def api_echo(state):
    state = json.loads(state)
    account_alias = state['account_alias']
    note_text = state['note_text']
    amount = 100 if not 'amount' in state or state['amount'] < 0 or state['amount'] > 1000 else\
        state['amount']

    access = 'public'
    note_id = toot.toot(note_text, account_alias, access)
    card = get.get_card(note_id)
    card['mode'] = 'tooted'

    result = {
        'cards': [card] + echo.echo(note_text, model, notes, text_vecs, amount)
        }
    return make_response(jsonify(result))

@api.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

def load_notes():
    global notes
    global text_vecs
    while True:
        df = pd.read_csv(notes_fname)
        df = df.reindex(np.random.permutation(df.index)).reset_index(drop=True)
        notes = df[:100]
        text_vecs = [ model.infer_vector(wakati(line)) for line in list(notes['card_text']) ]
        dump.docs()
        time.sleep(100)

if __name__ == '__main__':
    model_name = os.path.join(api.root_path, '../echo_models/tamakoo.running.doc2vec.model')
    notes_fname  = os.path.join(api.root_path, '../docs/tamakoo.test.dump.csv')

    model = gensim.models.Doc2Vec.load(model_name)
    df = pd.read_csv(notes_fname)
    df = df.reindex(np.random.permutation(df.index)).reset_index(drop=True)
    notes = df[:100]
    text_vecs = [ model.infer_vector(wakati(line)) for line in list(notes['note_text']) ]

    pool = ThreadPoolExecutor(4)
    pool.submit(load_notes)

    api.run(host='0.0.0.0', port=3000)
