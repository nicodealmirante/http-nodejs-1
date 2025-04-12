import express from 'express';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// __dirname simulado para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dirección y red a chequear
const RECEIVER = '0x1f62e7890d5db2c94c280547876b050f5d1816c5';
const REQUIRED_AMOUNT = ethers.utils.parseUnits('1', 18); // 1 WLD

const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);

// 🔒 Validación simple por address
app.get('/validate/:wallet', async (req, res) => {
  const wallet = req.params.wallet.toLowerCase();
  try {
    const history = await provider.getHistory(wallet);
    const valid = history.some(tx =>
      tx.to?.toLowerCase() === RECEIVER.toLowerCase() &&
      tx.value.gte(REQUIRED_AMOUNT)
    );

    if (valid) {
      res.json({ success: true, download: `${process.env.HOST}/vieja.xapk` });
    } else {
      res.json({ success: false, reason: 'No se encontró el pago' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📦 Servir archivo XAPK
app.get('/vieja.xapk', (req, res) => {
  const filePath = path.join(__dirname, 'vieja.xapk');
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Backend activo en http://localhost:${PORT}`);
});
