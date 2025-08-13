import { useEffect, useState } from "react";
import { SimpleNavigation } from "@/components/simple-navigation";
import { Footer } from "@/components/footer";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const TermsOfService = () => {
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const { data, error } = await supabase
          .from('legal_documents')
          .select('*')
          .eq('type', 'terms_of_service')
          .single();
        
        if (error) throw error;
        setDocument(data);
      } catch (error) {
        console.error('Error fetching terms of service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SimpleNavigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-foreground mb-8">
                {document?.title || 'Пользовательское соглашение'}
              </h1>
              
              {document?.file_url ? (
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <p className="text-muted-foreground mb-4">
                    Документ доступен для скачивания:
                  </p>
                  <a 
                    href={document.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Скачать документ ({document.file_name})
                  </a>
                </div>
              ) : (
                <div className="bg-card rounded-lg p-6 shadow-sm">
                  <div className="prose prose-slate max-w-none text-foreground">
                    {document?.content?.split('\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;