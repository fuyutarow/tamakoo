# -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, abort, make_response
import gensim
from neo4jrestclient.client import GraphDatabase
import secure
from datetime import datetime
url = secure.url
gdb = GraphDatabase(url)

api = Flask(__name__)

@api.route('/')
def index():
    return open('index.html').read()

@api.route('/dist/bundle.js')
def bundle():
    return open('dist/bundle.js').read()

@api.route('/api/toot/<string:toot_text>', methods=['GET'])
def api_toot(toot_text):
    now=datetime.now().strftime("%Y%m%dT%H%M%S")
    gdb.nodes.create(text=toot_text, when=now, who="test_user")

    from gensim.models import doc2vec
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity
    import MeCab
    mecab = MeCab.Tagger('-Owakati -d /usr/local/lib/mecab/dic/mecab-ipadic-neologd/')    
    
    s2w = lambda sentence: gensim.utils.simple_preprocess(mecab.parse(sentence), min_len=1)
    doc = open("toots/oz_wakatiall.txt", 'r').read().split('\n')
    doc_vecs = [ model.infer_vector(s2w(mecab.parse(line))) for line in doc]
    vec = model.infer_vector(s2w(toot_text))
    sims = cosine_similarity([vec], doc_vecs)
    index = np.argsort(sims[0])[::-1]
    res_text = ''
    for i in range(100):
        res_text += ''.join(doc[index[i]].split(' '))+'\n'
    result = {
        'text': res_text
        }
    return make_response(jsonify(result))
    # Unicodeにしたくない場合は↓
    # return make_response(json.dumps(result, ensure_ascii=False))

@api.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    model = gensim.models.Doc2Vec.load("tamakoo_model/oz_doc2vec170529.model")
    api.run(host='0.0.0.0', port=3000)
