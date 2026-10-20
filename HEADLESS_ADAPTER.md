# Limites do adaptador Site/LP → Headless

## Decisão deste pacote

Site e LP permanecem estáticos, com captação OFF. A apresentação pode ser hospedada externamente; isso não exige instalar um framework na Headless. O adaptador simulado de `core.js` demonstra estados locais, sem representar contrato wire, binding, autenticação ou API implantada. Não houve mudança na Headless.

A preferência de hospedagem em Vercel não autoriza deploy nem resolve a entrada de leads. Uma futura integração usará uma fronteira de backend/BFF da aplicação, com identidade legitimamente atribuída e operações publicadas, sem segredo administrativo ou credencial Headless no frontend. Nenhuma função de backend, variável de ambiente, rota HTTP ou conta foi criada neste pacote.

## Três fluxos separados

1. Aplicação → Headless: aguarda contrato de entrada de contato/negócio, schema efetivo, binding e recibo. A simples existência de operações CRM no catálogo não autoriza a identidade desta aplicação.
2. Headless → aplicação: não necessário para a apresentação atual; nenhum endpoint de comando foi presumido ou implementado.
3. Eventos contínuos: receptor/registro genérico estão descritos como planejados no guia examinado. Não foi inventado webhook `/events`, broker ou manifesto registrável.

## Matriz dos campos presentes

| Campo da prévia | Responsabilidade atual | Antes de uma integração real |
|---|---|---|
| `name` | Validação local, até 120 caracteres | Definir campo de contato e operação autorizada; nunca inferir identidade por nome |
| `city`, `uf` | Dados locais do imóvel/jornada | Contratar projeção e fonte de verdade; não presumir que endereço do imóvel é endereço do contato |
| `reason` | Opção da jornada local | Mapear para catálogo/campo configurado do tenant, sem fixar funil, etapa ou motivo comercial no frontend |
| `channel`, `contact` | Preferência e validação local de contato | Definir identidade/canal/conta e consentimento específico; preferência de canal não é permissão automática de envio |
| `note` | Texto opcional local, até 500 caracteres | Definir domínio/destino e limites; não usar conhecimento, mensagem externa ou atividade fictícia como armazenamento alternativo |
| Preferência demonstrativa analytics | Estado em memória da aba | Não equivale a autorização de contato, tracker instalado ou recibo de consentimento persistido |
| Origem, conta, ID externo, ID Headless, versão | Não coletados nem persistidos neste pacote | Contratar proveniência e associação; IDs externos como strings exatas; separar referência temporária de ID permanente |

Nenhum payload dos campos acima é serializado para rede. Esta matriz descreve lacunas e responsabilidades, não mapeamento ativo de CRM.

## Operações encontradas e limites

- `crm_contacts_pick` seleciona contato existente e retorna `contact_ref` temporário, vinculado ao principal, com validade documentada de dez minutos. Não é criação de contato nem chave permanente.
- `crm_deal_create` cria negócio para contato existente, com funil/etapa e direitos efetivos. Não cria contato implicitamente. Não usar uma etapa com disparos para simular ingresso inerte.
- `crm_external_ref_lookup` consulta associação existente. Não cria associação; conta sem suporte deve continuar `insufficient_data/account_scope_unavailable`, sem retirar o filtro e alegar identidade confirmada.
- O guia não localizou upsert público geral de contato nos catálogos examinados. Isso é uma lacuna limitada à pesquisa, não uma afirmação universal de inexistência.
- Importação é um fluxo próprio: schema/validação/submissão/aprovação/aplicação/liberação e recibos separados. `upsert` descrito preenche campos vazios; não é overwrite geral, entrada ao vivo ou permissão para ignorar anti-disparo.
- Catálogo documental, publicação, ativação e disponibilidade na identidade autenticada são provas distintas. MCP não implica autorização REST.

## Estados e recuperação

O simulador atual oferece `idle`, `invalid`, `pending`, `error`, `uncertain` e `disabled`, sempre com `simulated: true` e `captureEnabled: false`. A página usa apenas validação local e `disabled`; os demais estados são exercitados por testes, sem ativação no formulário.

Na integração futura, sucesso só poderá ser apresentado depois de recibo correlacionado ao efeito contratado. HTTP 200, proposta, validação ou aceite em fila isoladamente não comprovam criação aplicada nem envio. Timeout após escrita sem recuperação comprovada deve permanecer incerto: consultar o resultado por contrato antes de repetir, sem nova chave para mascarar duplicação. A idempotência depende da operação real; não se presume chave universal ou exactly-once. A prevenção de reentrada do simulador não é idempotência de backend.

## Critérios para abrir uma implementação real

- Contrato de ingresso e associação publicado, schema/versionamento, origem/conta e identidade autorizada.
- Catálogo efetivamente exposto no principal e regra de confirmação documentada, sem novo grant por inferência.
- Modelo por campo, tenant e consentimento; operação e consulta de recibo definidas.
- Teste autorizado com fixture fictícia: efeito inerte, recusa relevante, isolamento entre tenants, repetição, conflito e reconciliação de timeout.
- Sem acesso direto a tabelas/DML, função interna, KB improvisada, mensagem falsa, novo webhook por cliente ou segredo no bundle do navegador.
- Revisão separada para persistência, credenciais, publicação, integração e eventual captação real.

## Fontes examinadas

Conteúdo de snapshots consultados em 20/10/2026, sem nova consulta ao serviço Headless. Links apontam para os documentos; os blobs identificam a versão lida e não implicam HEAD atual.

- [README](https://github.com/pablodornellas-ux/headless-augustus/blob/main/docs/headless/README.md), blob `63d1de33b500cf568e92d8f168873501ba60912a`: publicação, ativação e aceite separados.
- [Aplicações remotas](https://github.com/pablodornellas-ux/headless-augustus/blob/main/docs/headless/APLICACOES-REMOTAS.md), blob `8727f805332cd0b4a33ec540d6c7bcc4afa16a1b`: §§1–6, três fluxos, domínio, identidade, importação/eventos e recuperação.
- [Catálogo MCP](https://github.com/pablodornellas-ux/headless-augustus/blob/main/docs/headless/MCP-CATALOGO.md), blob `8dbf6c8f94a9a183a2d2d2c878a4d9df7cb8f860`: `crm_contacts_pick`, `crm_deal_create`, `crm_external_ref_lookup` e importação. A leitura não exercita nenhuma dessas operações.
