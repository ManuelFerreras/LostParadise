const lostParadiseContractAddress = "0x81037b6cF5eeFB592d2cD32f1aF9b9242b17F791";

const loginButton = document.querySelector('#login');
const approveTokenButton = document.querySelector('#approveToken');

var lostParadise;
var userAccount;
var deactivateButtons;
var claimButtons;
var upgradeButtons;
var buildingsShowed;


var alertId = 0;
var transferMenuOpenned = false;
var shopMenuOpenned = false;
var waitingResponce = false;



addEventListener('load', async function() {
  if (typeof web3 !== 'undefined') {
    web3js = new Web3(window.ethereum);

    await web3js.eth.net.getId().then(res => {
      if (res != 137) {

        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }], // chainId must be in hexadecimal numbers
        });

      }
    });
    
  } else {
    errorAlert("Please Install Metamask.");
  }
  lostParadise = new web3js.eth.Contract(lostParadiseABI, lostParadiseContractAddress);
})

function approveToken() {
  if (!waitingResponce){
    waitingResponce = true;
    lostParadise.methods.approveCurrencyUsage().send({ from: userAccount })
    .on('receipt', () => {
      successAlert("Approved Succesfully");
      $('.menu').remove();
      shopMenuOpenned = false;
    })
    .then(() => {waitingResponce = false;})
    .catch(err => {
      errorAlert(err["message"]);
      waitingResponce = false;
    })
  } else {
    errorAlert("Pending Transaction! Please Wait.");
  }
}

// Login Event
loginButton.addEventListener('click', async function() {
  await ethereum.request({ method: 'eth_requestAccounts' })
  .then(function(result) {
    userAccount = result[0];
  })
  .then(login)
  .then(getSlotsByOwnerJs)
  .then(showSlots)
  .then(updateButtons)
  .catch(err => errorAlert(err["message"]));


  document.querySelector('.fa-clone').addEventListener('click', function() {
    navigator.clipboard.writeText(userAccount);
    successAlert("Copied To Clipboard!")
  });

  updateClaimableEarnings();
});

function mintBuilding() {
    if (!waitingResponce) {
      waitingResponce = true;
      lostParadise.methods.mintRandomBuilding()
      .send({ from: userAccount })
      .on("receipt", () => {
        successAlert("Building Minted.");
        $('.menu').remove();
        shopMenuOpenned = false;
      })
      .then(getSlotsByOwnerJs)
      .then(showSlots)
      .then(updateButtons)
      .then(() => waitingResponce = false)
      .catch(err => {
        errorAlert(err["message"])
        waitingResponce = false;
      });

    } else {
      errorAlert("Pending Transaction! Please Wait.");
    }
}

function mintSlot() {
  if (!waitingResponce) {
    waitingResponce = true;
    lostParadise.methods.mintRandomSlot()
    .send({ from: userAccount })
    .on("receipt", () => {
      successAlert("Slot Minted.");
      $('.menu').remove();
      shopMenuOpenned = false;
    })
    .then(getSlotsByOwnerJs)
    .then(showSlots)
    .then(() => waitingResponce = false)
    .catch(err => {
      errorAlert(err["message"])
      waitingResponce = false;
    });

  } else {
    errorAlert("Pending Transaction! Please Wait.");
  }
}

// Login System
function login() {
  successAlert("Login Completed")
  $('.login').remove();
  document.querySelector(".accountAddress").innerText = userAccount.substring(0, 4) + "..." + userAccount.substring(userAccount.length - 6, userAccount.length);
  $('.address').removeClass("invisible");
  $('.slots').removeClass("invisible");
  $('.social').removeClass("invisible");
  $('.navegacion').removeClass("invisible");
}

$('.marketplaceBtn').click(function() {
  $('.slots').addClass("invisible");
  $('.social').addClass("invisible");
  $('.marketplace').removeClass("invisible");
  $('.menu').remove();
  shopMenuOpenned = false;
  $('.marketplaceBtn').addClass("selectedA");
  $('.paradiseBtn').removeClass("selectedA");

});

$('.paradiseBtn').click(function() {
  $('.marketplace').addClass("invisible");
  $('.slots').removeClass("invisible");
  $('.social').removeClass("invisible");
  $('.marketplaceBtn').removeClass("selectedA");
  $('.paradiseBtn').addClass("selectedA");
});

