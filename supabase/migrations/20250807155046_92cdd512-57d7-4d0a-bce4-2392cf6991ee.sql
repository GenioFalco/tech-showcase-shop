-- Delete existing conflicting policies if any
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update product images" ON storage.objects;  
DROP POLICY IF EXISTS "Anyone can delete product images" ON storage.objects;

-- Create correct policies for product-images bucket
CREATE POLICY "Public Access - View product images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Public Access - Upload product images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public Access - Update product images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'product-images');

CREATE POLICY "Public Access - Delete product images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'product-images');