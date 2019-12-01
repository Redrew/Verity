// Seller: 0xce66a9ed4f008B93b472C1c9d1B355D41C37dF68            2
// Institution: 0x445a1b242F56C2CD48419DE5b4252eD0ee464c57            3
App = {
  web3Provider: null,
  contracts: {},
  node: null,

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('verity.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var VerityArtifact = data;
      App.contracts.Verity = TruffleContract(VerityArtifact);
    
      // Set the provider for our contract
      App.contracts.Verity.setProvider(App.web3Provider);
    
      var verifyInstance;
      App.contracts.Verity.deployed().then(function(instance) {
        verifyInstance = instance;
        console.log(verifyInstance.owner());
      });

    });
  },

  uploadFile: function() {
    var hash = $("#hash_input").val();
    App.contracts.Verity.deployed().then(function(instance) {
      instance.setHash(hash);
      console.log(instance.docHash());
    });
  },

  deploy: function() {
    var ins=$("#institute").val();
    var rec = $("#receiver").val();
    var ether = $("#ether").val();
    console.log(ins + rec + "   " + ether)
    App.contracts.Verity.deployed().then(function(instance) {
      instance.deploy(rec,ins, {value: web3.toWei(ether, "ether")});
    })
  },
  
  verify: function() {
    App.contracts.Verity.deployed().then(function(instance) {
      instance.validate(true)
    })
  },

  deny: function() {
    App.contracts.Verity.deployed().then(function(instance) {
      instance.validate(false)
    })
  }

  }

$(function() {
  $(window).load(function() {
    App.init();
  });
});
