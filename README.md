# Cardápio Interativo em Vídeo

## 1. Visão geral do produto
O **Cardápio Interativo em Vídeo** é um MVP fullstack profissional para restaurantes, lanchonetes, hamburguerias e operações de alimentação que querem combinar cardápio digital, vídeo incorporado por prato e distribuição via QR Code.

O foco desta versão está em:
- navegação pública mobile-first;
- página própria por prato;
- QR geral, QR por prato e QR por mesa;
- painel administrativo protegido;
- analytics básico no banco;
- base sólida para futura evolução para SaaS multi-tenant.

## 2. Diferencial do produto
O principal diferencial é que **cada prato pode ter sua própria landing page interna** dentro do sistema, com vídeo incorporado do YouTube **sem redirecionar o QR diretamente para o YouTube**.

Isso garante:
- melhor controle da experiência de marca;
- retenção do usuário dentro do sistema;
- exibição clara de nome, preço, descrição e disponibilidade antes do vídeo;
- melhor potencial de conversão mesmo quando o cliente não dá play.

## 3. Stack utilizada
### Frontend
- Next.js 15 com App Router
- TypeScript
- Tailwind CSS v4
- Componentes no estilo shadcn/ui
- Lucide Icons
- React Hook Form
- Zod

### Backend / fullstack
- Next.js fullstack com Server Components e Server Actions
- Prisma ORM
- PostgreSQL

### Auth
- Auth.js / NextAuth com Credentials provider

### Utilitários
- QRCode (`qrcode`)
- `bcryptjs` para hash de senha

## 4. Arquitetura do projeto
A aplicação foi organizada por responsabilidade e domínio:
- `app/`: rotas públicas e administrativas;
- `components/`: UI compartilhada e blocos de tela;
- `actions/`: server actions do painel admin;
- `lib/`: autenticação, Prisma, queries e utilidades;
- `prisma/`: schema e seed;
- `types/`: extensões de tipos.

Princípios adotados:
- tipagem forte;
- validação com Zod;
- separação entre UI, regras e persistência;
- preferência por Server Components sempre que possível;
- client components apenas onde havia ganho real de UX (formulários).

## 5. Estrutura de pastas
```bash
app/
  admin/
  api/auth/[...nextauth]/
  menu/[restaurantSlug]/
components/
  admin/
  layout/
  public/
  ui/
actions/
lib/
  auth/
  validations/
prisma/
types/
```

## 6. Como rodar localmente
### Pré-requisitos
- Node.js 20+
- PostgreSQL 14+
- npm 10+

### Passos
```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

A aplicação ficará disponível em:
- Pública: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`

## 7. Como configurar variáveis de ambiente
Arquivo `.env` sugerido:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cardapio_interativo"
AUTH_SECRET="uma-chave-super-segura"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Descrição
- `DATABASE_URL`: conexão PostgreSQL usada pelo Prisma.
- `AUTH_SECRET`: segredo de sessão do Auth.js.
- `NEXT_PUBLIC_APP_URL`: URL base usada na geração dos QR Codes.

## 8. Como rodar migrações Prisma
Para ambiente local:
```bash
npm run db:migrate
```

Para sincronizar rapidamente em protótipos:
```bash
npm run db:push
```

## 9. Como criar seed inicial
```bash
npm run db:seed
```

A seed cria:
- 1 restaurante demo;
- 4 categorias;
- 9 pratos;
- 4 mesas;
- 1 usuário admin demo.

## 10. Como acessar o painel admin
Após rodar o seed:
- URL: `/admin/login`
- E-mail: `admin@sabordacasa.demo`
- Senha: `admin123`

## 11. Rotas principais
### Públicas
- `/`
- `/menu/[restaurantSlug]`
- `/menu/[restaurantSlug]/dish/[dishSlug]`
- `/menu/[restaurantSlug]?table=mesa-12`

### Admin
- `/admin/login`
- `/admin`
- `/admin/categories`
- `/admin/dishes`
- `/admin/tables`
- `/admin/settings`
- `/admin/analytics`

## 12. Modelagem resumida do banco
### `Restaurant`
Dados institucionais e identidade do restaurante.

### `Category`
Categorias ordenáveis do cardápio.

### `Dish`
Pratos com preço, descrição, imagem, vídeo opcional, disponibilidade e contador de views.

### `Table`
Mesa com número e código usado no QR.

### `DishViewEvent`
Evento simples para analytics por visualização.

### `User`
Usuários do painel admin com papel e vínculo opcional com restaurante.

## 13. Decisões arquiteturais
- **Vídeo opcional**: a página do prato não depende do vídeo para comunicar valor.
- **QR interno**: nenhum QR aponta diretamente para o YouTube; todos levam para páginas internas.
- **Sem upload complexo no MVP**: uso de URLs de imagem para reduzir complexidade inicial.
- **Analytics interno**: sem serviços externos na primeira versão.
- **Estrutura preparada para multi-tenant**: as entidades principais já possuem vínculo com `restaurantId`.

## 14. Melhorias futuras
- upload de imagem com storage externo;
- pedidos com carrinho;
- checkout e pagamento;
- analytics por período;
- gestão de múltiplos restaurantes por instância;
- customização avançada de tema;
- suporte a combos, adicionais e observações.

## 15. Evolução para SaaS multi-tenant
A base já foi desenhada para suportar expansão futura:
- `restaurantId` nas entidades centrais;
- usuários relacionados a restaurante;
- slugs públicos por restaurante;
- painel com escopo de restaurante.

Para virar SaaS, os próximos passos naturais seriam:
- onboarding por restaurante;
- billing/assinaturas;
- roles mais detalhadas;
- isolamento mais robusto por tenant;
- domínio customizado por cliente.

## 16. Troubleshooting básico
### Erro de conexão com banco
Verifique se o PostgreSQL está ativo e se `DATABASE_URL` está correta.

### Prisma Client desatualizado
Execute:
```bash
npm run db:generate
```

### Seed falhou por duplicidade
A seed usa `upsert`, então normalmente pode ser rodada novamente. Se o schema mudou muito, recrie o banco local e rode migrate + seed outra vez.

### QR Code com URL errada
Confirme o valor de `NEXT_PUBLIC_APP_URL`.

### Login não funciona
Garanta que o seed foi executado e que o `AUTH_SECRET` foi definido.

## 17. Observações do MVP
- Busca pública simples está disponível no cardápio.
- O contador de visualizações é incrementado na página individual do prato.
- O botão de WhatsApp já preserva a referência de mesa quando acessado via QR de mesa.
- Os formulários usam React Hook Form + Zod para validação de entrada.
