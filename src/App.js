import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react'

const Web3 = require("@dreamfactoryhr/web3t");
const web3 = new Web3('https://testnet-gateway.dev.tolar.io');
let tolar = web3.tolar;

let contract_address = "54d069785e5fd46859bd377fdad494045c235e7b2ef9c60b71";

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function() {
    var results
    var web3 = window.tolar

    if (typeof window.tolar !== "undefined") {
      window.tolar
        .enable()
        .then((accounts) => {
          console.log("connected with :" + accounts[0]);
          results = {
            web3: web3,
            account: accounts[0]
          }
          resolve(results);
        });

        this.console.log(web3.currentProvider);
        web3 = new Web3(window.tolar)


      results = {
        web3: web3,
      }
      console.log("Taquin is installed!");
    }
  })
});

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepNumber: 0,
    };
  }



  handleClick(selected_account) {
    web3.tolar.getLatestBalance(selected_account).then(result => {
      this.setState ({
        balance: result.balance
      });
    })
  }

  handlePurchaseTicket(selected_account) {
    let lala = window.tolar.request({method:'taq_sendTransaction', params:[{
      sender_address: selected_account,
      receiver_address: contract_address,
      amount: "100000000000000000",
      gas: 510000,
      gas_price: 1,
      data: "0x21846c76"
    }]}).then(result => {
      console.log("SENT PURCHASE");
    })
  }

  handleAnnounceWinner(selected_account) {
    window.tolar.request({method:'taq_sendTransaction', params:[{
      sender_address: selected_account,
      receiver_address: contract_address,
      amount: "0",
      gas: 510000,
      gas_price: 1,
      data: "0x2d8cd096"
    }]}).then(result => {
      console.log("SENT ANNOUNCE");
    })
  }

  handleWithdraw(selected_account) {
    window.tolar.request({method:'taq_sendTransaction', params:[{
      sender_address: selected_account,
      receiver_address: contract_address,
      amount: "0",
      gas: 510000,
      gas_price: 1,
      data: "0x3ccfd60b"
    }]}).then(result => {
      console.log("SENT WITHDRAW");
    })
  }

  handleGetParticipants() {
    web3.tolar.tryCallTransaction(
      "54000000000000000000000000000000000000000023199e2b",
      contract_address,
      0,
      100000000,
      1,
      "0x7417040e",
      0
    ).then(result => {
      console.log("try call result")
      console.log(result);
      this.setState({
        numberOfParticipants: result.output
      });
    })
  }

  handleGetWinner() {
    web3.tolar.tryCallTransaction(
      "54000000000000000000000000000000000000000023199e2b",
      contract_address,
      0,
      100000000,
      1,
      "0xdfbf53ae",
      0
    ).then(result => {
      console.log("try call result winner")
      console.log(result);
      this.setState({
        winner: result.output
      });
    })
  }

  tolAccountChanged(accounts) {
    this.setState({
      account: accounts[0]
    })
  }

  handleGetOwner() {
    web3.tolar.tryCallTransaction(
      "54000000000000000000000000000000000000000023199e2b",
      contract_address,
      0,
      100000000,
      1,
      "0x8da5cb5b",
      0
    ).then(result => {
      console.log("try call result owner")
      console.log(result);
      this.setState({
        owner: result.output
      });
    })
  }

  onAccountsChanged(callback) {
    window.tolar.on('accountsChanged', function (accounts) {
      callback(accounts[0]);
    })
  }

  componentWillMount() {
    this.onAccountsChanged.bind(this);
    this.onAccountsChanged((result) => {
      this.setState({
        account: result
      })
    })


    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3,
        account: results.account
      })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  render() {

    var numberOfParticipants = "";
    if (this.state.numberOfParticipants) {
      numberOfParticipants = "Number of participants: " + this.state.numberOfParticipants;
    }

    var winner = "";
    if (this.state.winner) {
      winner = "Winner address: " + this.state.winner;
    }

    var balance = "";
    if (this.state.balance) {
      balance = "Balance of my address: " + this.state.balance + " AttoTOL";
    }

    var owner = "";
    if (this.state.owner) {
      owner = "Contract creator: " + this.state.owner;
    }

    return (
      <div className="game">
        <div className="game-board">
          <br/>
          <label>Your account is: {this.state.account}</label>
          <br/>
          <br/>
          {balance}
          <br/>
          <br/>
          {numberOfParticipants}
          <br/>
          <br/>
          {winner}
          <br/>
          <br/>
          {owner}
          <br/>
          <br/>

          Pay 0.1 TOL to participate:
          <br/>
          <button
            style={{
              height: 40,
              margin: 5,
            }}
            onClick={() => this.handlePurchaseTicket(this.state.account)}>Purchase Ticket
          </button>

          <br/>
          <br/>
          Read only methods:
          <br/>

          <button
            style={{
              height: 40,
              margin: 5,
            }}
            onClick={() => this.handleGetWinner()}>Fetch winner
          </button>

          <button
            style={{
              height: 40,
              margin: 5,
            }}
            onClick={() => this.handleGetOwner()}>Fetch owner
          </button>
          

          <button
            style={{
              height: 40,
              margin: 5,
            }}
            onClick={() => this.handleGetParticipants()}>Get participants
          </button>


          <br/>
          <br/>
          Only contract owner can call:
          <br/>
          <button
            style={{
              height: 40,
              margin: 5,
            }}
            onClick={() => this.handleAnnounceWinner(this.state.account)}>Announce Winner
          </button>

          <br/>
          <br/>
          Only winner can withdraw:
          <br/>

          <button
            style={{
              height: 40,
              margin: 5,
            }}
            onClick={() => this.handleWithdraw(this.state.account)}>Withdraw
          </button>

          <br/>
          <br/>
          Get my balance:

          <br/>
          <button
            style={{
              height: 40,
              margin: 5,
            }}
            onClick={() => this.handleClick(this.state.account)}>Get balance
          </button>
 
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Game />
      
    </div>
  );
}

