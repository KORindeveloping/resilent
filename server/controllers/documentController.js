const supabase = require('../lib/supabase');
const fs = require('fs');
const path = require('path');

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}${fileExt}`;
    const filePath = file.path;

    // 1. Upload to Supabase Storage
    const fileBuffer = fs.readFileSync(filePath);
    const { data: storageData, error: storageError } = await supabase.storage
      .from('documents')
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (storageError) throw storageError;

    // 2. Get Public URL (Correct extraction)
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    const publicUrl = data.publicUrl;

    console.log('Generated Public URL:', publicUrl);

    // 3. Save to PostgreSQL
    const { data: dbData, error: dbError } = await supabase
      .from('documents')
      .insert([
        { 
          title: file.originalname, 
          file_url: publicUrl 
        }
      ])
      .select();

    if (dbError) throw dbError;

    // Clean up local file
    fs.unlinkSync(filePath);

    res.status(201).json({
      message: 'Upload successful',
      document: dbData[0]
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.viewDocument = async (req, res) => {
  try {
    const { filename } = req.params;

    // Download from Supabase Storage
    const { data, error } = await supabase.storage
      .from('documents')
      .download(filename);

    if (error) throw error;

    // Set headers for inline viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    
    // Convert Blob to Buffer and send
    const buffer = Buffer.from(await data.arrayBuffer());
    res.send(buffer);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Error loading document');
  }
};
