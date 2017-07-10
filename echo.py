import os
import json
import pandas as pd
import string

from datetime import datetime
from pytz import timezone
now = lambda: datetime.now(timezone('UTC')).isoformat()
url = lambda n: 'http://alfalfalfa.com/articles/{}.html'.format(n)
iso2utc = lambda iso: timezone('UTC').localize(pd.to_datetime(iso))
import time

import numpy as np
import gensim
from gensim.models import doc2vec
from sklearn.metrics.pairwise import cosine_similarity

import MeCab
mecab = MeCab.Tagger('-Owakati -d /usr/local/lib/mecab/dic/mecab-ipadic-neologd/')
wakati = lambda sentence: gensim.utils.simple_preprocess(mecab.parse(sentence), min_len=1)

import argparse
parser = argparse.ArgumentParser(description='tamakoo echo')
#parser.add_argument('--sentence','-s', required=True, type=str,
#                    help='input sentense')
parser.add_argument('--number','-n',default=100, type=int,
                    help='numberof output sentense')
args = parser.parse_args()

import get

def echo(text, model, cards, text_vecs, amount = 100):
    vec = model.infer_vector(wakati(text))
    sims = cosine_similarity([vec], text_vecs)
    index = np.argsort(sims[0])[::-1]
    lines = []
    for i in range(amount):
        card_id = cards.ix[index[i]]['card_id']
        line = get.card(card_id)
        line['mode'] = 'drawn'
        lines.append(line)
    return lines

if __name__ == '__main__':
    model_name = 'echo_models/tamakoo.running.doc2vec.model'
    docs_fname = 'docs/tamakoo.test.dump.csv'

    model = gensim.models.Doc2Vec.load(model_name)
    df = pd.read_csv(docs_fname).dropna()
    df = df.reindex(np.random.permutation(df.index)).reset_index(drop=True)
    cards = df[:100]
    start = time.time()
    text_vecs = [ model.infer_vector(wakati(line)) for line in list(cards['card_text']) ]
    print('texts to vecs in {}[sec]'.format(time.time()-start))

    sentence = input('>')
    while sentence:
        lines = echo(sentence, model, cards, text_vecs, args.number)
        print(lines) 
        sentence = input('>')
