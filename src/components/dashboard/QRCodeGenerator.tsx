import { useState } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface QRCodeGeneratorProps {
  url: string;
  title?: string;
  shortCode: string;
}

export function QRCodeGenerator({ url, title, shortCode }: QRCodeGeneratorProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQR = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrDataUrl(dataUrl);
    } catch (error) {
      toast({
        title: 'Erro ao gerar QR Code',
        description: 'Não foi possível gerar o QR Code. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `qr-${shortCode}.png`;
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'QR Code baixado',
      description: 'O QR Code foi baixado com sucesso.',
    });
  };

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open && !qrDataUrl) {
      generateQR();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <QrCode className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          {title && (
            <p className="text-sm text-muted-foreground text-center">{title}</p>
          )}
          <p className="text-xs text-muted-foreground font-mono">{url}</p>
          
          <div className="bg-white p-4 rounded-lg border">
            {isGenerating ? (
              <div className="w-[300px] h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt="QR Code" 
                className="w-[300px] h-[300px]"
              />
            ) : (
              <div className="w-[300px] h-[300px] flex items-center justify-center text-muted-foreground">
                QR Code será gerado...
              </div>
            )}
          </div>
          
          {qrDataUrl && (
            <Button onClick={downloadQR} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Baixar QR Code
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}