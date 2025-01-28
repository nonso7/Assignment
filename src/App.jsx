import { useState } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";
import "./App.css";

function App() {
  const [userInput, setUserInput] = useState(""); // User input for deposit amount
  const [retrievedBalance, setRetrievedBalance] = useState(""); // Retrieved balance from the contract
  const [statusMessage, setStatusMessage] = useState(""); // Status message to show deposit or error messages
  const contractAddress = "0xB473EAcebc96437D20E39c5C42441D0818F985B7";

  // Request accounts from Metamask
  async function requestAccounts() {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      setStatusMessage("Please connect to Metamask.");
      console.error("Error connecting to Metamask:", error);
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
        // Ensure input is a valid number
        if (!userInput || isNaN(userInput) || Number(userInput) <= 0) {
          setStatusMessage("Please enter a valid deposit amount.");
          return;
        }

        const tx = await myContract.deposit(ethers.parseUnits(userInput, "ether"));
        await tx.wait();
        setStatusMessage(`Deposited ${userInput} ETH successfully.`);
      } catch (err) {
        setStatusMessage("Deposit failed. See console for details.");
        alert("Deposit error:", err);
      }
    } else {
      setStatusMessage("Metamask is not installed.");
    }
  }

  // Get user balance from the smart contract
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
        alert("Balance retrieval error:", err);
      }
    } else {
      setStatusMessage("Metamask is not installed.");
    }
  }

  return (
    <div className="App">
      <h1>Ethereum Smart Contract Interaction</h1>

      {/* Deposit Section */}
      <div className="deposit-section">
        <h2>Deposit ETH</h2>
        <input
          type="text"
          placeholder="Enter deposit amount in ETH"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button onClick={Deposited}>Deposit</button>
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
