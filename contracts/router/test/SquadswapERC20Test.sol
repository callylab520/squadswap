// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../../factory/SquadswapERC20.sol';

contract SquadswapERC20Test is SquadswapERC20 {
    function mint(address to, uint value) public {
        _mint(to, value);
    }
}