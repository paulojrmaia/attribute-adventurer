# Limpeza final da classe Ladino

## Objetivo
Concluir a remoção do Ladino sem alterar autenticação, regras, atributos, limites, identidade visual ou rotas.

## Alterações
- Trocar somente o texto da home para “Três caminhos. Um destino seu.”
- Ajustar a seleção de classes para três colunas no desktop, mantendo os três cards intactos e centralizados.
- Tornar a listagem resiliente a classes legadas ou desconhecidas, sem conversões inseguras nem acesso a definições inexistentes.
- Remover a configuração, diretório e dependências Drizzle adicionados para essa alteração, atualizando os arquivos de dependências.
- Criar uma nova migration em `supabase/migrations` sem modificar o histórico existente.
- Como a verificação encontrou zero personagens `rogue`, substituir o enum por outro contendo apenas `warrior`, `mage` e `archer`, preservando a coluna e os dados atuais.
- Remover a proteção temporária baseada em trigger, que deixa de ser necessária após o enum aceitar somente as três classes.
- Aplicar a migration e regenerar os tipos do banco para refletir as três classes válidas.

## Compatibilidade e segurança
- A listagem tratará qualquer valor inesperado como classe legada, exibindo o personagem sem quebrar a página.
- A criação continuará aceitando somente as três classes definidas no jogo.
- Nenhum personagem será convertido ou apagado.

## Validação
- Conferir que não restam infraestrutura Drizzle nem referências de criação ao Ladino.
- Validar home, seleção em três colunas, login, criação e listagem no preview.
- Confirmar compilação e tipos sem erros.
