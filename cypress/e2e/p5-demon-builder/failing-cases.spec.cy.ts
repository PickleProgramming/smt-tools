describe('Failing Cases', () => {
	beforeEach(() => {
		cy.visit('/p5/demon-builder')
	})
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
	it('fails because the level is too low for one of the special skills', () => {
		cy.enterLevel(17)
		cy.enterSkills(['Die For Me!'])
		cy.pushButton('Calculate')
		cy.checkError(Errors.LevelSkill)
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
	it('fails with a special fusion that asks for 5 skills to be inheritted, but can only inherit 4', () => {
		cy.enterSkills([
			'Evil Smile',
			'Ghastly Wail',
			'Miracle Punch',
			'Apt Pupil',
			'Ailment Boost',
			'Die For Me!',
		])
		cy.pushButton('Calculate')
		cy.checkError(Errors.InheritType)
	})
})

enum Errors {
	LevelSkill = 'You have specified a level that is lower than',
	LevelDemon = 'The name of the demon you entered has a minimum level greater than the level you specified. The minimum level for',
	InheritType = 'Every Persona has an inheritance type that bars them from learning certain skills. For example persona with inheritance type of Fire cannot inherit Ice skills. In this case',
	InheritLimit = 'In Persona 5, a normal demon can only inherit a maximum of 4 skills (special demons can inherit 5). Since you specificed more than that, your specified demon must be able to learn at least one of the other specificed skills on their own. Unfortunately, they cannot.',
	Unique = 'You entered a skill that is unique to',
	Treasure = 'The name of the demon you entered is a treasure demon, and cannot be fused.',
	AlreadyLearns = 'already learns all the skills you specified by level',
}
