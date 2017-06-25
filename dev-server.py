# -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, abort, make_response, send_from_directory, redirect
import os
import json

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
    return send_from_directory(os.path.join(api.root_path, 'assets'),'tamakoo.png')

@api.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(api.root_path, 'assets'),'favicon.ico')

@api.route('/api/anchor/<string:anchor_text>', methods=['GET'])
def api_anchor(anchor_text):
    user_id = 10
    card_id, toot_text = anchor_text.split('\t')
    now = datetime.now().strftime('%Y%m%dT%H%M%S+0900')
    gdb.query('\
        MATCH (a:User),(b:Card) WHERE ID(a)=%s AND ID(b)=%s\
        CREATE (a)-[:Toot {when:"%s"}]->(:Card {text:"%s",when:"%s"})-[:Anchor {when:"%s"}]->(b)'\
        %( user_id, card_id, now, toot_text, now, now ), data_contents=True)
    result = {
        'text': 'toot complete'
        }
    return make_response(jsonify(result))

@api.route('/api/askAccount/<int:account_id>', methods=['GET'])
def api_askAccount(account_id):
    line = gdb.query('\
        MATCH (a:User) WHERE ID(a)={}\
        RETURN ID(a), a.alias, a.name, a.bio\
        '.format(account_id))[0]
    account =  {
        'id': line[0],
        'alias': line[1],
        'name': line[2],
        'bio': 'None' if line[3]==None else line[3],
    }
    result = {
        'account': account
    }
    return  make_response(jsonify(result))

@api.route('/api/callCard/<int:card_id>', methods=['GET'])
def api_callCard(card_id):
    print(card_id)
    cnt_cards = 0
    now_id = card_id

    line = gdb.query('\
        MATCH p=(a)<-[t:Toot]-(c) WHERE ID(a)={}\
        RETURN ID(c), c.name, t.when, ID(a), a.text, a.url\
        '.format(now_id))[0]
    now_line = {
        'user_id':line[0],
        'user_name':line[1],
        'toot_when':line[2],
        'card_id':line[3],
        'text':line[4],
        'url':'None' if line[5]==None else line[5],
        'mode':'called',
    }
    cnt_cards+=1
    print(cnt_cards)

    pre_id = now_id
    pre_lines = []
    for i in range(50):
        try:
            line = gdb.query('\
                MATCH p=(a)-[r:Anchor]->(b)<-[t:Toot]-(c) WHERE ID(a)={}\
                RETURN ID(c), c.name, t.when, ID(b), b.text, b.url\
                '.format(pre_id))[0]
            pre_lines.append({
                'user_id':line[0],
                'user_name':line[1],
                'toot_when':line[2],
                'card_id':line[3],
                'text':line[4],
                'url':'None' if line[5]==None else line[5],
                'mode':'winded',
            })
            pre_id = line[3]
            cnt_cards+=1
        except:
            break

    next_id = now_id
    next_lines = []
    for i in range(50):
        try:
            line = gdb.query('\
                MATCH p=(a)-[r:Anchor]->(b)<-[t:Toot]-(c) WHERE ID(a)={}\
                RETURN ID(c), c.name, t.when, ID(b), b.text, b.url\
                '.format(next_id))[0]
            next_lines.append({
                'user_id':line[0],
                'user_name':line[1],
                'toot_when':line[2],
                'card_id':line[3],
                'text':line[4],
                'url':'None' if line[5]==None else line[5],
                'mode':'winded',
            })
            next_id = line[3]
            cnt_cards+=1
            print(cnt_cards)
        except:
            break

    drawn_lines = []
    if cnt_cards < 100:
        vec = model.infer_vector(wakati(toot_text))
        sims = cosine_similarity([vec], doc_vecs)
        index = np.argsort(sims[0])[::-1]
        while cnt_cards < 100:
            line = doc[index[i]][:-1].split('\t')
            drawn_lines.append({
                'user_id': line[0],
                'user_name': line[1],
                'toot_when': line[2],
                'card_id': line[3],
                'text': line[4],
                'url': line[5],
                'mode':'drawn'
            })
            cnt_cards+=1
            print(cnt_cards)

    lines = pre_lines[::-1] + [now_line] + next_lines + drawn_lines

    print(lines)
    result = {
        'cards': lines
        }
    return make_response(jsonify(result))

#@api.route('/entry/<int:account_id>', methods=['GET'])
#def api_entry(accout_id):


@api.route('/api/face/<int:account_id>', methods=['GET'])
def api_face(account_id):
    line = gdb.query('\
        MATCH (a:Account)<-[:Have]-(b:User) WHERE ID(a)={}\
        RETURN ID(a), a.alias, a.name, a.bio, ID(b)\
        '.format(account_id))[0]
    loginAccount =  {
        'id': line[0],
        'alias': line[1],
        'name': line[2],
        'bio': 'None' if line[3]==None else line[3],
    }
    user_id = line[4]
    has_accounts = []
    for line in gdb.query('\
            MATCH (a:Account)<-[:Have]-(b:User) WHERE ID(b)={}\
            RETURN ID(a), a.alias, a.name, a.bio\
            '.format(user_id)):
        account =  {
            'id': line[0],
            'alias': line[1],
            'name': line[2],
            'bio': 'None' if line[3]==None else line[3],
        }
        has_accounts.append(account)
    result = {
        'account': loginAccount,
        'hasAccounts': has_accounts
    }
    print(result)
    return  make_response(jsonify(result))

