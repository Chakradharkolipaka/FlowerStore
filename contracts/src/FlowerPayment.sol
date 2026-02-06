// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title FlowerPayment
/// @notice Simple payment contract for the FlowerStore app
/// @dev Accepts ETH payments and forwards them to the owner
contract FlowerPayment {
    address public immutable owner;
    uint256 public totalPayments;

    event PaymentReceived(
        address indexed from,
        uint256 amount,
        uint256 timestamp
    );
    event Withdrawal(address indexed to, uint256 amount);

    error TransferFailed();
    error OnlyOwner();
    error ZeroAmount();

    /// @notice Contract constructor sets the owner address
    /// @param _owner The address that will receive all payments
    constructor(address _owner) {
        require(_owner != address(0), "Owner cannot be zero address");
        owner = _owner;
    }

    /// @notice Pay for flowers - forwards ETH to owner immediately
    /// @dev Anyone can call this to make a payment
    function payForFlowers() external payable {
        if (msg.value == 0) revert ZeroAmount();

        totalPayments++;

        emit PaymentReceived(msg.sender, msg.value, block.timestamp);

        // Forward payment to owner immediately
        (bool success, ) = owner.call{value: msg.value}("");
        if (!success) revert TransferFailed();
    }

    /// @notice Fallback function to accept direct ETH transfers
    receive() external payable {
        if (msg.value > 0) {
            totalPayments++;
            emit PaymentReceived(msg.sender, msg.value, block.timestamp);

            (bool success, ) = owner.call{value: msg.value}("");
            if (!success) revert TransferFailed();
        }
    }

    /// @notice Get contract balance (should always be 0 since we forward immediately)
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
