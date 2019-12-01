pragma solidity ^0.5.1;

contract Verity {
    address payable public seller;
    address public institution;
    address payable public owner;
    
    uint private sum; 

    uint256 public docHash;
    bool public validity = false;
    
    event hashAdded(uint256 hash);
    event hashValid(bool valid);
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _; 
    }
    modifier onlySeller() {
        require(msg.sender == seller);
        _; 
    }
    modifier onlyInstitution() {
        require(msg.sender == institution);
        _; 
    }
    
    modifier filledAddress() {
        require(seller!=address(0) &&
                institution!= address(0));
        _;
    }
    
    modifier aptHash(){ 
      require(docHash != 0);
      _; 
    } 
    
    constructor() public {
        owner = msg.sender;
    }

    function deploy(address payable _seller,  address _institution) public payable{
        seller = _seller;
        institution = _institution;
        sum = msg.value; 
    }
    
    // Allows seller to set hash of the document imported to IPFS and emit
    function setHash(uint256 _docHash) public onlySeller filledAddress{
        docHash = _docHash; 
        emit hashAdded(_docHash);
    }
    
    // Institution validates the hash (pointing to the document) and emit
    function validate(bool _validity) public onlyInstitution filledAddress aptHash returns(bool){
        emit hashValid(validity = _validity);
        if(validity){
            seller.transfer(sum);
        } else {
            owner.transfer(sum); 
        }
        sum=0; 
    }
        
        
    
    // Proceed with the bank's transaction
    function proceedTransfer() public payable onlyOwner{
        if(validity){
            seller.transfer(sum);
        } else {
            owner.transfer(sum); 
        }
        sum=0; 
        selfdestruct(owner);
    }
    
    // Setters restricted only to Owner
    function setSeller(address payable  _seller) public onlyOwner {
        seller = _seller;
    }
    
    function setInstitution(address _institution) public onlyOwner{
        institution = _institution;
    }
     
    
}


