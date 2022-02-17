// const buyButton = document.querySelector('#buy-tokens');
const whitelistButton = document.querySelector('#whitelist-btn');

const whitelistLeftTimeText = document.querySelector('#whitelist-time');
// const icoLeftTimeText = document.querySelector('#ico-time');
// const icoLeftTokensText = document.querySelector('#ico-tokens');
// const icoPriceText = document.querySelector('#ico-price');
// const icoPurchaseAmountText = document.querySelector('#ico-amount');

// const icoBuyAmountInput = document.querySelector('#ico-amount-buy');

var icoContract;
var timeLeft;


let doAction = login;

var userAccount;

addEventListener('load', async function() {
    login();

    whitelistButton.addEventListener('click', async function() {
        await doAction();
    });
});


async function login() {
    if (typeof web3 !== 'undefined') {
        web3js = new Web3(window.ethereum);  
        
        await web3js.eth.net.getId().then(res => {
            if (res != 4) {
                alert("Please Connect to Rinkeby Network");
            } else {
                icoContract = new web3js.eth.Contract(lostParadiseIcoAbi, icoAddress);

                ethereum.request({ method: 'eth_requestAccounts' })
                .then(function(result) {
                userAccount = result[0];
                });

                // doAction = buyTokens; // ICO
                doAction = whitelist; // Whitelist

                // checkInfo();
                checkWhitelistInfo();
            }
        });        
    } else {
        alert("Please Install Metamask.");
    }
}

async function whitelist() {
  await icoContract.methods.whitelistAccount().send({from:userAccount}).then(
    () => {
      location.reload();
    }
  );
}

async function checkWhitelistInfo() {
  await icoContract.methods.getWhitelistLeftTime().call({from:userAccount}).then( res => {
      timeLeft = res;
      console.log(res);
    }
  )

  updateTime();
}

function updateTime() {

  if(timeLeft > 0) {
    timeLeft -= 1;
    whitelistLeftTimeText.innerText = `Time Left: ${timeLeft} Seconds`

    setTimeout(updateTime, 1000);
  }
}

async function buyTokens() {
    var amountToBuy = icoBuyAmountInput.value;
  
    var minPurchase;
    var price;
    var maxPurchase;
    var tokensAvailable;
    var end;
  
    await icoContract.methods.minPurchase().call({from:userAccount}).then(res => {
      minPurchase = res;
    });
  
    await icoContract.methods.maxPurchase().call({from:userAccount}).then(res => {
      maxPurchase = res;
    });
  
    await icoContract.methods.price().call({from:userAccount}).then(res => {
      price = res / 1000000000000000000;
    });
  
    await icoContract.methods.availableTokensICO().call({from:userAccount}).then(res => {
      tokensAvailable = res;
    });
  
    await icoContract.methods.end().call({from:userAccount}).then(res => {
      if (res - (Date.now() / 1000) < 0) {
        end = 0;
      } else {
        end = res - (Date.now() / 1000);
      }
    });
  
  
  
  
    if (amountToBuy != "") {
      if (minPurchase <= (amountToBuy * price) <= maxPurchase) {
        if (amountToBuy < tokensAvailable){
          if (end > 0) {
            var sendValue = amountToBuy * price * 1000000000000000000;
  
            await icoContract.methods.buy().send({from:userAccount, value:sendValue});
          } else {
            alert("Already finished.");
          }
        } else {
          alert("Not enough tokens available.");
        }
      } else {
        alert("Not between min and max Purchase.");
      }
    } else {
      alert("Not a valid Number");
    }
}


async function checkInfo() {

    var price;
    var end;
    var minPurchase;
    var maxPurchase;
    var tokensAvailable;
  
    await icoContract.methods.price().call({from:userAccount}).then(res => {
      price = res / 1000000000000000000;
    });
  
    await icoContract.methods.end().call({from:userAccount}).then(res => {
      if (res - (Date.now() / 1000) < 0) {
        end = 0;
      } else {
        end = res - (Date.now() / 1000);
      }
    });
  
    await icoContract.methods.minPurchase().call({from:userAccount}).then(res => {
      minPurchase = res;
    });
  
    await icoContract.methods.maxPurchase().call({from:userAccount}).then(res => {
      maxPurchase = res;
    });
  
    await icoContract.methods.availableTokensICO().call({from:userAccount}).then(res => {
      tokensAvailable = res / 10 ** 18;
    });
  
    icoLeftTokensText.innerText = `Tokens Left: ${tokensAvailable} LPS`;
    icoLeftTimeText.innerText = `Time Left: ${Math.floor(end)} Seconds`;
    icoPriceText.innerText = `Token Price: ${price} BNB / 1 LPS`;
    icoPurchaseAmountText.innerText = `Min Purchase: ${minPurchase} LPS - Max Purchase: ${maxPurchase} LPS`;
  
    setTimeout(1000, checkInfo());
}
  