const provider = 'https://ropsten.infura.io/v3/a948f49a8c1e4781ba21e99ad9a4703e';
const lostParadiseContractAddress = "0x8B07f6fc3AC40094C0Bdf4777D17B3aD796e2c33";

const loginButton = document.querySelector('#login');
const createBuildingButton = document.querySelector('#createBuilding');
const showAddressButton = document.querySelector('#showBuildingsButton');
const popupMenu = document.querySelector('.transferBuilding');
const popupMenuCross = document.querySelector('.cross');
const transferButton = document.querySelector('.transferButton');
const transferToAddresLe = document.querySelector('#addressTo');
const approveTokenButton = document.querySelector('#approveToken');

var lostParadise;
var userAccount;
var useButtons;
var deactivateButtons;
var claimButtons;
var transferButtons;
var interval;
var buildingsShowed;

addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3js = new Web3(window.ethereum);

  } else {
    // Handle the case where the user doesn't have Metamask installed
    // Probably show them a message prompting them to install Metamask
  }

  // Now you can start your app & access web3 freely:
  startApp();

})

function startApp() {
  lostParadise = new web3js.eth.Contract(lostParadiseABI, lostParadiseContractAddress);
}

popupMenuCross.addEventListener('click', function() {
  popupMenu.classList.add("invisible");
})

approveTokenButton.addEventListener('click', function() {
  lostParadise.methods.approveCurrencyUsage().send({ from: userAccount })
  .then(alert("Approved Succesfully"));
})

loginButton.addEventListener('click', async function() {
  await ethereum.request({ method: 'eth_requestAccounts' })
  .then(function(result) {
    userAccount = result[0];
  })
  .then(getBuildingsByOwnerJs)
  .then(showBuilding)
  .then(updateButtons);

  checkAccmulatedIncome();
  checkStartedTime();
  checkUsing();
});

createBuildingButton.addEventListener('click', function() {
  lostParadise.methods.mintRandomBuilding()
  .send({ from: userAccount })
  .on("receipt", function (receipt) {
  })
  .then(getBuildingsByOwnerJs)
  .then(showBuilding)
  .then(updateButtons);

})


showAddressButton.addEventListener('click', function() {
  showAddressBuildings();
});

transferButton.addEventListener('click', function() {
  if (transferToAddresLe.value != "") {
    var id = popupMenu.querySelector('.buildingNumber').getAttribute('value');
    lostParadise.methods.transferFrom(userAccount, transferToAddresLe.value, tokenId)
    .send({ from: userAccount })
    .on("receipt", function (receipt) {
      console.log(receipt);
    })
  }
});


async function showBuilding(ids) {
  $("#buildings").empty();
  
  for(id of ids) {
    await lostParadise.methods.searchBuildingById(id).call( {from: userAccount} )
    .then(function(building) {
      $("#buildings").append(`
      <div class="building" value="${building[2]}">
        <div class="group">
          <h3>Building #${building[2]}</h3>
          <div class="type">
            <img src="https://gateway.pinata.cloud/ipfs/QmNM9HNuuFbtnQt8eu8pkMXcGSLAViZrMfA7E7c3y6r3nJ">
          </div>
      </div>

        <div class="group">
          <div class="income">
            <p>Production</p>
            <p>${building[0][2]} LPS / 8hs</p>
          </div>
        

          <div class="started">
            <p>Cicle Started</p>
            <p class="startedCicleTime">${building[0][4]} Seconds Ago</p>
          </div>
        </div>

        <div class="group">
          <div class="used">
            <p>Is Being Used</p>
            <p class="isUsed">${building[0][6]}</p>
          </div>
        

          <div class="claimable">
            <p>Claimable Income</p>
            <p class="claimableBuildingLps">${building[3]} LPS</p>
          </div>
        </div>

        <div class="buttons">
          <a id="useBuilding" value="${building[2]}">Use Building</a>
          <a id="deactivateBuilding" value="${building[2]}">Deactivate Building</a>
          <a id="claimLps" value="${building[2]}">Claim LPS</a>
          <a id="transferBuilding" value="${building[2]}">Transfer Building</a>
        </div>
        
      </div>`
      );
    });
  }
}

function searchBuildingById(id) {
  lostParadise.methods.searchBuildingById(id).call( {from: userAccount} );
}

function getBuildingsByOwnerJs() {
  return lostParadise.methods.getBuildingsByOwner(userAccount).call( {from: userAccount} );
}

function updateButtons() {
  useButtons = document.querySelectorAll('#useBuilding');
  useButtons.forEach(button => {

    button.addEventListener('click', function() {
      lostParadise.methods.useBuilding(button.getAttribute('value'))
      .send( {from: userAccount} );
    });

  });

  deactivateButtons = document.querySelectorAll('#deactivateBuilding');
  deactivateButtons.forEach(button => {

    button.addEventListener('click', function() {
      lostParadise.methods.deactivateBuilding(button.getAttribute('value'))
      .send( {from: userAccount} );
    });

  });

  claimButtons = document.querySelectorAll('#claimLps');
  claimButtons.forEach(button => {

    button.addEventListener('click', function() {
      lostParadise.methods.withdrawBuildingEarnings(button.getAttribute('value'))
      .send( {from: userAccount} );
    });

  });

  transferButtons = document.querySelectorAll('#transferBuilding');
  transferButtons.forEach(button => {

    button.addEventListener('click', function() {
      openTransferMenu(button.getAttribute('value'));
    });

  });
  
}


function checkAccmulatedIncome() {
  buildingsShowed = document.querySelectorAll('.building');

  buildingsShowed.forEach(buildingObj => {
    var claimText = buildingObj.querySelector('.claimableBuildingLps');
    var buildingId = buildingObj.getAttribute('value');

    lostParadise.methods.returnBuildingEarnings(buildingId)
    .call({from: userAccount})
    .then(function(response) {
      claimText.innerText = response + " LPS";
    })
  })

  setTimeout(checkAccmulatedIncome, 5000);
}

function checkStartedTime() {
  buildingsShowed = document.querySelectorAll('.building');

  buildingsShowed.forEach(buildingObj => {
    var startedTime = buildingObj.querySelector('.startedCicleTime');
    var buildingId = buildingObj.getAttribute('value');

    lostParadise.methods.returnBuildingStartTime(buildingId)
    .call({from: userAccount})
    .then(function(response) {
      startedTime.innerText = response + " Seconds Ago";
    })
  })

  setTimeout(checkStartedTime, 5000);
}

function checkUsing() {
  buildingsShowed = document.querySelectorAll('.building');

  buildingsShowed.forEach(buildingObj => {
    var isUsed = buildingObj.querySelector('.isUsed');
    var buildingId = buildingObj.getAttribute('value');

    lostParadise.methods.isUsed(buildingId)
    .call({from: userAccount})
    .then(function(response) {
      isUsed.innerText = response;
    })
  })

  setTimeout(checkUsing, 5000);
}


function openTransferMenu(tokenId) {
  popupMenu.querySelector('.buildingNumber').innerText = `Transfer Building #${tokenId}`;
  popupMenu.querySelector('.buildingNumber').setAttribute('value', tokenId);
  popupMenu.classList.remove("invisible");
}

