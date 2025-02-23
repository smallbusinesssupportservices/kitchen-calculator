import QRCode from 'qrcode';

export const generateQR = async (req, res) => {
  try {
    const { role } = req.params;
    const baseUrl = process.env.VITE_BASE_URL || 'http://localhost:5173';
    const vcfUrl = `${baseUrl}/team/${role}/vcf`;
    
    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(vcfUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'image/png');
    
    // Convert data URL to buffer and send
    const qrBuffer = Buffer.from(qrCode.split(',')[1], 'base64');
    res.send(qrBuffer);
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).send('Error generating QR code');
  }
}