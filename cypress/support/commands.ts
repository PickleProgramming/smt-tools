// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('enterName', (demonName: string) => {
	cy.get('.demon-form-field').click().type(demonName)
})
Cypress.Commands.add('enterLevel', (level: number) => {
	cy.get('.level-form-field')
		.click()
		.type('' + level)
})
Cypress.Commands.add('enterSkills', (skills: string[]) => {
	skills.forEach((skill, index) => {
		cy.get('.skill-form-field').eq(index).click().type(skill)
	})
})
Cypress.Commands.add('enterRecurDepth', (depth: number) => {
	cy.get('.recur-form-field')
		.click()
		.type('' + depth)
})
Cypress.Commands.add('pushButton', (text: string) => {
	cy.get('button').contains(text).click()
})
Cypress.Commands.add('checkNumberOfResults', (amount: number) => {
	cy.get('.build-results').should(
		'contain',
		amount + ' successful recipes found.'
	)
})
Cypress.Commands.add('checkError', (error: string) => {
	cy.get('.build-results').should('contain', error)
})
