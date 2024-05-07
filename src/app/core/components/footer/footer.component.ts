import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
	selector: 'app-footer',
	styleUrls: ['./footer.component.scss'],
	template: `
		<div>
			<a
				id="github"
				href="https://github.com/PickleProgramming/smt-tools">
				<img src="assets/img/github-logo.png" />
			</a>
		</div>
	`,
})
export class FooterComponent implements OnInit {
	constructor(private router: Router) {}

	ngOnInit(): void {}
}
