
export class PromptService {
    #messages = []
    #session = null
    async init(initialPrompts) {
        if (!window.LanguageModel) return

        this.#messages.push({
            role: 'system',
            content: initialPrompts
        })

        return this.#createSession()
    }

    async #createSession() {
        this.#session = await LanguageModel.create({
            initialPrompts: this.#messages,
            expectedInputLanguages: ['pt']
        })

        return this.#session
    }

    prompt(text) {
            this.#messages.push({
                role: 'user',
                content: text,
            })
            if (!this.#session) {
                throw new Error('Sessão não inicializada. Aguarde o carregamento do modelo antes de enviar mensagens.');
            }
            return this.#session.promptStreaming(this.#messages)
    }
}