// Updates Owner's Slots List.
async function showSlots(ids) {
  $("#slots").empty();
  
  for(id of ids) {
    await lostParadise.methods.searchSlotById(id).call( {from: userAccount} )
    .then(async function(slot) {
      if (slot[0][1] == true) {
        var buildingId = await lostParadise.methods.slotToBuilding(+slot[1] + 1).call({from: userAccount});

        var productedByBuilding = await lostParadise.methods.returnBuildingEarnings(buildingId).call({from:userAccount}).then(res => {return res;});

        await lostParadise.methods.searchBuildingById(buildingId).call( {from: userAccount} )
        .then(function(building) {
          $("#slots").append(`
          <div class="building" value="${building[2]}">
            <i class="fas fa-times cross" id="deactivateBuilding" value="${building[2]}"></i>
            <div class="group ${building[0][7]}Type">
              <h3 class="${building[0][7]}">Building #${building[2]}</h3>
              <p class="${building[0][7]}">${building[0][7]}</p>
              <p class="${building[0][7]}">${building[0][8]}</p>
              <div class="type">
                <img src="https://gateway.pinata.cloud/ipfs/QmQzhht2me7ZvtPJMMqJGPALqws5rMQ4kScnTG4AT9gJtY/${building[0][0]}.png">
              </div>

              <div class="buildingFooter">
                <a class="boton" id="claimBtn" value="${building[2]}">Claim</a>
                <a class="boton" id="upgradeBtn" value="${building[2]}">Upgrade</a>
                <div class="buildingProductionInfo">
                  <p class="production ${building[0][7]}">${building[0][1]} LPS / HR</p>
                  <p class="production ${building[0][7]}">Max. ${building[0][4]} LPS</p>
                </div>
              </div>

              <p class="producted ${building[0][7]}" value="${building[2]}">Claimable: ${productedByBuilding} LPS / ${building[0][4]} LPS</p>
            </div>

            <div class="typeOfSlot">
              <p>Slot ${slot[1]} ~ ${slot[0][0]}</p>
            </div>
          </div>`
          );
        })
        .catch(err => errorAlert(err["message"]));
      } else {
        $("#slots").append(`
        <div class="slot" value="${slot[1]}">
          <div class="group">
            <h3 class="${slot[1]}">slot ${slot[1]}</h3>

            <div class="buildingStructure addBuilding">
              <h3>Add Building</h3>
              <i class="fas fa-plus addBuildingBtn" value="${slot[1]}"></i>
            </div>
          </div>

          <div class="typeOfSlot">
            <p>Slot ${slot[1]} ~ ${slot[0][0]}</p>
          </div>
        </div>`
        );
      }
    })
    .catch(err => errorAlert(err["message"]));
  }

  $("#slots").append(`
      <div class="slotStructure addSlot">
        <h3>Buy Slot</h3>
        <i class="fas fa-plus"></i>
      </div>`
  );

  $('.addBuildingBtn').click(function() {
    openInventoryForUse($(this).attr('value'));
  });

  $('.addSlot').click(openShop);
}

// Updates Owner's Slots List.
async function showBuildingsInInventory(ids) {
  for(id of ids) {
    await lostParadise.methods.searchBuildingById(id).call( {from: userAccount} )
    .then(function(building) {
      $("#buildings").append(`
        <div class="building invBuilding" value="${building[2]}">
          <div class="group ${building[0][7]}Type">
            <h3 class="${building[0][7]}">Building #${building[2]}</h3>
            <p class="${building[0][7]}">${building[0][7]}</p>
            <p class="${building[0][7]}">${building[0][8]}</p>
            <div class="type invBuildingType">
              <img src="https://gateway.pinata.cloud/ipfs/QmQzhht2me7ZvtPJMMqJGPALqws5rMQ4kScnTG4AT9gJtY/${building[0][0]}.png">
            </div>
            <div class="buildingFooterInv">
              <a class="boton buildingInfoBtn" id="" value="${building[2]}">Actions</a>
              <div class="buildingProductionInfo">
                <p class="production ${building[0][7]}">${building[0][1]} LPS / HR</p>
                <p class="production ${building[0][7]}">Max. ${building[0][4]} LPS</p>
              </div>
            </div>
          </div>
        </div>`
      );
    })
    .catch(err => errorAlert(err["message"]));
  }
  $('.buildingInfoBtn').click(async function() {
    $('.menu').remove();
    shopMenuOpenned = false;
  
    $('body').append(`
      <div class="menu">
          <i class="fas fa-times cross"></i>
          <h2>Building #${$(this).attr('value')}</h2>
      </div>` 
    );
  
    $('.menu').append(`
      <a class="boton transferBuildingBtn">Transfer Building</a>

      <a class="boton listOnMarketplaceButton">List on Marketplace</a>

      <a class="boton placeBuildingBtn">Place in Slot</a>

      <a class="boton upgradeBuildingBtn">Upgrade Building</a>
    `);
  
    $('.fa-times').click(function() {
      $('.menu').remove();
      shopMenuOpenned = false;
    });

    $('.transferBuildingBtn').click(() => {
      openTransferMenu($(this).attr('value'));
    })

    $('.placeBuildingBtn').click(() => {
      $('.menu').remove();
      shopMenuOpenned = false;

      warningAlert("To place a Building, First Select The Slot!");
    });

    $('.listOnMarketplaceButton').click(() => {
      $('.menu').remove();
      shopMenuOpenned = false;

      // TODO
    });

    $('.upgradeBuildingBtn').click(() => {
      $('.menu').remove();
      shopMenuOpenned = false;

      // TODO
    });
  });
  
}

