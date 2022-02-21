#!/bin/bash

# on error exit and unset variables
set -eu -o pipefail

echo "Master node endpoint: $1"
echo "Blockchain explorer endpoint: $2"
echo "Sender address: $3"
echo "Sender private key: ${4:0:8}***hidden***"
echo "Gas for contract: $5"
echo "Contract bytecode: ${6:0:10}***hidden***"
echo "Deploying lottery contract"

# send some amount (value) from genesis address (the one that has all the moneyz) to newly created address
./send_tx \
    --master_node_client_api_endpoint=$1 \
    --explorer_grpc_client_api_endpoint=$2 \
    --sender_address=$3 \
    --sender_private_key=$4 \
    --gas_value=$5 \
    --data=$6 \
    --value=0 \
    --set_receiver_to_zero_address=true > send_tx_result.txt

cat send_tx_result.txt
TX_HASH=$(grep "Transaction hash" send_tx_result.txt | awk '{ print $3 }')

if [ -z "$TX_HASH" ]; then
    echo "Transaction hash not found, terminating"
    exit 1
fi

echo "Blockchain explorer REST API: $7"

# check with blockchain explorer if the previous transaction (genesis address -> newly created address) passed
# it could fail if multiple load simulators are trying to send transactions from genesis address at the same time
# at that point, k8s will simply start again by restarting this pod
for i in {1..30}; do
    RESPONSE_CODE=$(curl --insecure --write-out '%{http_code}' --silent --output result.txt "$7/transactions/$TX_HASH")
    
    if [ $RESPONSE_CODE -eq 200 ]; then
        echo "Response code $RESPONSE_CODE, finished waiting"
        break
    fi

    echo "Response code $RESPONSE_CODE, sleeping"
    sleep 1
done

if [ $RESPONSE_CODE -ne 200 ]; then
    echo "Not able to fetch transaction, terminating"
    exit 1
fi

LOTTERY_CONTRACT_ADDRESS=$(jq -r .new_address result.txt)
echo "Lottery contract address: $LOTTERY_CONTRACT_ADDRESS"

echo "JSON gateway: $8"
echo "export let Configs = { NETWORK: '$8', LOTTERY_CONTRACT: '$LOTTERY_CONTRACT_ADDRESS' };" > /app/src/config.js

echo "Created config.js"
cat /app/src/config.js

echo "Starting service"
npm start