# -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, abort, make_response
import numpy as np
import gensim
from gensim.models import doc2vec
from sklearn.metrics.pairwise import cosine_similarity

api = Flask(__name__)

@api.route('/')
def index():
    return open('index.html', encoding='utf-8').read()

@api.route('/dist/bundle.js')
def bundle():
    return open('dist/bundle.js', encoding='utf-8').read()

@api.route('/api/toot/<string:toot_text>', methods=['GET'])
def api_toot(toot_text):
    print(toot_text)
    s2w = lambda sentence: gensim.utils.simple_preprocess(sentence, min_len=1)
    doc = open('toots/oz_wakatiall.txt', 'r', encoding='utf-8').read().split('\n')
    doc_vecs = [ model.infer_vector(s2w(line)) for line in doc]
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
