// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../../factory/libraries/Math.sol';

contract MathTest {
    using Math for uint256;

    function min(uint x, uint y) external pure returns (uint z) {
        z= x.min(y);
    }

    function sqrt(uint y) external pure returns (uint z) {
        z = y.sqrt();
    }
}