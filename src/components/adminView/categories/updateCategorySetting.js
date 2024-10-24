import { writeFile } from 'fs/promises';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the current file path in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Update the calculator settings
export async function updateCategorySetting(req, res) {
  const updatedSettings = req.body;

  // Path to the JSON file
  const filePath = join(__dirname, 'categoryMinimums.json');

  try {
    // Write the updated settings to the JSON file
    await writeFile(filePath, JSON.stringify(updatedSettings, null, 2));
    res.status(200).json({ message: 'Settings saved successfully' });
  } catch (err) {
    console.error('Error writing to file:', err);
    res.status(500).json({ message: 'Failed to save settings' });
  }
}
