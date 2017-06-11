# -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, abort, make_response
import numpy as np
import gensim
from gensim.models import doc2vec
from sklearn.metrics.pairwise import cosine_similarity
wakati = lambda sentence: gensim.utils.simple_preprocess(sentence, min_len=1)


api = Flask(__name__)

@api.route('/')
def index():
    return open('index.html', encoding='utf-8').read()

@api.route('/dist/bundle.js')
def bundle():
    return open('dist/bundle.js', encoding='utf-8').read()

@api.route('/api/toot/<string:toot_text>', methods=['GET'])
def api_toot(toot_text):
    vec = model.infer_vector(wakati(toot_text))
    sims = cosine_similarity([vec], doc_vecs)
    index = np.argsort(sims[0])[::-1]
    res_text = '\n'.join([ ''.join(doc[index[i]].split(' ')) for i in range(100)])
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
    model_name = 'echo_model/doc2vec.20170611T223642.model'
    toots_fname = 'dump/tamakoo.20170611T220442.test.csv'

    model = gensim.models.Doc2Vec.load(model_name)
    doc = open(toots_fname, encoding='utf-8').readlines()
    doc_vecs = [ model.infer_vector(wakati(line.split(',')[4])) for line in doc ]

    api.run(host='0.0.0.0', port=3000)
