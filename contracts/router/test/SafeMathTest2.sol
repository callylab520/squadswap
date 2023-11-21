pragma solidity =0.5.16;

import '../../factory/libraries/SafeMath.sol';

contract SafeMathTest2 {
    using SafeMath for uint256;

    function add(uint x, uint y) public pure returns (uint z) {
        z = x.add(y);
    }

    function sub(uint x, uint y) public pure returns (uint z) {
        z = x.sub(y);
    }

    function mul(uint x, uint y) public pure returns (uint z) {
        z = x.mul(y);
    }
}