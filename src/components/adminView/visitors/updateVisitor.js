import { writeFile, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Custom deep merge function
function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

export async function updateVisitor(req, res) {
  console.log("** updateVisitor **");
  const newVisitorId = req.body.id;
  const newVisitorData = req.body.data;

  const filePath = join(__dirname, 'visitors.json');

  try {
    let fileData = '{}';
    try {
      fileData = await readFile(filePath, 'utf8');
    } catch (readErr) {
      console.warn('File not found, creating a new one...');
    }

    const visitors = JSON.parse(fileData);

    // Deep merge existing visitor data with new data
    visitors[newVisitorId] = deepMerge(visitors[newVisitorId] || {}, newVisitorData);

    await writeFile(filePath, JSON.stringify(visitors, null, 2));

    if (res) {
      res.status(200).json({ message: 'Visitor data saved successfully' });
    }
  } catch (err) {
    console.error('Error writing to file:', err);
    if (res) {
      res.status(500).json({ message: 'Failed to save visitor data' });
    }
  }
}
