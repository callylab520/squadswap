pragma solidity ^0.8.0;

interface ISquadswapCallee {
    function squadswapCall(address sender, uint amount0, uint amount1, bytes calldata data) external;
}
