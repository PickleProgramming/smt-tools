describe('P5 Demon Builder Test', () => {
	beforeEach(() => {
		cy.visit('/p5/fusion-chain')
	})
	describe('Successful Cases', () => {
		describe('Normal Fusions', () => {
			describe('No Name', () => {
				it('works with a normal, no-name, no-level, 1-depth, fusion', () => {
					cy.get('.skill-form-field').eq(0).click().type('Life Aid')
					cy.get('.skill-form-field')
						.eq(1)
						.click()
						.type('Gigantomachia')
					cy.get('.skill-form-field')
						.eq(2)
						.click()
						.type('Arms Master')
					cy.get('button').contains('Calculate').click()
					cy.get('.build-results').should(
						'contain',
						'29 successful recipes found.'
					)
				})
				it('works with a normal, no-name, level, 1-depth, fusion', () => {
					cy.get('.demon-form-field').eq(1).click().type('37')
					cy.get('.skill-form-field')
						.first()
						.click()
						.type('Miracle Punch')
					cy.get('.skill-form-field').eq(1).click().type('Mabufula')
					cy.get('.skill-form-field')
						.eq(2)
						.click()
						.type('Attack Master')
					cy.get('button').contains('Calculate').click()
					cy.get('.build-results').should(
						'contain',
						'33 successful recipes found.'
					)
				})
				//TODO
				/* it('works with a normal, no-name, no-level, 2+ depth, fusion', () => {
					cy.get('.skill-form-field').first().click().type('Dekaja')
                }) */
				//TODO
				/* it('works with a normal, no-name, level, 2+ depth, fusion', () => {
					cy.get('.skill-form-field').first().click().type('Dekaja')
				}) */
			})
			describe('Name', () => {
				//TODO
				/* it('works with a normal, named, no-level, ', () => {
					cy.get('.demon-form-field')
						.first()
						.click()
						.type('Neko Shogun')
					cy.get('.skill-form-field').first().click().type('Dekaja')
				}) */
				it('works with a normal, named, level, ', () => {
					cy.get('.demon-form-field').first().click().type('Sandman')
					cy.get('.demon-form-field').eq(1).click().type('26')
					cy.get('.skill-form-field').eq(0).click().type('Pulinpa')
					cy.get('.skill-form-field')
						.eq(1)
						.click()
						.type('Confuse Boost')
					cy.get('.skill-form-field').eq(2).click().type('Dodge Phys')
					cy.get('.skill-form-field')
						.eq(3)
						.click()
						.type('Sharp Student')
					cy.get('button').contains('Calculate').click()
					cy.get('.build-results').should(
						'contain',
						'10 successful recipes found.'
					)
				})
				//TODO
				/* it('works with a normal, named, no-level, 2+ depth, ', () => {
					cy.get('.demon-form-field')
						.first()
						.click()
						.type('Neko Shogun')
					cy.get('.skill-form-field').first().click().type('Dekaja')
				}) */
				//TODO
				/* it('works with a normal, named, level, 2+ depth, ', () => {
					cy.get('.demon-form-field')
						.first()
						.click()
						.type('Neko Shogun')
					cy.get('.skill-form-field').first().click().type('Dekaja')
				}) */
			})
		})
		describe('Special Fusion', () => {
			describe('No Name', () => {
				//TODO
				/* it('works with a special, no-name, no-level, 1-depth, fusion', () => {})
				it('works with a special, no-name, level, 1-depth, fusion ', () => {
					cy.get('.skill-form-field').first().click().type('Dekaja')
				})
				it('works with a special, no-name, no-level,2+ depth, fusion', () => {
					cy.get('.skill-form-field').first().click().type('Dekaja')
				})
				it('works with a special, no-name, level, 2+ depth,  fusion', () => {
					cy.get('.skill-form-field').first().click().type('Dekaja')
				}) */
			})
			describe('Name', () => {
				it('works with a special, named, no-level, 1-depth fusion', () => {
					cy.get('.demon-form-field')
						.first()
						.click()
						.type('Neko Shogun')
					cy.get('.skill-form-field').first().click().type('Dekaja')
					cy.get('button').contains('Calculate').click()
					cy.get('.build-results').should(
						'contain',
						'1 successful recipes found.'
					)
				})
				/* it('works with a special, named, level, 1-depth, fusion', () => {
					cy.get('.demon-form-field')
						.first()
						.click()
						.type('Neko Shogun')
					cy.get('.skill-form-field').first().click().type('Dekaja')
				})
				it('works with a special, named, no-level, 2+ depth, fusion', () => {
					cy.get('.demon-form-field')
						.first()
						.click()
						.type('Neko Shogun')
					cy.get('.skill-form-field').first().click().type('Dekaja')
				})
				it('works with a special, named, level, 2+ depth, fusion', () => {
					cy.get('.demon-form-field')
						.first()
						.click()
						.type('Neko Shogun')
					cy.get('.skill-form-field').first().click().type('Dekaja')
				}) */
			})
		})
	})
	describe('Failing Cases', () => {
		//Failing cases
		it('fails because the level is too for the demon', () => {
			cy.get('.demon-form-field').first().click().type('Mara')
			cy.get('.demon-form-field').eq(1).click().type('10')
			cy.get('button').contains('Calculate').click()
			cy.get('.build-results').should(
				'contain',
				'The name of the demon you entered has a minimum level greater than the level you specified.'
			)
		})
		it('fails because the level is too low for one of the skills', () => {
			cy.get('.demon-form-field').eq(1).click().type('17')
			cy.get('.skill-form-field').first().click().type('Maragion')
			cy.get('button').contains('Calculate').click()
			cy.get('.build-results').should(
				'contain',
				'You have specified a level that is lower than the minimum required level to learn'
			)
		})
		//TODO bad output because its tries to build alice, so it switches to a named function
		/* it('fails because the level is too low for one of the special skills', () => {
			cy.get('.demon-form-field').eq(1).click().type('17')
			cy.get('.skill-form-field').first().click().type('Die For Me!')
			cy.get('button').contains('Calculate').click()
			cy.get('.build-results').should(
				'contain',
				'You have specified a level that is lower than the minimum required level to learn'
			)
		}) */
		it("fails because the demon can't learn a unique skills", () => {
			cy.get('.demon-form-field').first().click().type('Agathion')
			cy.get('.skill-form-field').first().click().type('Die For Me!')
			cy.get('button').contains('Calculate').click()
			cy.get('.build-results').should(
				'contain',
				'You entered a skill that is unique to'
			)
		})
		it("fails because the demon can't inherit a type of a specified skill", () => {
			cy.get('.demon-form-field').first().click().type('Agathion')
			cy.get('.skill-form-field').first().click().type('Garu')
			cy.get('button').contains('Calculate').click()
			cy.get('.build-results').should(
				'contain',
				'Every Persona has an inheritance type that bars them from learning certain skills. For example persona with inheritance type of Fire cannot inherit Ice skills. You have specified a Persona with an inheritance type that forbids them from learning a skill you have specified.'
			)
		})
		it("fails because the demon can't inherit that many skills; with name", () => {
			cy.get('.demon-form-field').first().click().type('Sandman')
			cy.get('.skill-form-field').eq(0).click().type('Pulinpa')
			cy.get('.skill-form-field').eq(1).click().type('Confuse Boost')
			cy.get('.skill-form-field').eq(2).click().type('Dodge Phys')
			cy.get('.skill-form-field').eq(3).click().type('Sharp Student')
			cy.get('.skill-form-field').eq(4).click().type('Bufu')
			cy.get('.skill-form-field').eq(5).click().type('Magaru')
			cy.get('.skill-form-field').eq(6).click().type('Agi')
			cy.get('.skill-form-field').eq(7).click().type('Garu')
			cy.get('button').contains('Calculate').click()
			cy.get('.build-results').should(
				'contain',
				'In Persona 5, a normal demon can only inherit a maximum of 4 skills (special demons can inherit 5). Since you specificed more than that, your specified demon must be able to learn at least one of the other specificed skills on their own. Unfortunately, they cannot.'
			)
		})
		it("fails because the demon can't inherit that many skills; without name", () => {
			cy.get('.skill-form-field').eq(0).click().type('Auto-Maraku')
			cy.get('.skill-form-field').eq(1).click().type('Auto-Mataru')
			cy.get('.skill-form-field').eq(2).click().type('Auto-Masuku')
			cy.get('.skill-form-field').eq(3).click().type('Absorb Phys')
			cy.get('.skill-form-field').eq(4).click().type('Absorb Bless')
			cy.get('.skill-form-field').eq(5).click().type('Absorb Nuke')
			cy.get('.skill-form-field').eq(6).click().type('Sharp Student')
			cy.get('.skill-form-field').eq(7).click().type('Life Aid')
			cy.get('button').contains('Calculate').click()
			cy.get('.build-results').should(
				'contain',
				'In Persona 5, a normal demon can only inherit a maximum of 4 skills (special demons can inherit 5). Since you specificed more than that, your specified demon must be able to learn at least one of the other specificed skills on their own. Unfortunately, they cannot.'
			)
		})
		it('fails because the demon is a treasure demon', () => {
			cy.get('.demon-form-field').first().click().type('Hope Diamond')
			cy.get('.skill-form-field').first().click().type('Mapsio')
			cy.get('button').contains('Calculate').click()
			cy.get('.build-results').should(
				'contain',
				'The name of the demon you entered is a treasure demon, and cannot be fused.'
			)
		})
	})
})
