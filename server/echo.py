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

import get

def echo(text, model, notes, text_vecs, amount = 100):
    vec = model.infer_vector(wakati(text))
    sims = cosine_similarity([vec], text_vecs)
    index = np.argsort(sims[0])[::-1]
    cards = []
    for i in range(amount):
        note_id = notes.ix[index[i]]['note_id']
        card = get.get_card(note_id)
        card['mode'] = 'drawn'
        cards.append(card)
    return cards

if __name__ == '__main__':
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_name = os.path.join(current_dir, '../echo_models/tamakoo.running.doc2vec.model')
    notes_fname  = os.path.join(current_dir, '../docs/tamakoo.test.dump.csv')

    model = gensim.models.Doc2Vec.load(model_name)
    df = pd.read_csv(notes_fname)
    df = df.reindex(np.random.permutation(df.index)).reset_index(drop=True)
    notes = df[:100]
    text_vecs = [ model.infer_vector(wakati(line)) for line in list(notes['note_text']) ]

    amount = input('amount>')
    sentence = input('>')
    while sentence:
        lines = echo(sentence, model, notes, text_vecs, amount) 
        print(lines) 
        sentence = input('>')