@api.route('/api/hisToot/<int:user_id>', methods=['GET'])
def api_hisToot(user_id):
    line = gdb.query('\
        MATCH (a:Account)<-[:Have]-(b:User) WHERE ID(a)={}\
        RETURN ID(a), a.alias, a.name, a.bio, ID(b)\
        '.format(user_id))[0]
    account =  {
        'id': line[0],
        'alias': line[1],
        'name': line[2],
        'bio': 'None' if line[3]==None else line[3],
    }
    cnt_cards = 0
    lines = []
    for line in gdb.query('\
        MATCH p=(a)-[r:Toot]->(b) WHERE ID(a)={}\
        RETURN ID(a), a.name, r.when, ID(b), b.text, b.url LIMIT 200\
        '.format(user_id)):
        lines.append({
            'user_id': line[0],
            'user_name': line[1],
            'toot_when': line[2],
            'card_id': line[3],
            'text': line[4],
            'url': line[5],
            'mode':'drawn'
        })
        cnt_cards+=1
        print(cnt_cards)

    if cnt_cards < 100:
        vec = model.infer_vector(wakati(toot_text))
        sims = cosine_similarity([vec], doc_vecs)
        index = np.argsort(sims[0])[::-1]
        i = 0
        while cnt_cards < 100:
            line = doc[index[i]][:-1].split('\t')
            drawn_lines.append({
                'user_id': line[0],
                'user_name': line[1],
                'toot_when': line[2],
                'card_id': line[3],
                'text': line[4],
                'url': line[5],
                'mode':'drawn'
            })
            i+=1
            cnt_cards+=1
            print(cnt_cards)

    result = {
        'account': account,
        'cards': lines
        }
    return make_response(jsonify(result))

@api.route('/api/mailentry/<string:mailaddr>', methods=['GET'])
def api_mailentry(mailaddr):
    import smtplib
    from email.mime.text import MIMEText

    jp='iso-2022-jp'
    fromaddr = 'ytro@tamakoo.com'
    toaddr = mailaddr
    subject = 'hello from tamakoo.com'

    resisted = [
        'sktnkysh@gmail.com',
        'sktnkysh+11@gmail.com',
        'sktnkysh+12@gmail.com',
        'sktnkysh+13@gmail.com',
    ]
    url = \
        'tamakoo.com/signup/'+mailaddr if( not mailaddr in resisted ) else\
        'tamakoo.com/entry/{}'.format(resisted.index(mailaddr))

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

@api.route('/api/toot/<string:state>', methods=['GET'])
def api_toot(state):
    state = json.loads(state)
    user_id = state['user_id']
    toot_text = state['toot_text']
    now = datetime.now().strftime('%Y%m%dT%H%M%S+0900')
    access = 'public'
    since = now
    gdb.query('\
        MATCH (a:User) WHERE ID(a)=%s\
        CREATE (a)-[:Toot {when:"%s"}]->(:Card {text:"%s",since:"%s",access:"%s"})'\
        %(user_id,now,toot_text,since,access), data_contents=True)

    vec = model.infer_vector(wakati(toot_text))
    sims = cosine_similarity([vec], doc_vecs)
    index = np.argsort(sims[0])[::-1]
    lines = []
    for i in range(20):
        line = doc[index[i]][:-1].split('\t')
        line = {
            'user_id': line[0],
            'user_name': line[1],
            'toot_when': line[2],
            'card_id': line[3],
            'text': line[4],
            'url': line[5],
            'mode':'drawn'
        }
        lines.append(line)
    result = {
        'cards': lines
        }
    return make_response(jsonify(result))

@api.route('/api/signup/<string:user>', methods=['GET'])
def api_signup(user):
    user = json.loads(user)
    now = datetime.now().strftime('%Y%m%dT%H%M%S+0900')
    access = 'public'
    print(user)
    gdb.query('\
        CREATE (a:User {mailaddr:"%s",givename:"%s",familyname:"%s",birthday:"%s",gender:"%s",since:"%s", access:"%s"})'\
        %(user['mailaddr'], user['givenname'], user['familyname'], user['birthday'], user['gender'], now, access), data_contents=True)
    result = {
        }
    return make_response(jsonify(result))

@api.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    model_name = 'echo_model/doc2vec.20170611T223642.model'
    toots_fname = 'dump/tamakoo.dump.running.tsv'

    model = gensim.models.Doc2Vec.load(model_name)
    doc = open(toots_fname, encoding='utf-8').readlines()
    doc_vecs = [ model.infer_vector(wakati(line.split('\t')[4])) for line in doc ]

    api.run(host='0.0.0.0', port=3000)
