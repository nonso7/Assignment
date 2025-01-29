import { useState } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const [depositAmount, setDepositAmount] = useState(""); // Separate state for deposit
  const [withdrawAmount, setWithdrawAmount] = useState(""); // Separate state for withdrawal
  const [retrievedBalance, setRetrievedBalance] = useState(""); // Retrieved balance from the contract
  const [statusMessage, setStatusMessage] = useState(""); // Status message for user feedback
  //const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS ;
  const contractAddress = "0xB473EAcebc96437D20E39c5C42441D0818F985B7";

  // Request accounts from Metamask
  async function requestAccounts() {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      setStatusMessage("Please connect to Metamask.");
      toast.error("Error connecting to Metamask:", error);
    }
  }

  // Deposit function
  async function Deposited() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const myContract = new ethers.Contract(contractAddress, abi, signer);

      try {
        // Ensure deposit input is a valid number
        if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
          setStatusMessage("Please enter a valid deposit amount.");
          return;
        }

        const tx = await myContract.deposit(
          ethers.parseUnits(depositAmount, "ether")
        );
        await tx.wait();
        setStatusMessage(`Deposited ${depositAmount} ETH successfully.`);
        setDepositAmount(""); // Clear the input field after successful deposit
      } catch (err) {
        setStatusMessage("Deposit failed. See console for details.");
        toast.error("Deposit error:", err);
      }
    } else {
      setStatusMessage("Metamask is not installed.");
    }
  }

  // Withdraw function
  async function Withdraw() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const myContract = new ethers.Contract(contractAddress, abi, signer);

      try {
        // Ensure withdraw input is a valid number
        if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
          setStatusMessage("Please enter a valid withdrawal amount.");
          return;
        }

        const tx = await myContract.withdraw(
          ethers.parseUnits(withdrawAmount, "ether")
        );
        await tx.wait();
        setStatusMessage(`Withdrawn ${withdrawAmount} ETH successfully.`);
        setWithdrawAmount(""); // Clear the input field after successful withdrawal
      } catch (err) {
        setStatusMessage("Withdrawal failed. See console for details.");
        toast.error("Withdrawal error:", err);
      }
    } else {
      setStatusMessage("Metamask is not installed.");
    }
  }

  // Get user balance
  async function userBalance() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const myContract = new ethers.Contract(contractAddress, abi, provider);

      try {
        const balance = await myContract.balance();
        setRetrievedBalance(ethers.formatEther(balance)); // Convert from Wei to ETH
        setStatusMessage("Balance retrieved successfully.");
      } catch (err) {
        setStatusMessage("Failed to retrieve balance. See console for details.");
        console.error("Balance retrieval error:", err);
      }
    } else {
      setStatusMessage("Metamask is not installed.");
    }
  }

  return (
    <div className="App">
      <h1>Ethereum Smart Contract Interaction</h1>
      <ToastContainer position="top-right" autoClose={300} hideProgressBar />

      <p>Connected Wallet: {contractAddress}</p>

      {/* Deposit Section */}
      <div className="deposit-section">
        <h2>Deposit ETH</h2>
        <input
          type="text"
          placeholder="Enter deposit amount in ETH"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />
        <button onClick={Deposited}>Deposit</button>
      </div>

      {/* Withdraw Section */}
      <div className="withdraw-section">
        <h2>Withdraw ETH</h2>
        <input
          type="text"
          placeholder="Enter withdrawal amount in ETH"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
        <button onClick={Withdraw}>Withdraw</button>
      </div>

      {/* Balance Section */}
      <div className="balance-section">
        <h2>Check Balance</h2>
        <button onClick={userBalance}>Get Balance</button>
        {retrievedBalance && <p>Retrieved Balance: {retrievedBalance} ETH</p>}
      </div>

      {/* Status Messages */}
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
}

export default App;


//reading use provider
//writing use signer
