const Web3 = require("web3");

const web3 = new Web3("http://localhost:7545");

const Contract = require("web3-eth-contract");
const CasinoInterface = require("./utils/interface.json");
const contract_address = "0xbbECD4a07712A9B8221eA43D377EeeA9ab31eB06";

(async () => {
  try {
    const accounts = await web3.eth.getAccounts(); //Get the accounts in at that node
    //console.log(accounts);

    const before_balance = await Promise.all(
      accounts.map(async (x) => {
        const wei_balance = await web3.eth.getBalance(x);
        // return wei_balance;
        return await web3.utils.fromWei(wei_balance, "ether");
      })
    );

    const Casino = await new web3.eth.Contract(
      CasinoInterface,
      contract_address,
      { gas: 1000000 }
    );
    await Casino.handleRevert;
    const CasinoMethods = await Casino.methods;

    // console.log(Casino);

    const responses = await Promise.all(
      accounts.map(async (account, x) => {
        const val = await CasinoMethods.bet(x + 1).send({
          from: account,
          value: 1,
        });

        return val;
      })
    );

    console.log(responses);
    const win = await CasinoMethods.winningNumber().call();

    //console.log(val);
    console.log(win);

    const after_balance = await Promise.all(
      accounts.map(async (x) => {
        const wei_balance = await web3.eth.getBalance(x);

        // return wei_balance;
        return await web3.utils.fromWei(wei_balance, "ether");
      })
    );

    console.log(before_balance);
    console.log(after_balance);
  } catch (error) {
    console.log(error.message);
  }
})();
