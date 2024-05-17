// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// When a command from ./commands is ready to use, import with `import './commands'` syntax
// import './commands';
import './commands'

// Since I'm using Errors as a control structure in demon builder, I don't want cypress to fail on uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
	return false
})

export {}
declare global {
	namespace Cypress {
		interface Chainable {
			// add custom commands here
			/**
			 * Fills Demon form with given string
			 *
			 * @param demonName Name of demon to enter into form
			 */
			enterName(demonName: string): void
			/**
			 * Fills level form with given number
			 *
			 * @param level Number to enter into form
			 */
			enterLevel(level: number): void
			/**
			 * Fills skill form with given skills
			 *
			 * @param skills Skills to enter into form
			 */
			enterSkills(skills: string[]): void
			/**
			 * Fills Recursize Depth form with given number
			 *
			 * @param depth Number to enter into form
			 */
			enterRecurDepth(depth: number): void
			/**
			 * Pushes a button with the given label
			 *
			 * @param text Label of button to push
			 */
			pushButton(text: string): void
			/**
			 * Checks the number of results from a completed calculation
			 *
			 * @param amount The number of results that should be found
			 */
			checkNumberOfResults(amount: number): void
			/**
			 * Checks the error message from the last calculation
			 *
			 * @param error The error message
			 */
			checkError(error: string): void
		}
	}
}
