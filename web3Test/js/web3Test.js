const provider = 'https://ropsten.infura.io/v3/a948f49a8c1e4781ba21e99ad9a4703e';
const lostParadiseContractAddress = "0xaa497f7337709AaC8Ba68619ceB09E679C418395";

const loginButton = document.querySelector('#login');
const createBuildingButton = document.querySelector('#createBuilding');
const showAddressButton = document.querySelector('#showBuildingsButton');

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
    console.log("Failed. Please Install Metamask")
  }

  // Now you can start your app & access web3 freely:
  startApp();

})

function startApp() {
  lostParadise = new web3js.eth.Contract(lostParadiseABI, lostParadiseContractAddress);
}

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
      console.log('Building Created.');
  })
  .then(getBuildingsByOwnerJs)
  .then(showBuilding)
  .then(updateButtons);

})


showAddressButton.addEventListener('click', function() {
  showAddressBuildings();
});


async function showBuilding(ids) {
  $("#buildings").empty();
  console.log(ids);
  
  for(id of ids) {
    await lostParadise.methods.searchBuildingById(id).call( {from: userAccount} )
    .then(function(building) {
      $("#buildings").append(`
      <div class="building" value="${building[5]}">
        <div class="group">
          <h3>Building #${building[5]}</h3>
          <div class="type">
            <img src="https://gateway.pinata.cloud/ipfs/QmNM9HNuuFbtnQt8eu8pkMXcGSLAViZrMfA7E7c3y6r3nJ">
          </div>
      </div>

        <div class="group">
          <div class="income">
            <p>Production</p>
            <p>${building[1]} LPS / 8hs</p>
          </div>
        

          <div class="started">
            <p>Cicle Started</p>
            <p class="startedCicleTime">${building[2]} Seconds Ago</p>
          </div>
        </div>

        <div class="group">
          <div class="used">
            <p>Is Being Used</p>
            <p class="isUsed">${building[4]}</p>
          </div>
        

          <div class="claimable">
            <p>Claimable Income</p>
            <p class="claimableBuildingLps">${building[6]} LPS</p>
          </div>
        </div>

        <div class="buttons">
          <a id="useBuilding" value="${building[5]}">Use Building</a>
          <a id="deactivateBuilding" value="${building[5]}">Deactivate Building</a>
          <a id="claimLps" value="${building[5]}">Claim LPS</a>
          <a id="transferBuilding" value="${building[5]}">Transfer Building</a>
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
      .send( {from: userAccount} )
      .on("receipt", function () {
        console.log('Building Set as Used.');
      })
    });

  });

  deactivateButtons = document.querySelectorAll('#deactivateBuilding');
  deactivateButtons.forEach(button => {

    button.addEventListener('click', function() {
      lostParadise.methods.deactivateBuilding(button.getAttribute('value'))
      .send( {from: userAccount} )
      .on("receipt", function () {
        console.log('Building Set as Unused.');
      })
    });

  });

  claimButtons = document.querySelectorAll('#claimLps');
  claimButtons.forEach(button => {

    button.addEventListener('click', function() {
      lostParadise.methods.withdrawBuildingEarnings(button.getAttribute('value'))
      .send( {from: userAccount} )
      .on("receipt", function () {
        console.log("Building's Generated LPS Withdrawed Successfully.");
      })
    });

  });
  
  
  // TODO Transfer PopUp Menu
}


function checkAccmulatedIncome() {
  buildingsShowed = document.querySelectorAll('.building');

  buildingsShowed.forEach(buildingObj => {
    var claimText = buildingObj.querySelector('.claimableBuildingLps');
    var buildingId = buildingObj.getAttribute('value');

    lostParadise.methods.returnBuildingEarnings(buildingId)
    .call({from: userAccount})
    .then(function(response) {
      claimText.innerText = response;
    })
    .then(console.log("Updated Earnings"));
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
      startedTime.innerText = response;
    })
    .then(console.log("Updated Time"));
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
    .then(console.log("Updated Using"));
  })

  setTimeout(checkUsing, 5000);
}