import gensim
from gensim import models
from gensim.models import doc2vec
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import MeCab
mecab = MeCab.Tagger("-Owakati -d /usr/local/lib/mecab/dic/mecab-ipadic-neologd/") 

import argparse

parser = argparse.ArgumentParser(description='tamakoo echo')
parser.add_argument('--sentence','-s', required=True, type=str,
                    help='input sentense')
parser.add_argument('--number','-n',default=100, type=int,
                    help='numberof output sentense')
args = parser.parse_args()


s2w = lambda sentence: gensim.utils.simple_preprocess(mecab.parse(sentence), min_len=1)
model = gensim.models.Doc2Vec.load("tamakoo_model/oz_doc2vec170529.model")
doc = open("toots/oz_wakatiall.txt", 'r').read().split('\n')
doc_vecs = [ model.infer_vector(s2w(mecab.parse(line))) for line in doc]
vec = model.infer_vector(s2w(args.sentence))
sims = cosine_similarity([vec], doc_vecs)
index = np.argsort(sims[0])[::-1]
for i in range(args.number):
    print(''.join(doc[index[i]].split(' ')))