// Updates Owner's Slots List.
async function showBuildingsForUse(ids) {
  for(id of ids) {
    await lostParadise.methods.searchBuildingById(id).call( {from: userAccount} )
    .then(function(building) {
      $("#buildings").append(`
        <div class="building invBuilding" value="${building[2]}">
          <div class="group ${building[0][7]}Type">
            <h3 class="${building[0][7]}">Building #${building[2]}</h3>
            <p class="${building[0][7]}">${building[0][7]}</p>
            <p class="${building[0][7]}">${building[0][8]}</p>
            <div class="type invBuildingType">
              <img src="https://gateway.pinata.cloud/ipfs/QmQzhht2me7ZvtPJMMqJGPALqws5rMQ4kScnTG4AT9gJtY/${building[0][0]}.png">
            </div>
            <div class="buildingFooter">
              <a class="boton useBuilding" id="" value="${building[2]}"><span class="SlotId" value="${$(this).attr('value')}"></span>Use</a>
              <div class="buildingProductionInfo">
                <p class="production ${building[0][7]}">${building[0][1]} LPS / HR</p>
                <p class="production ${building[0][7]}">Max. ${building[0][4]} LPS</p>
              </div>
            </div>
          </div>
        </div>`
      );
    })
    .catch(err => errorAlert(err["message"]));
  }  
}



// Retrieves Certain Building Info.
function searchBuildingById(id) {
  lostParadise.methods.searchBuildingById(id).call( {from: userAccount} )
  .catch(err => errorAlert(err["message"]));
}

// Retrieves array of Owned Buildings.
function getBuildingsByOwnerJs() {
  return lostParadise.methods.getBuildingsByOwner(userAccount).call( {from: userAccount} ).catch(err => errorAlert(err["message"]));
}

// Retrieves array of Owned Buildings.
function getSlotsByOwnerJs() {
  return lostParadise.methods.getSlotsByOwner(userAccount).call( {from: userAccount} ).catch(err => errorAlert(err["message"]));
}


