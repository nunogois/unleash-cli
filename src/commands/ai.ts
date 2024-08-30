import inquirer from 'inquirer'
import { createSpinner } from 'nanospinner'
import { config } from '../utils/config'
import { logger } from '../utils/logger'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { ai } from '../utils/ai'

export const command: string = 'ai'
export const desc: string = 'Interact with Unleash using an AI assistant'

export const handler = async () => {
  const conversationHistory: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        "You are an assistant that interacts with the Unleash API. You should ask the user in case you're missing any required information. Ask the user, never assume information that you're not sure about."
    }
  ]

  while (true) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'prompt',
        message: 'Unleash AI>'
      }
    ])

    const prompt = answers.prompt.trim()

    if (prompt.toLowerCase() === 'exit' || prompt.toLowerCase() === 'quit') {
      logger.info('Exiting...')
      break
    }

    conversationHistory.push({ role: 'user', content: prompt })

    const spinner = createSpinner('Processing...').start()
    const response = await ai(conversationHistory, spinner)

    conversationHistory.push({ role: 'assistant', content: response })
  }
}
