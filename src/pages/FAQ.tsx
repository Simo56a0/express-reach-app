import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HelpCircle, Users, Truck } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  user_type: string;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const customerFAQs = faqs.filter(faq => faq.user_type === 'customer' || faq.user_type === 'both');
  const driverFAQs = faqs.filter(faq => faq.user_type === 'driver' || faq.user_type === 'both');

  const groupByCategory = (faqList: FAQ[]) => {
    return faqList.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {} as Record<string, FAQ[]>);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'delivery': return '📦';
      case 'tracking': return '🔍';
      case 'booking': return '📅';
      case 'jobs': return '💼';
      case 'registration': return '📝';
      default: return '❓';
    }
  };

  const renderFAQSection = (faqList: FAQ[], title: string) => {
    const groupedFAQs = groupByCategory(faqList);

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground">Find answers to commonly asked questions</p>
        </div>

        {Object.entries(groupedFAQs).map(([category, categoryFAQs]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 capitalize">
                <span className="text-xl">{getCategoryIcon(category)}</span>
                {category}
                <Badge variant="secondary">{categoryFAQs.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {categoryFAQs.map((faq, index) => (
                  <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <div>Loading FAQs...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <HelpCircle className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get quick answers to common questions about our delivery services
          </p>
        </div>

        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="drivers" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Drivers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            {renderFAQSection(customerFAQs, "Customer FAQs")}
          </TabsContent>

          <TabsContent value="drivers">
            {renderFAQSection(driverFAQs, "Driver FAQs")}
          </TabsContent>
        </Tabs>

        <Card className="mt-12">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Get in touch with our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-sm">
                <strong>Email:</strong> support@fastcourier.com
              </div>
              <div className="text-sm">
                <strong>Phone:</strong> +44 20 1234 5678
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;