// Update Buttons Based on Owner's Buildings.
function updateButtons() {

  deactivateButtons = document.querySelectorAll('#deactivateBuilding');
  deactivateButtons.forEach(button => {

    button.addEventListener('click', function() {
      if (!waitingResponce) {
        console.log(button.getAttribute('value'));
        waitingResponce = true;
        lostParadise.methods.deactivateBuilding(button.getAttribute('value'))
        .send( {from: userAccount} )
        .on('receipt', () => {
          waitingResponce = false;
        })
        .then(getSlotsByOwnerJs)
        .then(showSlots)
        .then(updateButtons)
        .catch(err => {
          errorAlert(err["message"]);
          waitingResponce = false;
        });
      } else {
        errorAlert("Pending Transaction! Please Wait.");
      }
    });

  });

  claimButtons = document.querySelectorAll('#claimBtn');
  claimButtons.forEach(button => {

    button.addEventListener('click', function() {
      if (!waitingResponce) {
        waitingResponce = true;
        lostParadise.methods.withdrawBuildingEarnings(button.getAttribute('value'))
        .send( {from: userAccount} )
        .on('receipt', () => {
          waitingResponce = false;
        })
        .then(getSlotsByOwnerJs)
        .then(showSlots)
        .then(updateButtons)
        .catch(err => {
          errorAlert(err["message"]);
          waitingResponce = false;
        });
      } else {
        errorAlert("Pending Transaction! Please Wait.");
      }
    });

  });

  upgradeButtons = document.querySelectorAll('#claimBtn');
  upgradeButtons.forEach(button => {

    button.addEventListener('click', function() {
      if (!waitingResponce) {
        waitingResponce = true;
        lostParadise.methods.withdrawBuildingEarnings(button.getAttribute('value'))
        .send( {from: userAccount} )
        .on('receipt', () => {
          waitingResponce = false;
        })
        .then(getSlotsByOwnerJs)
        .then(showSlots)
        .then(updateButtons)
        .catch(err => {
          errorAlert(err["message"]);
          waitingResponce = false;
        });
      } else {
        errorAlert("Pending Transaction! Please Wait.");
      }
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
    .catch(err => errorAlert(err["message"]));
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
    .catch(err => errorAlert(err["message"]));
  })

  setTimeout(checkStartedTime, 5000);
}

// Shop Menu Opening
$('#shopBtn').click(async function() {
  openShop();
});

$('#inventoryBtn').click(async function() {
  openInventory();
});

async function openInventory() {
  if (!shopMenuOpenned) {
    shopMenuOpenned = true;

    $('body').append(`
      <div class="menu inventory invMenu">
          <i class="fas fa-times cross closeInventory"></i>
          <h2>Inventory</h2>

          <div id="buildings"></div>
      </div>` 
    );

    await lostParadise.methods.getBuildingsByOwner(userAccount).call({from: userAccount})
    .then(showBuildingsInInventory);

    $('.closeInventory').click(function() {
      $('.menu').remove();
      shopMenuOpenned = false;
    });
  } else {
    $('.menu').remove();
    shopMenuOpenned = false;
    openInventory();
  }
}

async function openInventoryForUse(slotId) {
  if (!shopMenuOpenned) {
    shopMenuOpenned = true;

    $('body').append(`
      <div class="menu inventory invMenu">
          <i class="fas fa-times cross closeInventory"></i>
          <h2>Inventory</h2>

          <div id="buildings" value="${slotId}"></div>
      </div>` 
    );

    await lostParadise.methods.getBuildingsByOwner(userAccount).call({from: userAccount})
    .then(showBuildingsForUse);

    $('.useBuilding').click(async function() {
      $('.menu').remove();
      shopMenuOpenned = false;
    
      if (!waitingResponce) {
        console.log(slotId);
        lostParadise.methods.useBuilding($(this).attr('value'), slotId).send({ from: userAccount })
        .on("receipt", () => {
          successAlert("Building Set as Used!");
          $('.menu').remove();
          shopMenuOpenned = false;
        })
        .then(getSlotsByOwnerJs)
        .then(showSlots)
        .then(updateButtons)
        .then(() => waitingResponce = false)
        .catch(err => {
          errorAlert(err["message"])
          waitingResponce = false;
        });
      } else {
        warningAlert("Transaction Pending!");
      }
    });

    $('.closeInventory').click(function() {
      $('.menu').remove();
      shopMenuOpenned = false;
    });
  } else {
    $('.menu').remove();
    shopMenuOpenned = false;
    openInventoryForUse(slotId);
  }
}

async function openShop() {
  if (!shopMenuOpenned) {
    shopMenuOpenned = true;

    $('body').append(`
      <div class="menu">
          <i class="fas fa-times cross"></i>
          <h2>Shop Menu</h2>
      </div>` 
    );

    var allowance = await lostParadise.methods.getAccountCurrencyAllowance().call({from: userAccount}).catch(err => errorAlert(err["message"]));
    if (allowance > 0) {
      $('.menu').append(`
        <a class="boton buySlotBtn">Buy Slot<br><span class="price">5000 LPS</span></a>

        <a class="boton mintBuildingButton">Mint Building<br><span class="price">10000 LPS</span></a>
      `);

      $('.buySlotBtn').click(function() {
        mintSlot();
      }); //TODO
  
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
    $('.menu').remove();
    shopMenuOpenned = false;
    openShop();
  }
}

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
    $('.menu').remove();
    transferMenuOpenned = false;
    openTransferMenu();
  }

  $('.transferButton').click(function() {
    if (!waitingResponce) {
      waitingResponce = true;
      lostParadise.methods.transferFrom(userAccount, $('#addressTo').val(), buildingId).send({ from: userAccount })
      .on('receipt', function() {
        successAlert(`Building #${buildingId} Transfered Successfully!`);
        $('.menu').remove();
        shopMenuOpenned = false;
      })
      .then(getSlotsByOwnerJs)
      .then(showSlots)
      .then(() => waitingResponce = false)
      .catch(err => {
        errorAlert(err["message"])
        waitingResponce = false;
      });

    } else {
      errorAlert("Pending Transaction! Please Wait.");
    }
  });

}


// Check Metamask Account Change
window.ethereum.on('accountsChanged', function (accounts) {
  window.location.reload();
  warningAlert("Account Changed!");
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
});


// Update Buildings Generated Income
async function updateClaimableEarnings() {
  var claimableTexts = document.querySelectorAll('.producted');

  claimableTexts.forEach(text => {
    lostParadise.methods.returnBuildingEarnings(text.getAttribute('value')).call({from: userAccount}).then(res => {text.innerText = `Claimable: ${res} LPS ${text.innerText.slice(text.innerText.search("/"), text.innerText.length)}`});
  } )

  setTimeout(updateClaimableEarnings, 3000);
}