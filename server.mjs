const express = require('express');
const { ethers } = require('ethers');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const walletAddress = process.env.WALLET;
const minAmount = process.env.MIN_AMOUNT;  // El monto mínimo de WLD que debe recibir

// Ruta para verificar si se recibió un pago
app.get('/check-payment', async (req, res) => {
  try {
    const balance = await provider.getBalance(walletAddress);
    
    if (balance.gte(minAmount)) {
      return res.status(200).json({ success: true, message: 'Pago recibido, puedes proceder con la descarga.' });
    } else {
      return res.status(400).json({ success: false, message: 'El pago no es suficiente.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error verificando el pago.' });
  }
});

// Ruta para enviar el enlace de descarga del XAPK después del pago
app.get('/get-xapk', (req, res) => {
  const xapkUrl = 'https://wld.com.ar/vieja.xapk'; // URL de tu archivo XAPK

  res.status(200).json({ success: true, xapkUrl });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
