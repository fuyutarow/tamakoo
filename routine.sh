#!/bin/sh

# Double start prevention
_process=`basename $0`
_pcnt=`ps -edf | grep /home/tamakoo/routine.sh | grep -v 'grep' | wc -l`
if [ ${_pcnt} -gt 1 ]; then
  echo "This script has been running now. proc : ${_pcnt}"
  exit 1
fi

PYTHON_PATH='/home/ytro/anaconda3/bin'
TAMAKOO='/home/tamakoo'
$PYTHON_PATH/python $TAMAKOO/dump.py
$PYTHON_PATH/python $TAMAKOO/build_model.py
