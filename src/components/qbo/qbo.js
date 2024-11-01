import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export const getStoredToken = async () => {
    // To get the directory name in an ES module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const filePath = path.join(__dirname, 'token.json');
    
    try {
      const data = await readFile(filePath, 'utf8');
      const jsonData = JSON.parse(data);
      console.log(jsonData); // Logs the JSON data
      return jsonData;
    } catch (error) {
      console.error('Error reading or parsing file:', error);
    }

}
