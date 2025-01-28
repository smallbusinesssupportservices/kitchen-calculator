import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the current file path in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Update the visitor settings
export async function updateVisitor(req, res) {
  const newVisitorId = req.body.id; // Assuming the visitor ID is passed in the body
  const newVisitorData = req.body.data; // The visitor's data to update or add

  // Path to the JSON file
  const filePath = join(__dirname, 'visitors.json');

  try {
    // Read the existing data from the JSON file
    let fileData = '{}'; // Default to an empty object if the file doesn't exist
    try {
      fileData = await readFile(filePath, 'utf8');
    } catch (readErr) {
      console.warn('File not found, creating a new one...');
    }

    // Parse the existing data
    const visitors = JSON.parse(fileData);

    // Update the visitor data or add if new
    visitors[newVisitorId] = {
      ...(visitors[newVisitorId] || {}), // Preserve existing data for this visitor if it exists
      ...newVisitorData, // Update with new data
    };

    // Write the updated visitors data back to the file
    await writeFile(filePath, JSON.stringify(visitors, null, 2));

    // res.status(200).json({ message: 'Visitor data saved successfully' });
  } catch (err) {
    console.error('Error writing to file:', err);
    res.status(500).json({ message: 'Failed to save visitor data' });
  }
}
