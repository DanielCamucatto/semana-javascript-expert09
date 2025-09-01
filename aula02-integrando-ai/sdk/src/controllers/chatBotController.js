// @ts-check

/**
 * @typedef {import("../views/chatBotView.js").ChatbotView} ChatBotView
 * @typedef {import("../services/promptService.js").PromptService} PromptService
 */

export class ChatbotController {
    #abortController;
    #chatbotView;
    #promptService;

    /**
    * @param {Object} deps - Dependencies for the class.
    * @param {ChatBotView} deps.chatbotView - The chatbot view instance.
    * @param {PromptService} deps.promptService - The prompt service instance.
    */
    constructor({ chatbotView, promptService }) {
        this.#chatbotView = chatbotView;
        this.#promptService = promptService;
    }

    async init({ firstBotMessage, text }) {
        this.#setupEvents();
        this.#chatbotView.renderWelcomeBubble();
        this.#chatbotView.setInputEnabled(true);
        this.#chatbotView.appendBotMessage(firstBotMessage, null, false);
        return this.#promptService.init(text)
    }

    #setupEvents() {
        this.#chatbotView.setupEventHandlers({
            onOpen: this.#onOpen.bind(this),
            onSend: this.#chatBotReply.bind(this),
            onStop: this.#handleStop.bind(this),
        });
    }

    #handleStop() {
        this.#abortController.abort();
    }

    async #chatBotReply(userMsg) {
        console.log('received', userMsg)
        this.#chatbotView.showTypingIndicator();
        this.#chatbotView.setInputEnabled(false);

        try {
            this.#abortController = new AbortController();
            const response = await this.#promptService.prompt(userMsg, this.#abortController.signal)
            const contentNode = this.#chatbotView.createStreamingBotMessage()
            let fullResponse = ''
            let lastMessage = 'noop'
            const updateText = () => {
                if(!fullResponse) return
                if(fullResponse === lastMessage) return

                lastMessage = fullResponse
                this.#chatbotView.hideTypingIndicator();
                this.#chatbotView.updateStreamingBotMessage(contentNode, fullResponse)
            
            }

            const intervalId = setInterval(updateText, 200)
            const stopGenerating = () => {
                clearInterval(intervalId)
                this.#chatbotView.setInputEnabled(true);
            }

            this.#abortController.signal.addEventListener(
                'abort', stopGenerating
            )


            for await (const chunk of response) {
                fullResponse += chunk
            }
            console.log('response', fullResponse)
            stopGenerating();
            
        } catch (error) {
            this.#chatbotView.hideTypingIndicator();
            if(error.name === 'AbortError') {
                return console.log('request aborted by user')
            }
            this.#chatbotView.appendBotMessage('Error ao receber resposta da IA: ' + error.message);
        }

        // this.#chatbotView.appendBotMessage(response);
        this.#chatbotView.setInputEnabled(true);
        this.#chatbotView.hideTypingIndicator();
    }

    async #onOpen() {
        const errors = this.#checkRequirements()
        if (errors.length) {
            const messages = errors.join('\n\n')
            this.#chatbotView.appendBotMessage(
                messages
            )


            this.#chatbotView.setInputEnabled(false);
            return
        }
        this.#chatbotView.setInputEnabled(true);
    }

    #checkRequirements() {
        const errors = []
        // @ts-ignore
        const iChrome = window.chrome
        if (!iChrome) {
            errors.push(
                '⚠️ Este recurso só funciona no Google Chrome ou Chrome Canary (versão recente).'
            )
        }
        if (!('LanguageModel' in window)) {
            errors.push("⚠️ As APIs nativas de IA não estão ativas.");
            errors.push("Ative a seguinte flag em chrome://flags/:");
            errors.push("- Prompt API for Gemini Nano (chrome://flags/#prompt-api-for-gemini-nano)");
            errors.push("Depois reinicie o Chrome e tente novamente.");
        }

        return errors
    }

}
