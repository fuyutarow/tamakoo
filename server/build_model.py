import os
from datetime import datetime
import numpy as np
import gensim
from gensim import models
from gensim.models import doc2vec
from sklearn.metrics.pairwise import cosine_similarity
import MeCab
mecab = MeCab.Tagger("-Owakati -d /usr/local/lib/mecab/dic/mecab-ipadic-neologd/") 

wakati = lambda sentence: gensim.utils.simple_preprocess(mecab.parse(sentence), min_len=1)

def read_toots(fname):
    with open(fname, encoding='utf-8') as f:
        
        i = 0
        line = f.readline()
        while line:
            try:
                text = line.split('\t')[4]
            except:
                print(line)
            yield doc2vec.TaggedDocument(wakati(text), tags=[i])
            i+=1
            line = f.readline()

def similar(line):
    vec = model.infer_vector(wakati(line))
    sims = cosine_similarity([vec], doc_vecs)
    index = np.argsort(sims[0])[::-1]
    for i in range(20):
        print('#',''.join(doc[index[i]].split(' ')))

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    toots_fname = os.path.join(current_dir, 'dump_toots/tamakoo.running.dump.tsv')
    train_corpus = list(read_toots(toots_fname))
    
    now = datetime.now().strftime("%Y%m%dT%H%M%S+0900")
    #model_fname = 'echo_model/tamakoo.'+now+'.doc2vec.model'
    model_fname = os.path.join(current_dir, 'echo_models/tamakoo.running.doc2vec.model')
    model = doc2vec.Doc2Vec(
        size=200, window=5, min_count=1, iter=20, workers=4, dm=1)
    model.build_vocab(train_corpus)
    model.train(train_corpus, total_examples=model.corpus_count)
    model.save(model_fname)

    print('build {} at {}'.format(model_fname,now))

if __name__ == '__main__':
    main()
