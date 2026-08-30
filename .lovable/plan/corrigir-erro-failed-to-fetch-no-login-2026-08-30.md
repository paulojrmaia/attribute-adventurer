# Corrigir erro "Failed to fetch" no login

## Diagnóstico

O backend da Lovable Cloud (banco de dados + autenticação) está **pausado**. Verificado via checagem de status do backend: estado `INACTIVE`. Enquanto isso, toda chamada de login, cadastro, refresh de sessão e recuperação de senha falha no navegador com "Failed to fetch" — nenhum problema no código de `src/routes/auth.tsx`.

## O que vou fazer

1. Retomar (despausar) o backend da Lovable Cloud.
2. Aguardar até o backend reportar estado saudável.
3. Validar no preview que o login com paulojrmaia@gmail.com funciona: carregar `/auth`, enviar o formulário e confirmar que a requisição de autenticação responde (sem "Failed to fetch") e a navegação para `/characters` ocorre.
4. Se a senha estiver incorreta (erro "Invalid login credentials" em vez de falha de rede), confirmo que a conexão está OK e você usa o fluxo "Esqueceu a senha?".

## Notas técnicas

- Nenhuma alteração de código é necessária; o plano é apenas operacional mais verificação.
- Retomar o backend leva alguns minutos até o banco e o serviço de autenticação ficarem prontos.
