// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/FlowerPayment.sol";

contract DeployFlowerPayment is Script {
    function run() external returns (FlowerPayment) {
        // Owner address where all payments will be sent
        address owner = 0x1BeB7894f17024A1D5f3D5aa079aCAE180e0fc4E;

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        FlowerPayment payment = new FlowerPayment(owner);

        console.log("FlowerPayment deployed to:", address(payment));
        console.log("Owner address:", payment.owner());
        console.log("Deployer:", vm.addr(deployerPrivateKey));

        vm.stopBroadcast();

        return payment;
    }
}
