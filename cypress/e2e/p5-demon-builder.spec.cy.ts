describe('P5 Demon Builder Test', () => {
	beforeEach(() => {
		cy.visit('/p5/demon-builder')
	})
	describe('Successful Cases', () => {
		describe('Normal Fusions', () => {
			describe('No Name', () => {
				it('works with a normal, no-name, no-level, 1-depth, fusion', () => {
					cy.enterSkills(['Life Aid', 'Gigantomachia', 'Arms Master'])
					cy.pushButton('Calculate')
					cy.wait(5000)
					cy.checkNumberOfResults(190)
				})
				it('works with a normal, no-name, level, 1-depth, fusion', () => {
					cy.enterLevel(37)
					cy.enterSkills([
						'Mabufula',
						'Miracle Punch',
						'Attack Master',
					])
					cy.pushButton('Calculate')
					cy.wait(5000)
					cy.checkNumberOfResults(139)
				})
			})
			describe('Name', () => {
				it('works with a normal, named, no-level, ', () => {
					cy.enterName('Mara')
					cy.enterSkills(['Absorb Fire', 'Mapsio', 'Diarahan'])
					cy.pushButton('Calculate')
					cy.wait(6000)
					cy.checkNumberOfResults(70)
				})
				it('works with a normal, named, level, fusion', () => {
					cy.enterName('Sandman')
					cy.enterLevel(27)
					cy.enterSkills([
						'Pulinpa',
						'Confuse Boost',
						'Dodge Phys',
						'Sharp Student',
					])
					cy.pushButton('Calculate')
					cy.wait(4000)
					cy.checkNumberOfResults(14)
				})
				it('works with a normal, named, no-level, 2+ depth, ', () => {
					cy.enterName('Mara')
					cy.enterSkills([
						'Absorb Fire',
						'Regenerate 1',
						'Invigorate 1',
						'Growth 1',
					])
					cy.enterRecurDepth(2)
					cy.pushButton('Calculate')
					cy.wait(62000)
					cy.checkNumberOfResults(30)
				})
				it('works with a normal, named, level, 2+ depth, ', () => {
					cy.enterName('Jack Frost')
					cy.enterLevel(43)
					cy.enterSkills([
						'Mazio',
						'Regenerate 1',
						'Invigorate 1',
						'Growth 1',
					])
					cy.enterRecurDepth(3)
					cy.pushButton('Calculate')
					cy.checkNumberOfResults(5)
				})
			})
		})
		describe('Special Fusion', () => {
			describe('No Name', () => {
				it('works with a special, no-name, no-level, 1-depth, fusion', () => {
					cy.enterSkills([
						'Die For Me!',
						'Invigorate 3',
						'Regenerate 3',
						'Growth 3',
					])
				})
				it('works with a special, no-name, level, 1-depth, fusion ', () => {
					cy.enterLevel(79)
					cy.enterSkills([
						'Die For Me!',
						'Ambient Aid',
						'Makajamaon',
						'Mudo',
					])
				})
				it('works with a special, no-name, no-level,2+ depth, fusion', () => {
					cy.enterSkills([
						'Demonic Decree',
						'Mamudo',
						'Invigorate 1',
						'Regenerate 3',
					])
					cy.enterRecurDepth(4)
					cy.pushButton('Calculate')
					cy.wait(11000)
					cy.checkNumberOfResults(124)
				})
				it('works with a special, no-name, level, 2+ depth,  fusion', () => {
					cy.enterLevel(85)
					cy.enterSkills([
						'Demonic Decree',
						'Mamudo',
						'Invigorate 1',
						'Regenerate 3',
					])
					cy.enterRecurDepth(4)
					cy.pushButton('Calculate')
					cy.wait(11000)
					cy.checkNumberOfResults(93)
				})
			})
			describe('Name', () => {
				it('works with a special, named, no-level, 1-depth fusion', () => {
					cy.enterName('Neko Shogun')
					cy.enterSkills(['Dekaja'])
					cy.pushButton('Calculate')
					cy.checkNumberOfResults(1)
				})
			})
			it('works with a special, named, level, 1-depth, fusion', () => {
				cy.enterName('Beelzebub')
				cy.enterLevel(84)
				cy.enterSkills(['Resist Fear', 'Mamudo', 'Regenerate 3'])
				cy.pushButton('Calculate')
				cy.wait(3)
				cy.checkNumberOfResults(3)
			})
			it('works with a special, named, no-level, 2+ depth, fusion', () => {
				cy.enterName('Beelzebub')
				cy.enterSkills([
					'Resist Fear',
					'Mamudo',
					'Invigorate 1',
					'Regenerate 3',
				])
				cy.enterRecurDepth(4)
				cy.pushButton('Calculate')
				cy.wait(5)
				cy.checkNumberOfResults(71)
			})
			it('works with a special, named, level, 2+ depth, fusion', () => {
				cy.enterName('Beelzebub')
				cy.enterLevel(84)
				cy.enterSkills([
					'Resist Fear',
					'Mamudo',
					'Invigorate 1',
					'Regenerate 3',
				])
				cy.enterRecurDepth(4)
				cy.pushButton('Calculate')
				cy.wait(3)
				cy.checkNumberOfResults(44)
			})
		})
	})

	describe('Failing Cases', () => {
		//Failing cases
		it('fails because the level is too for the demon', () => {
			cy.enterName('Mara')
			cy.enterLevel(10)
			cy.enterSkills(['Zio'])
			cy.pushButton('Calculate')
			cy.checkError(Errors.LevelDemon)
		})
		it('fails because the level is too low for one of the skills', () => {
			cy.enterLevel(17)
			cy.enterSkills(['Maragion'])
			cy.pushButton('Calculate')
			cy.checkError(Errors.LevelSkill)
		})
		//TODO bad output because its tries to build alice, so it switches to a named function
		it.skip('fails because the level is too low for one of the special skills', () => {
			cy.get('.demon-form-field').eq(1).click().type('17')
			cy.get('.skill-form-field').first().click().type('Die For Me!')
			cy.get('button').contains('Calculate').click()
			cy.get('.build-results').should(
				'contain',
				'You have specified a level that is lower than the minimum required level to learn'
			)
		})
		it("fails because the demon can't learn a unique skills", () => {
			cy.enterName('Agathion')
			cy.enterSkills(['Die For Me!'])
			cy.pushButton('Calculate')
			cy.checkError(Errors.Unique)
		})
		it("fails because the demon can't inherit a type of a specified skill", () => {
			cy.enterName('Agathion')
			cy.enterSkills(['Garu'])
			cy.pushButton('Calculate')
			cy.checkError(Errors.InheritType)
		})
		it("fails because the demon can't inherit that many skills; with name", () => {
			cy.enterName('Sandman')
			cy.enterSkills([
				'Pulinpa',
				'Confuse Boost',
				'Dodge Phys',
				'Sharp Student',
				'Bufu',
				'Magaru',
				'Agi',
				'Garu',
			])
			cy.pushButton('Calculate')
			cy.checkError(Errors.InheritLimit)
		})
		it("fails because the demon can't inherit that many skills; without name", () => {
			cy.enterSkills([
				'Auto-Maraku',
				'Auto-Mataru',
				'Auto-Masuku',
				'Absorb Phys',
				'Absorb Bless',
				'Absorb Nuke',
				'Sharp Student',
				'Life Aid',
			])
			cy.pushButton('Calculate')
			cy.checkError(Errors.InheritLimit)
		})
		it('fails because the demon is a treasure demon', () => {
			cy.enterName('Hope Diamond')
			cy.enterSkills(['Mapsio'])
			cy.pushButton('Calculate')
			cy.checkError(Errors.Treasure)
		})
	})
})
enum Errors {
	LevelSkill = 'You have specified a level that is lower than the minimum required level to learn',
	LevelDemon = 'The name of the demon you entered has a minimum level greater than the level you specified.',
	InheritType = 'Every Persona has an inheritance type that bars them from learning certain skills. For example persona with inheritance type of Fire cannot inherit Ice skills. You have specified a Persona with an inheritance type that forbids them from learning a skill you have specified.',
	InheritLimit = 'In Persona 5, a normal demon can only inherit a maximum of 4 skills (special demons can inherit 5). Since you specificed more than that, your specified demon must be able to learn at least one of the other specificed skills on their own. Unfortunately, they cannot.',
	Unique = 'You entered a skill that is unique to',
	Treasure = 'The name of the demon you entered is a treasure demon, and cannot be fused.',
}
