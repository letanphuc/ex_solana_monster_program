#!/bin/bash
dir=$(dirname $0)
ls $dir/*.json | while read f
do 
    solana airdrop 100 $(solana-keygen pubkey $f) 
done