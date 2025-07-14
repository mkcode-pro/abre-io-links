import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReportDialogProps {
  linkId: string;
  children: React.ReactNode;
}

export function ReportDialog({ linkId, children }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('user_reports').insert({
        link_id: linkId,
        reason,
        description: description.trim() || null
      });

      if (error) throw error;

      toast({
        title: "Reporte enviado",
        description: "Obrigado por reportar. Nossa equipe irá revisar em breve.",
      });

      setOpen(false);
      setReason("");
      setDescription("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar reporte. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Reportar Link
          </DialogTitle>
          <DialogDescription>
            Reporte links suspeitos, maliciosos ou inadequados para nossa equipe.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo do reporte</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spam">Spam</SelectItem>
                <SelectItem value="malware">Malware/Vírus</SelectItem>
                <SelectItem value="phishing">Phishing/Golpe</SelectItem>
                <SelectItem value="inappropriate">Conteúdo Inadequado</SelectItem>
                <SelectItem value="copyright">Violação de Direitos Autorais</SelectItem>
                <SelectItem value="illegal">Conteúdo Ilegal</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Forneça mais detalhes sobre o problema..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!reason || loading}>
              {loading ? "Enviando..." : "Enviar Reporte"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}