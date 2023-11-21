pragma solidity =0.5.16;

import '../../factory/SquadswapERC20.sol';

contract SquadswapERC20Test is SquadswapERC20 {
    function mint(address to, uint value) public {
        _mint(to, value);
    }
}