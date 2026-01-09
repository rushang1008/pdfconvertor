-- Add storage policy for guest uploads (temporary files)
CREATE POLICY "Service role can manage all files"
ON storage.objects FOR ALL
USING (bucket_id = 'user-files')
WITH CHECK (bucket_id = 'user-files');

-- Allow guest uploads to the guest folder
CREATE POLICY "Anyone can upload to guest folder"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'user-files' AND (storage.foldername(name))[1] = 'guest');

-- Allow anyone to read guest files (for processing)
CREATE POLICY "Anyone can read guest files"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-files' AND (storage.foldername(name))[1] = 'guest');