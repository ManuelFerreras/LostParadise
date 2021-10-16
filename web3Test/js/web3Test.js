const lostParadiseContractAddress = "0x36149c77A43f7E7422EfBAE6b823eD1C78c9F4B0";

const loginButton = document.querySelector('#login');
const approveTokenButton = document.querySelector('#approveToken');

var lostParadise;
var userAccount;
var useButtons;
var deactivateButtons;
var claimButtons;
var transferButtons;
var interval;
var buildingsShowed;

var alertId = 0;
var transferMenuOpenned = false;
var shopMenuOpenned = false;
var waitingResponce = false;



addEventListener('load', function() {
  if (typeof web3 !== 'undefined') {
    web3js = new Web3(window.ethereum);

  } else {
    errorAlert("Please Install Metamask.");
  }
  lostParadise = new web3js.eth.Contract(lostParadiseABI, lostParadiseContractAddress);
})

function approveToken() {
  try {
    if (!waitingResponce){
      waitingResponce = true;
      lostParadise.methods.approveCurrencyUsage().send({ from: userAccount })
      .then(successAlert("Approved Succesfully"))
      .then(() => {waitingResponce = false;});
    } else {
      errorAlert("Action In Progress!");
    }
  } catch (error) {
    errorAlert(error);
    waitingResponce = false;
  }
}

// Login Event
loginButton.addEventListener('click', async function() {
  await ethereum.request({ method: 'eth_requestAccounts' })
  .then(function(result) {
    userAccount = result[0];
  })
  .then(login)
  .then(getBuildingsByOwnerJs)
  .then(showBuilding)
  .then(updateButtons);

  checkAccmulatedIncome();
  checkStartedTime();
  checkUsing();

  document.querySelector('.fa-clone').addEventListener('click', function() {
    navigator.clipboard.writeText(userAccount);
    successAlert("Copied To Clipboard!")
  });
});

function mintBuilding() {
  try {
    if (!waitingResponce) {
      waitingResponce = true;
      lostParadise.methods.mintRandomBuilding()
      .send({ from: userAccount })
      .on("receipt", function (receipt) {
        successAlert("Building Minted.");
      })
      .then(getBuildingsByOwnerJs)
      .then(showBuilding)
      .then(updateButtons)
      .then(() => {waitingResponce = false;});
    } else {
      errorAlert("Action In Progress!");
    }
  } catch (error) {
    errorAlert(error);
    waitingResponce = false;
  }
}

// Login System
function login() {
  successAlert("Login Completed")
  $('.login').remove();
  document.querySelector(".accountAddress").innerText = userAccount.substring(0, 4) + "..." + userAccount.substring(userAccount.length - 6, userAccount.length);
  $('.address').removeClass("invisible");
  $('.buildings').removeClass("invisible");
  $('.navegacion').removeClass("invisible");
}