export default App;

/*
ZERO 54000000000000000000000000000000000000000023199e2b
*/

/*
60806040526000600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555067016345785d8a000060025534801561005e57600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610917806100ae6000396000f3fe6080604052600436106100705760003560e01c80633ccfd60b1161004e5780633ccfd60b146100d35780637417040e146100dd5780638da5cb5b14610108578063dfbf53ae1461013357610070565b806321846c76146100755780632d8cd0961461007f57806335c1d34914610096575b600080fd5b61007d61015e565b005b34801561008b57600080fd5b50610094610286565b005b3480156100a257600080fd5b506100bd60048036038101906100b89190610612565b610414565b6040516100ca9190610728565b60405180910390f35b6100db610453565b005b3480156100e957600080fd5b506100f2610568565b6040516100ff9190610743565b60405180910390f35b34801561011457600080fd5b5061011d610575565b60405161012a9190610728565b60405180910390f35b34801561013f57600080fd5b50610148610599565b6040516101559190610728565b60405180910390f35b60025434101561016d57600080fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156101c657600080fd5b600073ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461022157600080fd5b6003339080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146102de57600080fd5b600073ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461033957600080fd5b60026003805490501161034b57600080fd5b6000426003604051602001610361929190610700565b6040516020818303038152906040528051906020012060001c905060006003805490508261038f9190610816565b9050600381815481106103a5576103a4610876565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b6003818154811061042457600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b3373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146104ad57600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f19350505050158015610515573d6000803e3d6000fd5b506000600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506003600061056691906105bf565b565b6000600380549050905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b50805460008255906000526020600020908101906105dd91906105e0565b50565b5b808211156105f95760008160009055506001016105e1565b5090565b60008135905061060c816108ca565b92915050565b600060208284031215610628576106276108b8565b5b6000610636848285016105fd565b91505092915050565b600061064b8383610666565b60208301905092915050565b610660816107b6565b82525050565b61066f816107b6565b82525050565b600061068082610773565b61068a818561078b565b93506106958361075e565b8060005b838110156106cd576106aa826108a5565b6106b4888261063f565b97506106bf8361077e565b925050600181019050610699565b5085935050505092915050565b6106e3816107e8565b82525050565b6106fa6106f5826107e8565b61080c565b82525050565b600061070c82856106e9565b60208201915061071c8284610675565b91508190509392505050565b600060208201905061073d6000830184610657565b92915050565b600060208201905061075860008301846106da565b92915050565b60008190508160005260206000209050919050565b600081549050919050565b6000600182019050919050565b600081905092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006107c1826107c8565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6000610805610800836108bd565b610796565b9050919050565b6000819050919050565b6000610821826107e8565b915061082c836107e8565b92508261083c5761083b610847565b5b828206905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60006108b182546107f2565b9050919050565b600080fd5b60008160001c9050919050565b6108d3816107e8565b81146108de57600080fd5b5056fea2646970667358221220d529517d5cb89cf6ddf1f709082427d99356f7a47ec27f2be0db4e1924b571e264736f6c63430008070033
*/

/*
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    address public owner;
    address public winner = address(0);
    
    uint256 ticketPrice = 0.1 ether;
    
    address[] public participants;
    
    constructor() {
        owner = msg.sender;
    }
    
    function purchaseTicket() public payable {
        require(msg.value >= ticketPrice);
        require(msg.sender != owner);
        require(winner == address(0));
        
        participants.push(msg.sender);
    }
    
    function announceWinner() external {
        require(msg.sender == owner);
        require(winner == address(0));
        require(participants.length > 2);
        
        uint256 rand = uint256(keccak256(abi.encodePacked(block.timestamp, participants)));
        uint256 winnerIndex = rand % participants.length;
        
        winner = participants[winnerIndex];
    }

    function numberOfParticipants() public view returns(uint256) {
        return participants.length;
    }
    
    function withdraw() public payable {
        require(winner == msg.sender);
        
        payable(winner).transfer(address(this).balance);

        winner = address(0);
        delete participants;
    }
}
*/