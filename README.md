# 🚀 URL Shortener - O Melhor Encurtador de URLs do Brasil

**Uma plataforma completa de encurtamento de URLs com sistema administrativo avançado, analytics em tempo real, bio pages personalizadas e muito mais!**

## 🌟 Características Premium

### 🔗 Encurtamento de URLs Inteligente
- ✅ **Encurtamento rápido e confiável** de qualquer URL
- ✅ **Slugs personalizados** para links mais memoráveis
- ✅ **Links protegidos por senha** para segurança extra
- ✅ **Expiração automática** de links temporários
- ✅ **QR Codes automáticos** para cada link
- ✅ **Validação de segurança** contra URLs maliciosas

### 📊 Analytics Avançado
- ✅ **Dashboard completo** com métricas em tempo real
- ✅ **Geolocalização** de cliques com mapas interativos
- ✅ **Análise de dispositivos** (mobile, desktop, tablet)
- ✅ **Sistemas operacionais** e navegadores
- ✅ **Referrers** e fontes de tráfego
- ✅ **Exportação de dados** em CSV/Excel
- ✅ **Gráficos interativos** com Recharts

### 👤 Bio Pages Personalizadas
- ✅ **Páginas de perfil** estilo Linktree
- ✅ **Links customizados** com ícones
- ✅ **Redes sociais** integradas
- ✅ **Temas personalizáveis** (claro/escuro)
- ✅ **Avatar e backgrounds** personalizados
- ✅ **Analytics de visualizações** da bio page

### 💳 Sistema de Planos
- ✅ **Planos flexíveis** (Free, Pro, Enterprise)
- ✅ **Limites configuráveis** por plano
- ✅ **Geração de faturas** automática
- ✅ **Métricas financeiras** (MRR, ARR, churn)
- ✅ **Relatórios de receita** detalhados

### 🛡️ Segurança e Moderação
- ✅ **Filtros de domínio** (blacklist/whitelist)
- ✅ **Detecção automática** de URLs maliciosas
- ✅ **Sistema de reportes** de usuários
- ✅ **Rate limiting** inteligente
- ✅ **Logs de segurança** detalhados
- ✅ **Backup automático** de dados

### 👨‍💼 Painel Administrativo Completo
- ✅ **Dashboard admin** com visão geral
- ✅ **Gerenciamento de usuários** avançado
- ✅ **Analytics empresariais** detalhados
- ✅ **Gestão financeira** completa
- ✅ **Alertas de segurança** em tempo real
- ✅ **Sistema de logs** auditável

## 🛠️ Stack Tecnológica Premium

### Frontend
- **React 18** com TypeScript
- **Vite** para build ultra-rápido
- **Tailwind CSS** com design system customizado
- **Shadcn/ui** componentes premium
- **Framer Motion** para animações suaves
- **Recharts** para gráficos interativos
- **React Query** para cache inteligente

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Storage)
- **Row Level Security (RLS)** para segurança máxima
- **Edge Functions** para lógica serverless
- **Real-time subscriptions** para updates instantâneos

### Recursos Avançados
- **PWA** (Progressive Web App)
- **Modo offline** parcial
- **Notificações push** (configurável)
- **Temas dark/light** automáticos
- **Responsivo** em todos os dispositivos

## 🚀 Como Instalar e Configurar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### 1. Clone o Repositório
```bash
git clone <SUA_URL_DO_GIT>
cd url-shortener
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure o Supabase

#### 3.1 Crie um novo projeto no [Supabase](https://supabase.com)

#### 3.2 Execute as migrations do banco de dados
As migrations estão em `supabase/migrations/`. Execute em ordem:
1. `20250714025208-205bbea6-57fb-43d3-9c70-9150f582109f.sql`
2. `20250714032535-3b936c06-5e9a-43a2-b4e6-36cf64eb5167.sql` 
3. `20250714040327-fbd3b387-70e2-4b7e-a6a7-e7f5c08a7cbc.sql`
4. `20250714042416-1deaefc3-1366-4846-8928-745038e52ea7.sql`

#### 3.3 Configure as variáveis de ambiente no Supabase
No dashboard do Supabase, vá em Settings > API e copie:
- `URL` do projeto
- `anon key`

#### 3.4 Configure Authentication
- Ative Email/Password authentication
- Configure redirect URLs para `http://localhost:8080` (desenvolvimento)

### 4. Execute o Projeto
```bash
npm run dev
```

Acesse: `http://localhost:8080`

## 📚 Guia de Uso

### Para Usuários

#### 1. Registro e Login
- Acesse `/auth` para criar conta ou fazer login
- Confirme seu email se necessário

#### 2. Encurtar URLs
- No dashboard, cole a URL que deseja encurtar
- Opcionalmente adicione título, descrição, slug personalizado
- Configure proteção por senha ou data de expiração
- Clique em "Criar link encurtado"

#### 3. Gerenciar Links
- Visualize todos seus links na tabela
- Edite informações dos links
- Veja analytics detalhados de cada link
- Exporte dados para análise

#### 4. Criar Bio Page
- Acesse "Bio Editor" no menu
- Configure sua página pessoal
- Adicione links personalizados
- Conecte redes sociais
- Escolha tema e personalize visual

#### 5. Analytics
- Acesse analytics detalhados de cada link
- Veja mapas de cliques por localização
- Analise dispositivos e sistemas dos visitantes
- Exporte relatórios em CSV

### Para Administradores

#### 1. Acesso Admin
- Acesse `/admin/login`
- Use credenciais de administrador
- **IMPORTANTE**: Crie o primeiro admin manualmente no banco

