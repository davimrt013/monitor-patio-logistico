# Documentação de Implantação Manual - Monitor de Pátio Logístico no GitHub Pages

Este documento detalha o processo de implantação manual da aplicação "Monitor de Pátio Logístico" no GitHub Pages. Ele é destinado a usuários que desejam ter controle total sobre o processo ou que precisam solucionar problemas de implantação.

## Sumário
1.  [Pré-requisitos](#pré-requisitos)
2.  [Configuração do Git](#configuração-do-git)
3.  [Criação do Repositório no GitHub](#criação-do-repositório-no-github)
4.  [Push do Código para o GitHub](#push-do-código-para-o-github)
5.  [Configuração do GitHub Pages](#configuração-do-github-pages)
6.  [Acessando a Aplicação Publicada](#acessando-a-aplicação-publicada)
7.  [Solução de Problemas Comuns](#solução-de-problemas-comuns)

## 1. Pré-requisitos
Antes de iniciar o processo de implantação, certifique-se de ter os seguintes itens:

*   **Conta GitHub:** Você precisará de uma conta ativa no GitHub. Se ainda não tiver uma, pode criar uma gratuitamente em [github.com](https://github.com/).
*   **Git Instalado:** O Git deve estar instalado em sua máquina local. Você pode baixá-lo e instalá-lo a partir do site oficial do Git: [git-scm.com/downloads](https://git-scm.com/downloads).
*   **Navegador Web:** Um navegador web moderno para acessar o GitHub e a aplicação publicada.
*   **Personal Access Token (PAT) do GitHub:** Para operações de linha de comando (push, pull), o GitHub não suporta mais autenticação por senha. Você precisará gerar um PAT e usá-lo como sua senha. Veja como gerar um PAT na seção [Solução de Problemas Comuns](#solução-de-problemas-comuns).

## 2. Configuração do Git

Se você já configurou o Git globalmente em sua máquina, pode pular esta etapa. Caso contrário, abra seu terminal ou prompt de comando e configure seu nome de usuário e e-mail. Isso é importante para que seus commits sejam corretamente atribuídos.

```bash
git config --global user.name "Seu Nome de Usuário"
git config --global user.email "seu.email@example.com"
```

Navegue até o diretório raiz do seu projeto "Monitor de Pátio Logístico" no terminal:

```bash
cd /caminho/para/monitor-patio-logistico
```

Inicialize um novo repositório Git local:

```bash
git init
```

Adicione todos os arquivos do projeto ao controle de versão:

```bash
git add .
```

Crie o commit inicial:

```bash
git commit -m "Initial commit: Monitor de Pátio Logístico"
```

## 3. Criação do Repositório no GitHub

1.  Acesse o GitHub em seu navegador e faça login em sua conta.
2.  No canto superior direito, clique no sinal de `+` e selecione `New repository` (Novo repositório).
3.  Na página "Create a new repository":
    *   **Owner:** Certifique-se de que seu nome de usuário esteja selecionado.
    *   **Repository name:** Digite um nome para o seu repositório, por exemplo, `monitor-patio-logistico`. É recomendável que o nome do repositório seja o mesmo do diretório do seu projeto para evitar problemas com o GitHub Pages se você for usar um domínio personalizado no futuro.
    *   **Description (optional):** Adicione uma breve descrição do seu projeto.
    *   **Public/Private:** Escolha `Public` (Público) para que o GitHub Pages funcione sem configurações adicionais de visibilidade. Se você escolher `Private`, o GitHub Pages só estará disponível para usuários com acesso ao repositório e você precisará de uma conta GitHub Pro, Team ou Enterprise.
    *   **Initialize this repository with:** **Não** marque nenhuma das opções (`Add a README file`, `Add .gitignore`, `Choose a license`), pois você já tem os arquivos em seu projeto local.
4.  Clique no botão `Create repository` (Criar repositório).

Após a criação, o GitHub exibirá uma página com instruções para configurar seu repositório local. Você precisará da URL do repositório remoto para a próxima etapa.

## 4. Push do Código para o GitHub

De volta ao seu terminal, no diretório raiz do projeto, adicione o repositório remoto que você acabou de criar no GitHub. Substitua `SUA_URL_DO_REPOSITORIO` pela URL HTTPS do seu repositório (você pode copiá-la da página do GitHub após criar o repositório, geralmente algo como `https://github.com/seu-usuario/monitor-patio-logistico.git`).

```bash
git remote add origin SUA_URL_DO_REPOSITORIO
```

Renomeie sua branch principal para `main` (se ainda não for) e faça o push do seu código para o GitHub:

```bash
git branch -M main
git push -u origin main
```

Quando solicitado, insira seu nome de usuário do GitHub e, em seguida, seu **Personal Access Token (PAT)** como senha.

## 5. Configuração do GitHub Pages

Agora que seu código está no GitHub, você pode configurar o GitHub Pages para publicá-lo como um site.

1.  No seu repositório no GitHub, clique na aba `Settings` (Configurações).
2.  No menu lateral esquerdo, clique em `Pages`.
3.  Na seção "Build and deployment" (Construção e implantação):
    *   Em "Source" (Fonte), selecione `Deploy from a branch` (Implantar de uma branch).
    *   Em "Branch" (Branch), selecione `main` (ou a branch que você usou para o push do seu código) e a pasta `/(root)` (raiz).
4.  Clique no botão `Save` (Salvar).

O GitHub Pages levará alguns minutos para construir e implantar seu site. Você verá uma mensagem indicando que seu site está sendo publicado. Após a conclusão, a URL do seu site será exibida nesta mesma página, geralmente no formato `https://seu-usuario.github.io/nome-do-repositorio/`.

## 6. Acessando a Aplicação Publicada

Após a implantação, você poderá acessar sua aplicação "Monitor de Pátio Logístico" através da URL fornecida pelo GitHub Pages. Basta copiar e colar a URL em seu navegador.

## 7. Solução de Problemas Comuns

### Autenticação Falhou (Personal Access Token - PAT)

Se você encontrar um erro de "Authentication failed" (Autenticação falhou) ao tentar fazer `git push`, é provável que você esteja tentando usar sua senha da conta GitHub, o que não é mais permitido para operações Git via linha de comando. Você precisa usar um Personal Access Token (PAT).

**Como gerar um PAT:**

1.  Acesse [github.com/settings/tokens](https://github.com/settings/tokens) em seu navegador.
2.  Clique em `Generate new token` (Gerar novo token) ou `Generate new token (classic)`.
3.  **Note:** Se você escolher `Generate new token`, você será direcionado para uma página onde poderá configurar um token mais granular. Para a maioria dos casos de uso de implantação, `Generate new token (classic)` é mais simples.
4.  **Para `Generate new token (classic)`:**
    *   **Note:** Dê um nome descritivo ao token (ex: `monitor-patio-deploy`).
    *   **Expiration:** Defina uma data de expiração adequada (recomenda-se um período limitado por segurança).
    *   **Select scopes:** Marque os escopos necessários. Para este projeto, `repo` (para acesso total a repositórios privados e públicos) é suficiente. Se você planeja usar GitHub Actions para automação futura, também pode marcar `workflow`.
    *   Clique em `Generate token`.
5.  **Copie o token gerado IMEDIATAMENTE.** Ele só será exibido uma vez. Se você perdê-lo, terá que gerar um novo.

Ao fazer `git push` novamente, quando solicitado pela senha, cole o PAT que você copiou.

### Site Não Publicado ou Erro 404

*   **Verifique a branch e a pasta:** Certifique-se de que, nas configurações do GitHub Pages, você selecionou a branch correta (`main`) e a pasta `/(root)`.
*   **Tempo de Propagação:** Pode levar alguns minutos para que o site seja publicado após a configuração. Aguarde um pouco e tente novamente.
*   **Nome do Repositório:** Se o nome do seu repositório não for `seu-usuario.github.io`, a URL do seu site será `seu-usuario.github.io/nome-do-repositorio/`. Certifique-se de estar usando a URL completa e correta.
*   **Conteúdo Vazio:** Se o seu `index.html` estiver vazio ou não for o arquivo principal, o GitHub Pages pode não exibir nada. Verifique o conteúdo do seu `index.html`.
*   **`.nojekyll`:** Se você não estiver usando Jekyll (que é o caso desta aplicação HTML/CSS/JS pura), o GitHub Pages pode tentar processar seu site com Jekyll por padrão. Para evitar isso, você pode criar um arquivo vazio chamado `.nojekyll` na raiz do seu repositório. Isso informa ao GitHub Pages para pular o processo de construção do Jekyll e servir os arquivos diretamente. Você pode fazer isso via terminal:
    ```bash
    touch .nojekyll
    git add .nojekyll
    git commit -m "Add .nojekyll file"
    git push origin main
    ```

Se você seguir estes passos e ainda tiver problemas, consulte a documentação oficial do GitHub Pages para mais informações: [docs.github.com/en/pages](https://docs.github.com/en/pages).

