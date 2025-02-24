import qboClient from '../qbo/index.js';

export const qboAuth = async (req, res) => {
  try {
    const protocol = req.protocol;
    const host = req.get('host');
    const fullUrl = `${protocol}://${host}${req.url}`;
    console.log('Received callback at URL:', fullUrl);
    
    const tokens = await qboClient.handleCallback(fullUrl);
    const nonce = res.locals.nonce; // Use nonce from middleware

    res.send(`
      <html>
        <body>
          <script nonce="${nonce}">
            const tokens = ${JSON.stringify(tokens)};
            if (window.opener) {
              window.opener.postMessage({ type: 'QBO_AUTH_SUCCESS', tokens }, 'http://localhost:5173');
            }
            window.close();
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error in callback:', error);
    
    const nonce = res.locals.nonce; // Use nonce from middleware

    res.send(`
      <html>
        <body>
          <script nonce="${nonce}">
            const errorMessage = ${JSON.stringify(error.message)};
            if (window.opener) {
              window.opener.postMessage({ type: 'QBO_AUTH_ERROR', error: errorMessage }, 'http://localhost:5173');
            }
            window.close();
          </script>
        </body>
      </html>
    `);
  }
}