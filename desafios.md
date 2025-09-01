🎨 Desafios
1 - Baixar o modelo mediante à autorização dos usuários

    Pergunte ao usuário se ele deseja baixar o modelo, verificar que se caso o modelo não esteja disponível na máquina do cliente, para que no chat, ele clique em um botão, inicie o download e então o notifique que acabou
    verificar que se caso o modelo não esteja disponível na máquina do cliente, para que no chat, ele clique em um botão, inicie o download e então o notifique que acabou

2 - Tornar disponível em outros navegadores

    Se o cliente não está no Google Chrome, você pode trocar o modelo, usar o Hugging face ou até o modelo do Gemma do google e seguir o mesmo processo, perguntando se ele deseja baixar o modelo e mais

3 - Tornar disponível em computadores incompatíveis / com menos poder de processamento
Implementar um backend para consumir as APIs gratuitas de AI, os modelos menores do Gemma do Google para responder aos usuários:

    Recomendação é usar o OpenRouter, um agregador de modelos de IA que funcionam na nuvem. Lá lá eles deixam você usar APIs de forma gratuita, com alguns limites mas pelos meus testes funciona muito bem.
    Dar uma olhada na documentação para ver como integrar com o Node.js e garantir que suas chaves não vão ficar expostas no frontend.