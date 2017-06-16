# -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, abort, make_response

import secure
from neo4jrestclient.client import GraphDatabase
url = secure.url
gdb = GraphDatabase(url)

import numpy as np
import gensim
from gensim.models import doc2vec
from sklearn.metrics.pairwise import cosine_similarity
import MeCab
mecab = MeCab.Tagger('-Owakati -d /usr/local/lib/mecab/dic/mecab-ipadic-neologd/')
wakati = lambda sentence: gensim.utils.simple_preprocess(mecab.parse(sentence), min_len=1)

from datetime import datetime

api = Flask(__name__,  static_url_path='/dist')

@api.route('/')
def index():
    return open('index.html', encoding='utf-8').read()

@api.route('/dist/bundle.js')
def bundle():
    return open('dist/bundle.js', encoding='utf-8').read()

@api.route('/tamakoo.png')
def face():
    return send_from_directory(os.path.join(api.root_path, 'dist'),'tamakoo.png')

@api.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(api.root_path, 'dist'),'favicon.ico')

@api.route('/api/toot/<string:toot_text>', methods=['GET'])
def api_toot(toot_text):
    user_id = 46245
    now = datetime.now().strftime("%Y%m%dT%H%M%S+0900")
    gdb.query('\
        MATCH (a:User) WHERE ID(a)=%s\
        CREATE (a)-[:Toot {when:"%s"}]->(:Card {text:"%s"})'\
        %(user_id,now,toot_text), data_contents=True)

    vec = model.infer_vector(wakati(toot_text))
    sims = cosine_similarity([vec], doc_vecs)
    index = np.argsort(sims[0])[::-1]
    res_text = ''
    for i in range(100):
        res_text += ''.join([''.join(doc[index[i]].split(' '))]).split('\n')[0]+',normal\n'
    result = {
        'text': res_text
        }
    return make_response(jsonify(result))
    result = {
        'text': res_text
        }
    return make_response(jsonify(result))

@api.route('/api/anchor/<string:anchor_text>', methods=['GET'])
def api_anchor(anchor_text):
    user_id = 46245
    card_id, toot_text = anchor_text.split(',')
    now = datetime.now().strftime("%Y%m%dT%H%M%S+0900")
    gdb.query('\
        MATCH (a:User),(b:Card) WHERE ID(a)=%s AND ID(b)=%s\
        CREATE (a)-[:Toot {when:"%s"}]->(:Card {text:"%s",when:"%s"})-[:Anchor {when:"%s"}]->(b)'\
        %( user_id, card_id, now, toot_text, now, now ), data_contents=True)
    result = {
        'text': 'toot complete'
        }
    return make_response(jsonify(result))

@api.route('/api/callCard/<int:card_id>', methods=['GET'])
def api_callCard(card_id):
    now_id = card_id

    user_id, user_name, when, card_id, card_text, card_url = gdb.query('\
        MATCH p=(a)<-[t:Toot]-(c) WHERE ID(a)={}\
        RETURN ID(c), c.name, t.when, ID(a), a.text, a.url\
        '.format(now_id))[0]
    now_line = ','.join([str(user_id), user_name, when, str(card_id), card_text, 'None' if card_url==None else card_url, 'called'])

    pre_id = now_id
    pre_lines = []
    for i in range(100):
        try:
            user_id, user_name, when, pre_id, pre_text, pre_url = gdb.query('\
                MATCH p=(a)-[r:Anchor]->(b)<-[t:Toot]-(c) WHERE ID(a)={}\
                RETURN ID(c), c.name, t.when, ID(b), b.text, b.url\
                '.format(pre_id))[0]
            line = ','.join([str(user_id), user_name, when, str(pre_id), pre_text, 'None' if pre_url==None else pre_url, 'normal'])
            pre_lines.append(line)
        except:
            break

    next_id = now_id
    next_lines = []
    for i in range(100):
        try:
            user_id, user_name, when, next_id, next_text, next_url = gdb.query('\
                MATCH p=(a)<-[r:Anchor]-(b)<-[t:Toot]-(c) WHERE ID(a)={}\
                RETURN ID(c), c.name, t.when, ID(b), b.text, b.url\
                '.format(next_id))[0]
            line = ','.join([str(user_id), user_name, when, str(next_id), next_text, 'None' if next_url==None else next_url, 'normal'])
            next_lines.append(line)
        except:
            break

    lines = pre_lines[::-1] + [now_line] + next_lines
    res_text = '\n'.join(lines)
    result = {
        'text': res_text
        }
    return make_response(jsonify(result))

@api.route('/api/askUser/<int:user_id>', methods=['GET'])
def api_askUser(user_id):
    user_id, user_name, user_bio = gdb.query('\
        MATCH (a:User) WHERE ID(a)={} RETURN ID(a), a.name, a.bio\
        '.format(user_id))[0]
    result = {
        'text': ','.join([str(user_id), user_name, 'None' if user_bio==None else user_bio])
    }
    return  make_response(jsonify(result))

@api.route('/api/hisToot/<int:user_id>', methods=['GET'])
def api_hisToot(user_id):
    res_text = ''
    for line in gdb.query('\
        MATCH p=(a)-[r:Toot]->(b) WHERE ID(a)={}\
        RETURN ID(a), a.name, r.when, ID(b), b.text, b.url LIMIT 200\
        '.format(user_id)):

        user_id, user_name, toot_when, card_id, card_text, card_url = line
        line = ','.join([str(user_id), user_name, toot_when, str(card_id), card_text, 'None' if card_url==None else card_url, 'normal'])
        res_text+=line+'\n'
    result = {
        'text': res_text
        }
    return make_response(jsonify(result))

@api.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    model_name = 'echo_model/doc2vec.20170611T223642.model'
    toots_fname = 'dump/tamakoo.20170611T220442.dump.csv'

    model = gensim.models.Doc2Vec.load(model_name)
    doc = open(toots_fname).readlines()
    doc_vecs = [ model.infer_vector(wakati(mecab.parse(line.split(',')[4]))) for line in doc ]

    api.run(host='0.0.0.0', port=3000)
