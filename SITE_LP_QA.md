# Site e LP: acabamento e regressão com captação OFF

## Escopo e origem

Incremento sobre o trabalho local preservado em `9589a604b41994be485da92e6fa28e47835b7cdb`, cuja base pública é `c0c2857e966de3f4efd3e7f83b9c3797b0d8b0b0`. Nenhuma reformulação visual ou alteração do conteúdo comercial. Logo, imagens, CSS, HTML e renderizadores permanecem iguais ao trabalho anterior.

- Mantida validação local e mensagem explícita de que nenhuma solicitação foi enviada.
- Corrigida a troca de canal para manter `autocomplete=off`, coerente com a solicitação de dados fictícios da prévia. Isso é uma dica ao navegador, não uma garantia de que ele nunca oferecerá preenchimento.
- Adicionado adaptador exclusivamente simulado em memória, sem transporte, armazenamento ou estado de sucesso. Sua criação exige chamada explícita por código de teste; o formulário continua usando somente `preview()`.
- Simulador cobre `idle`, `invalid`, `pending`, `error`, `uncertain` e `disabled`. Cenários desconhecidos caem em `disabled`; reentrada durante `pending` não cria uma segunda operação. Os estados não retêm os dados do formulário.
- Adicionados gates de links/fragmentos, IDs, idioma, labels, referências ARIA, CSP e hashes do manifesto. Há testes de contrato de foco, limpeza de erros, troca de canal, menu/Escape, fechamento por clique externo e breakpoint.

## Reproduzir

Sem instalar dependências:

```sh
python3 -m unittest discover -s tests -p 'test_*.py'
node tests/test_frontend.cjs
node tests/test_simulation.cjs
node tests/test_ui.cjs
for f in assets/*.js lp/solar-residencial/*.js; do node --check "$f"; done
```

O workflow executa essas mesmas verificações em branches `prepare/**` e pull requests. Usa apenas permissão `contents: read`, limite de cinco minutos e não tem etapas de deploy, publicação de artefatos, secrets ou integração externa. Não foi executado remotamente nesta revisão.

## Resultado local de 20/10/2026

- 9 testes Python: estrutura anterior mais integridade e contratos acessíveis.
- 24 testes frontend anteriores preservados.
- 8 cenários/asserções agrupados do simulador OFF.
- 7 testes de contrato DOM para formulário e navegação.
- Total: 48 testes, além de 153 destinos locais em oito páginas e sintaxe dos cinco arquivos JavaScript de produção.
- Manifesto atualizado com hashes dos arquivos alterados e dos novos testes/documentos.

Os testes de DOM e ciclo de vida usam mocks. A tentativa de iniciar o Chromium headless local falhou com `socket() failed: Operation not permitted`; não houve tentativa de contornar a restrição. Não se declara aceitação visual, teste real de rede, WebGL real, aparelho físico, Safari/Firefox ou conformidade WCAG integral a partir destes testes.

## Guardas e próximos critérios de aceitação

Captação segue OFF: `connect-src 'none'`, `form-action 'none'`, submit impedido e nenhum endpoint/CRM/tracker. Nenhuma credencial, permissão, DNS, pagamento, deploy ou merge foi alterado. A simulação de resultado incerto não representa uma submissão real e não implementa idempotência de um backend futuro.

A publicação permanece pendente: houve 403 no plugin GitHub na tentativa anterior, e sua causa/escopo exatos não foram recuperados. A leitura atual confirma permissões de push/admin da conta no repositório, mas isso não demonstra permissão de escrita do token. Nenhuma rota alternativa de publicação foi usada e nenhum PR/CI remoto foi criado nesta execução.

Antes de considerar o pacote aprovado visualmente, servir este commit em ambiente autorizado e verificar 393, 701, 900 e 1180 px, navegação por teclado, foco/erros, movimento reduzido, queda WebGL/Canvas2D/SVG, ausência de requisição após submit e cabeçalhos reais no destino. Usar apenas dados fictícios. Uma eventual publicação ou integração real exige autorização e critérios próprios.

## Adaptação à Headless

HEADLESS_ADAPTER.md mapeia os campos existentes, os três fluxos independentes, os limites de backend/BFF e as lacunas de ingresso/binding aos snapshots README, APLICACOES-REMOTAS e MCP-CATALOGO. É documentação de desenho: não cria contrato wire, rota, segredo, persistência ou integração.
