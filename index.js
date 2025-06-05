const express = require("express");
const { ethers } = require("ethers");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/frame", async (req, res) => {
  try {
    const tx = await wallet.sendTransaction({
      to: wallet.address, // отправка самому себе
      value: ethers.parseEther("0") // пустая транзакция
    });
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Ошибка при отправке транзакции:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/manifest", (req, res) => {
  res.json({
    name: "Send Monad TX",
    description: "Minimal app to send a Monad test tx",
    icon: `${process.env.APP_URL}/icon.png`,
    url: `${process.env.APP_URL}`
  });
});

app.listen(port, () => {
  console.log(`Farcaster miniapp running at http://localhost:${port}`);
});
