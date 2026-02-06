// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/FlowerPayment.sol";

contract FlowerPaymentTest is Test {
    FlowerPayment public payment;
    address public owner = 0x1BeB7894f17024A1D5f3D5aa079aCAE180e0fc4E;
    address public buyer = 0x68f76F3dc59A8BB6905EbcE963F1eA556733E0fA;

    event PaymentReceived(
        address indexed from,
        uint256 amount,
        uint256 timestamp
    );

    function setUp() public {
        payment = new FlowerPayment(owner);

        // Fund the buyer account for testing
        vm.deal(buyer, 10 ether);
    }

    function test_ConstructorSetsOwner() public {
        assertEq(payment.owner(), owner);
    }

    function test_InitialTotalPayments() public {
        assertEq(payment.totalPayments(), 0);
    }

    function test_PayForFlowersForwardsToOwner() public {
        uint256 paymentAmount = 0.000001 ether;
        uint256 ownerBalanceBefore = owner.balance;

        vm.prank(buyer);
        payment.payForFlowers{value: paymentAmount}();

        // Owner should receive the payment
        assertEq(owner.balance, ownerBalanceBefore + paymentAmount);

        // Contract balance should be 0 (forwarded immediately)
        assertEq(address(payment).balance, 0);

        // Total payments incremented
        assertEq(payment.totalPayments(), 1);
    }

    function test_PayForFlowersEmitsEvent() public {
        uint256 paymentAmount = 0.000001 ether;

        vm.expectEmit(true, false, false, true);
        emit PaymentReceived(buyer, paymentAmount, block.timestamp);

        vm.prank(buyer);
        payment.payForFlowers{value: paymentAmount}();
    }

    function test_MultiplePayments() public {
        uint256 paymentAmount = 0.000001 ether;
        uint256 ownerBalanceBefore = owner.balance;

        // Make 3 payments
        for (uint i = 0; i < 3; i++) {
            vm.prank(buyer);
            payment.payForFlowers{value: paymentAmount}();
        }

        assertEq(owner.balance, ownerBalanceBefore + (paymentAmount * 3));
        assertEq(payment.totalPayments(), 3);
    }

    function test_ReceiveFunctionWorks() public {
        uint256 paymentAmount = 0.000001 ether;
        uint256 ownerBalanceBefore = owner.balance;

        // Send ETH directly to contract
        vm.prank(buyer);
        (bool success, ) = address(payment).call{value: paymentAmount}("");

        assertTrue(success);
        assertEq(owner.balance, ownerBalanceBefore + paymentAmount);
        assertEq(payment.totalPayments(), 1);
    }

    function test_RevertOnZeroPayment() public {
        vm.prank(buyer);
        vm.expectRevert(FlowerPayment.ZeroAmount.selector);
        payment.payForFlowers{value: 0}();
    }

    function test_RevertOnZeroAddressOwner() public {
        vm.expectRevert("Owner cannot be zero address");
        new FlowerPayment(address(0));
    }

    function testFuzz_PaymentAmounts(uint96 amount) public {
        vm.assume(amount > 0);

        uint256 ownerBalanceBefore = owner.balance;

        vm.deal(buyer, amount);
        vm.prank(buyer);
        payment.payForFlowers{value: amount}();

        assertEq(owner.balance, ownerBalanceBefore + amount);
        assertEq(address(payment).balance, 0);
    }

    function test_GetBalance() public {
        assertEq(payment.getBalance(), 0);

        vm.prank(buyer);
        payment.payForFlowers{value: 0.000001 ether}();

        // Still 0 since funds are forwarded immediately
        assertEq(payment.getBalance(), 0);
    }
}
