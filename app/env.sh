export PLAYER_ID=$1
export BROWSER= 
export ANCHOR_WALLET=$(pwd)/wallet/player${PLAYER_ID}.json
export PLAYER_ADDRESS=$(solana-keygen pubkey $ANCHOR_WALLET)

echo "Environemt as player $PLAYER_ID: $PLAYER_ADDRESS"
