const web3 = new Web3("ws://127.0.0.1:8545");

let currentAccount;

setInterval(
    async ()=> {
        const accounts = await window.web3.eth.getAccounts();
        currentAccount = await accounts[0];
        // console.log(accounts);
    }, 1000
)

window.addEventListener('load', async () => {
    console.log("window Loaded");
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.enable();
            accounts= await web3.eth.getAccounts();

            // const DwitterContract = new web3.eth.Contract(DwitterAbi, DwitterAddress);
            
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        accounts = await web3.eth.getAccounts();
        console.log("Using Metamask")
        // console.log(accounts);
        // Acccounts always exposed
        // web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});
const DwitterContract = new web3.eth.Contract(DwitterAbi, DwitterAddress);