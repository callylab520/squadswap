module.exports = {
  skipFiles: [
    '/libs/token/BEP20/BEP20.sol',
    '/libs/access/Ownable.sol',
    '/libs/math/SafeMath.sol',
    '/libs/utils/Address.sol',
    '/libs/utils/AddressStringUtil.sol',
    '/libs/utils/Create2.sol',
    '/libs/utils/EnumerableSet.sol',
    '/libs/utils/FixedPoint.sol',
    '/libs/utils/Memory.sol',
    '/libs/utils/PairNamer.sol',
    '/libs/utils/ReentrancyGuard.sol',
    '/libs/utils/SafeBEP20Namer.sol',
    '/libs/utils/TransferHelper.sol',
    '/libs/GSN/Context.sol',
    '/router/test/TransferHelper.sol',
    '/router/test/ERC20.sol',
    '/router/test/WETH9.sol',

  ],
  configureYulOptimizer: true,
  solcOptimizerDetails: {
    yul: true,
  },
};
