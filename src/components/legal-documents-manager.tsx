import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, Trash2 } from "lucide-react";

interface LegalDocument {
  id: string;
  type: string;
  title: string;
  file_url?: string;
  file_name?: string;
  content?: string;
  created_at: string;
  updated_at: string;
}

const LegalDocumentsManager = () => {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);

  const documentTypes = [
    { type: 'privacy_policy', title: 'Политика конфиденциальности' },
    { type: 'terms_of_service', title: 'Пользовательское соглашение' },
    { type: 'public_offer', title: 'Публичная оферта' }
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .order('type');
      
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить документы",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (type: string, file: File) => {
    if (!file) return;

    // Check if file is a Word document
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/pdf'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Неверный формат файла",
        description: "Пожалуйста, загрузите документ в формате Word (.docx, .doc) или PDF",
        variant: "destructive",
      });
      return;
    }

    setUploading(type);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('legal-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('legal-documents')
        .getPublicUrl(fileName);

      const documentTitle = documentTypes.find(doc => doc.type === type)?.title || type;

      const { error: updateError } = await supabase
        .from('legal_documents')
        .upsert({
          type,
          title: documentTitle,
          file_url: publicUrl,
          file_name: file.name,
          content: null
        }, {
          onConflict: 'type'
        });

      if (updateError) throw updateError;

      toast({
        title: "Успешно",
        description: "Документ загружен",
      });

      fetchDocuments();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить файл",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleDeleteDocument = async (type: string) => {
    try {
      const document = documents.find(doc => doc.type === type);
      if (!document) return;

      // Delete file from storage if exists
      if (document.file_url) {
        const fileName = document.file_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('legal-documents')
            .remove([fileName]);
        }
      }

      // Reset document to default content
      const documentTitle = documentTypes.find(doc => doc.type === type)?.title || type;
      
      const { error } = await supabase
        .from('legal_documents')
        .update({
          file_url: null,
          file_name: null,
          content: `${documentTitle} будет доступна после загрузки документа через админ-панель.`
        })
        .eq('type', type);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Документ удален",
      });

      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить документ",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление юридическими документами</h2>
      </div>

      <div className="grid gap-6">
        {documentTypes.map(({ type, title }) => {
          const document = documents.find(doc => doc.type === type);
          const isUploading = uploading === type;

          return (
            <Card key={type}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {title}
                </CardTitle>
                <CardDescription>
                  {document?.file_url ? 
                    `Файл: ${document.file_name}` : 
                    'Документ не загружен'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".doc,.docx,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(type, file);
                      }
                    }}
                    disabled={isUploading}
                    className="flex-1"
                  />
                  
                  {document?.file_url && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteDocument(type)}
                      disabled={isUploading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {isUploading && (
                  <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                    <Upload className="h-4 w-4 animate-pulse" />
                    Загрузка...
                  </div>
                )}
                
                {document?.file_url && (
                  <div className="mt-2">
                    <a
                      href={document.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Открыть документ
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export { LegalDocumentsManager };