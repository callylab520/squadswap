// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ISquadswapMigrator {
    function migrate(address token, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external;
}