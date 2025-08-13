-- Create table for legal documents
CREATE TABLE public.legal_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL UNIQUE, -- 'privacy_policy', 'terms_of_service', 'public_offer'
  title VARCHAR(200) NOT NULL,
  file_url TEXT,
  file_name VARCHAR(200),
  content TEXT, -- for fallback text content
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

-- Create policies (public read access)
CREATE POLICY "Anyone can view legal documents" 
ON public.legal_documents 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert legal documents" 
ON public.legal_documents 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update legal documents" 
ON public.legal_documents 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete legal documents" 
ON public.legal_documents 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_legal_documents_updated_at
BEFORE UPDATE ON public.legal_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for legal documents
INSERT INTO storage.buckets (id, name, public) VALUES ('legal-documents', 'legal-documents', true);

-- Create policies for legal documents uploads
CREATE POLICY "Legal documents are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'legal-documents');

CREATE POLICY "Anyone can upload legal documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'legal-documents');

CREATE POLICY "Anyone can update legal documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'legal-documents');

CREATE POLICY "Anyone can delete legal documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'legal-documents');

-- Insert default records
INSERT INTO public.legal_documents (type, title, content) VALUES 
('privacy_policy', 'Политика конфиденциальности', 'Политика конфиденциальности будет доступна после загрузки документа через админ-панель.'),
('terms_of_service', 'Пользовательское соглашение', 'Пользовательское соглашение будет доступно после загрузки документа через админ-панель.'),
('public_offer', 'Публичная оферта', 'Публичная оферта будет доступна после загрузки документа через админ-панель.');