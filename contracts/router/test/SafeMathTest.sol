pragma solidity ^0.8.0;

import '../libraries/SafeMath.sol';

contract SafeMathTest {
    using SafeMath for uint256;

    function add(uint x, uint y) external pure returns (uint z) {
        z= x.add(y);
    }
}