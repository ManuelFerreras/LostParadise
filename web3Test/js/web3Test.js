const provider = 'https://ropsten.infura.io/v3/a948f49a8c1e4781ba21e99ad9a4703e';
const lostParadiseContractAddress = "0xc7Ee0Fcd459409b21BC2ae2BcCEF51a905d5A983";

const loginButton = document.querySelector('#login');
const accountsButton = document.querySelector('#accounts');
const createBuildingButton = document.querySelector('#createBuilding');
const findBuildingInfoButton = document.querySelector('#findBuildingInfo');
const findId_le = document.querySelector('#buildingId');
const showAddressButton = document.querySelector('#showBuildingsButton');
const buildingsDiv = document.querySelector('#buildings');

var lostParadise;
var userAccount;

addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3js = new Web3(window.ethereum);
    console.log("Success")

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


loginButton.addEventListener('click', function() {
  ethereum.request({ method: 'eth_requestAccounts' })
  .then(function(result) {
    console.log("1");
    userAccount = result[0];
  })
  .then(getBuildingsByOwnerJs)
  .then(showBuilding);
});

accountsButton.addEventListener('click', function() {
  console.log(userAccount);
});

createBuildingButton.addEventListener('click', function() {

  lostParadise.methods.createBuilding()
  .send({ from: userAccount })
  .on("receipt", function (receipt) {
      console.log('Building Created.');
  });

})


findBuildingInfoButton.addEventListener('click', function() {

  lostParadise.methods.searchBuildingById(parseInt(findId_le.value)).call( {from: userAccount} )
  .then(function (result) {
    console.log('Tx Finished.' + JSON.stringify(result));
  });

});





showAddressButton.addEventListener('click', function() {
  showAddressBuildings();
});


function showBuilding(ids) {
  $("#buildings").empty();
  console.log(ids);
  
  for(id of ids) {
    lostParadise.methods.searchBuildingById(id).call( {from: userAccount} )
    .then(function(building) {
      $("#buildings").append(`
      <div class="building">
        <h3>Building #${building[5]}</h3>

        <div class="type">
          <p>Type</p>
          <p>${building[0]}</p>
        </div>

        <div class="income">
          <p>Income</p>
          <p>${building[1]} LPS</p>
        </div>

        <div class="started">
          <p>Cicle Started</p>
          <p>${building[2]} Seconds Ago</p>
        </div>

        <div class="duration">
          <p>Cicle Duration</p>
          <p>${building[3]} Seconds</p>
        </div>

        <div class="used">
          <p>Is Being Used</p>
          <p>${building[4]}</p>
        </div>

        <div class="claimable">
          <p>Claimable Income</p>
          <p>${building[6]} LPS</p>
        </div>

        <a class"useBuilding" value="${building[5]}">Use Building</a>
        
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