// Updates Owner's Buildings List.
async function showBuilding(ids) {
  $("#buildings").empty();
  
  for(id of ids) {
    await lostParadise.methods.searchBuildingById(id).call( {from: userAccount} )
    .then(function(building) {
      console.log(building);
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

// Retrieves Certain Building Info.
function searchBuildingById(id) {
  lostParadise.methods.searchBuildingById(id).call( {from: userAccount} );
}

// Retrieves array of Owned Buildings.
function getBuildingsByOwnerJs() {
  return lostParadise.methods.getBuildingsByOwner(userAccount).call( {from: userAccount} );
}


// Update Buttons Based on Owner's Buildings.
function updateButtons() {
  useButtons = document.querySelectorAll('#useBuilding');
  useButtons.forEach(button => {

    button.addEventListener('click', function() {
      try {
        if (!waitingResponce) {
          waitingResponce = true;
          lostParadise.methods.useBuilding(button.getAttribute('value'))
          .send( {from: userAccount} )
          .on('receipt', () => {waitingResponce = false;});
        } else {
          errorAlert("Action In Progress!");
        }
      } catch (error) {
        errorAlert(error);
        waitingResponce = false;
      }
    });

  });

  deactivateButtons = document.querySelectorAll('#deactivateBuilding');
  deactivateButtons.forEach(button => {

    button.addEventListener('click', function() {
      try {
        if (!waitingResponce) {
          waitingResponce = true;
          lostParadise.methods.deactivateBuilding(button.getAttribute('value'))
          .send( {from: userAccount} )
          .on('receipt', () => {waitingResponce = false;});
        } else {
          errorAlert("Action In Progress!");
        }
      } catch (error) {
        errorAlert(error);
        waitingResponce = false;
      }
    });

  });

  claimButtons = document.querySelectorAll('#claimLps');
  claimButtons.forEach(button => {

    button.addEventListener('click', function() {
      try {
        if (!waitingResponce) {
          waitingResponce = true;
          lostParadise.methods.withdrawBuildingEarnings(button.getAttribute('value'))
          .send( {from: userAccount} )
          .on('receipt', () => {waitingResponce = false;});
        } else {
          errorAlert("Action In Progress!");
        }
      } catch (error) {
        errorAlert(error);
        waitingResponce = false;
      }
    });

  });

  transferButtons = document.querySelectorAll('#transferBuilding');
  transferButtons.forEach(button => {

    button.addEventListener('click', function() {
      openTransferMenu(button.getAttribute('value'));
    });

  });
  
}


// Auto Updates Owner's Buildings Accumulated Incomes.
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

// Auto Updates Owner's Buildings Cicle Starting Time.
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

// Auto Updates Owner's Buildings Used State.
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

// Shop Menu Opening
$('#shopBtn').click(async function() {
  if (!shopMenuOpenned) {
    shopMenuOpenned = true;

    
    console.log(allowance);
    $('body').append(`
      <div class="menu">
          <i class="fas fa-times cross"></i>
          <h2>Shop Menu</h2>
      </div>` 
    );

    var allowance = await lostParadise.methods.getAccountCurrencyAllowance().call({from: userAccount});
    if (allowance > 0) {
      $('.menu').append(`
        <a class="boton buySlotBtn">Buy Slot<br><span class="price">5000 LPS</span></a>

        <a class="boton mintBuildingButton">Mint Building<br><span class="price">10000 LPS</span></a>
      `);

      $('.buySlotBtn').click(function() {}); //TODO
  
      $('.mintBuildingButton').click(function() {
        mintBuilding();
      });

    } else {
      $('.menu').append(`
      <a class="boton approveBtn">Approve LPS</a>
      `);

      $('.approveBtn').click(function() {
        approveToken();
      });
    }

    $('.fa-times').click(function() {
      $('.menu').remove();
      shopMenuOpenned = false;
    });

  } else {
    warningAlert("Already Opened!");
  }
});

// Transfer Menu Opening
function openTransferMenu(buildingId) {
  if (!transferMenuOpenned){
    transferMenuOpenned = true;

    $('body').append(`
      <div class="menu">
          <i class="fas fa-times cross"></i>

          <h2 class="buildingNumber" value="${buildingId}">Transfer Building #${buildingId}</h2>

          <div class="addressToInput">
              <input id="addressTo" type="text" placeholder="Address To">
              <label class="inputLabel" for="addressTo">Address To</label>
          </div>

          <a class="boton transferButton">Transfer</a>
      </div>`
    );

    $('.fa-times').click(function() {
      $('.menu').remove();
      transferMenuOpenned = false;
    });
  } else {
    warningAlert("Already Opened!");
  }

}


// Check Metamask Account Change
window.ethereum.on('accountsChanged', function (accounts) {
  window.location.reload();
})


// Alert Creation
function successAlert(body) {
  var divId = 'successAlert'+alertId;
  var closeId = 'successClose'+alertId;
  $(".alerts").append(`
  <div class="alert show showAlert successAlert" id="${divId}">
    <span class="fas fa-exclamation-circle successCircle"></span>
    <span class="msg successFont">Success: ${body}</span>
    <span class="closeBtn successClose" id="${closeId}">
        <span class="fas fa-times successCross"></span>
    </span>
  </div>`);

  setTimeout(function() {
    $("#" + divId).removeClass("show");
    $("#" + divId).addClass("hide");
    setTimeout(function() {
      $("#" + divId).remove();
    }, 1000);
  }, 3000);
}

function errorAlert(body) {
  var divId = 'errorAlert'+alertId;
  var closeId = 'errorClose'+alertId;
  $(".alerts").append(`
  <div class="alert show showAlert errorAlert" id="${divId}">
    <span class="fas fa-exclamation-circle errorCircle"></span>
    <span class="msg errorFont">Error: ${body}</span>
    <span class="closeBtn errorClose" id="${closeId}">
        <span class="fas fa-times errorCross"></span>
    </span>
  </div>`);

  setTimeout(function() {
    $("#" + divId).removeClass("show");
    $("#" + divId).addClass("hide");
    setTimeout(function() {
      $("#" + divId).remove();
    }, 1000);
  }, 3000);
}

function warningAlert(body) {
  var divId = 'warningAlert'+alertId;
  var closeId = 'warningClose'+alertId;
  $(".alerts").append(`
  <div class="alert show showAlert warningAlert" id="${divId}">
    <span class="fas fa-exclamation-circle warningCircle"></span>
    <span class="msg warningFont">Warning: ${body}</span>
    <span class="closeBtn warningClose" id="${closeId}">
        <span class="fas fa-times warningCross"></span>
    </span>
  </div>`);

  setTimeout(function() {
    $("#" + divId).removeClass("show");
    $("#" + divId).addClass("hide");
    setTimeout(function() {
      $("#" + divId).remove();
    }, 1000);
  }, 3000);
}

// Close Alert
$('.closeBtn').click(function() {
  var id = $(this).attr('id');
  $("#" + id).parent().removeClass("show");
  $("#" + id).parent().addClass("hide");
  setTimeout(function() {
    $("#" + id).parent().remove();
  }, 1000);
})