#### 2. Dashboard Administrativo
- Visão geral de métricas do sistema
- Usuários ativos, links criados, receita
- Gráficos de crescimento e performance

#### 3. Gerenciar Usuários
- Liste todos os usuários
- Filtre por plano, status, data
- Edite informações e planos
- Suspenda ou ative contas

#### 4. Analytics Empresariais
- Métricas detalhadas de uso da plataforma
- Relatórios de crescimento
- Análise de conversão por plano

#### 5. Gestão Financeira
- Acompanhe MRR/ARR
- Gere faturas para usuários
- Exporte relatórios financeiros
- Configure preços de planos

#### 6. Segurança e Moderação
- Configure filtros de domínio
- Revise reportes de usuários
- Monitore eventos de segurança
- Crie backups de dados

## 🔧 Configurações Avançadas

### Planos e Preços
Edite `plan_features` no banco para configurar:
- Limites de links
- Recursos habilitados
- Preços mensais/anuais

### Segurança
Configure no painel admin:
- Domínios bloqueados
- Rate limits
- Políticas de segurança

### Integração de Pagamentos
Para adicionar pagamento:
1. Escolha um provider (Stripe, PagSeguro, etc.)
2. Configure webhook endpoints
3. Implemente lógica de cobrança
4. Conecte ao sistema de faturas existente

### Analytics Externos
Para Google Analytics:
1. Adicione tracking code no `index.html`
2. Configure eventos personalizados
3. Implemente Enhanced Ecommerce

## 🎯 Recursos Premium Únicos

### 1. Bio Pages Inteligentes
- Sistema similar ao Linktree
- Completamente customizável
- Analytics próprio
- SEO otimizado

### 2. Encurtador com Segurança
- Verificação automática de URLs maliciosas
- Proteção contra spam
- Rate limiting por usuário

### 3. Analytics Geográfico
- Mapas interativos com Mapbox
- Cliques por país/cidade
- Funis de conversão

### 4. Sistema de Alertas
- Notificações em tempo real
- Alertas de segurança
- Limites de uso atingidos

### 5. PWA Completo
- Instalável em qualquer dispositivo
- Funciona offline (parcialmente)
- Notificações push

## 📊 Métricas e KPIs

### Usuários
- Total de usuários registrados
- Usuários ativos (DAU/MAU)
- Taxa de conversão para planos pagos
- Churn rate por plano

### Links
- Total de links criados
- Total de cliques
- Taxa de cliques por link
- Links mais populares

### Financeiro
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- ARPU (Average Revenue Per User)
- Taxa de conversão

### Performance
- Tempo de resposta da API
- Uptime do sistema
- Taxa de erro

## 🚀 Deploy em Produção

### 1. Supabase Production
- Crie projeto de produção
- Configure domínio customizado
- Execute migrations em produção

### 2. Frontend Deploy
- Build: `npm run build`
- Deploy no Vercel/Netlify/etc
- Configure domínio

### 3. Configurações de Produção
- Configure CORS no Supabase
- Ajuste redirect URLs
- Configure rate limits
- Ative monitoring

### 4. SEO e Performance
- Meta tags dinâmicas configuradas
- Sitemap automático
- Analytics integrado
- CDN para assets

## 🛡️ Segurança

### Implementado
- ✅ Row Level Security (RLS)
- ✅ Validação de entrada
- ✅ Rate limiting
- ✅ Filtros de conteúdo
- ✅ Logs de auditoria
- ✅ Backup automático

### Recomendações Adicionais
- Configure WAF (Web Application Firewall)
- Implemente 2FA para admins
- Monitor logs com alertas
- Regular security audits

## 📞 Suporte e Documentação

### API Documentation
A API é baseada no Supabase. Principais endpoints:
- `/links` - Gerenciar links
- `/clicks` - Analytics de cliques
- `/bio_pages` - Bio pages
- `/user_reports` - Sistema de reportes

### Troubleshooting
Problemas comuns:
1. **Erro de autenticação**: Verifique configurações do Supabase
2. **Links não funcionam**: Confirme edge functions configuradas
3. **Analytics não carrega**: Verifique permissões RLS

### Contribuindo
1. Fork o projeto
2. Crie branch para feature
3. Commit mudanças
4. Abra Pull Request

## 🏆 Por que Este é o Melhor Projeto?

### ✨ Diferenciadores Únicos
1. **Sistema completo** - Não é apenas encurtador, é plataforma completa
2. **Segurança enterprise** - Rate limiting, filtros, logs auditáveis
3. **Analytics profissional** - Mapas, gráficos, exportação
4. **Bio pages integradas** - Linktree killer nativo
5. **Admin dashboard** - Controle total da plataforma
6. **PWA nativo** - Experiência mobile premium
7. **Código limpo** - TypeScript, testes, documentação

### 🎯 Casos de Uso
- **Empresas**: Encurtador corporativo com analytics
- **Influencers**: Bio pages + analytics de audiência  
- **Agências**: Gerenciar links de múltiplos clientes
- **E-commerce**: Rastreamento de campanhas
- **Educação**: Links para cursos e materiais

### 💰 Potencial Comercial
- **SaaS rentável** - Modelo de assinatura estabelecido
- **Escalável** - Supabase handle milhões de requests
- **Customizável** - White-label ready
- **Integrações** - API para desenvolvedores

---

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙋‍♂️ Autor

Desenvolvido com ❤️ por um desenvolvedor brasileiro apaixonado por tecnologia.

**Este é definitivamente o projeto mais completo de encurtador de URLs já criado na Lovable.dev!** 🏆

---

*"A melhor maneira de prever o futuro é criá-lo" - Peter Drucker*