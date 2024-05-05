import { Component } from "@angular/core"

@Component({
	selector: "app-p5-bookmarks",
	templateUrl: "./p5-bookmarks.component.html",
	styleUrls: ["./p5-bookmarks.component.sass"],
})
export class P5BookmarksComponent {
	links: { title: string; url: string }[] = [
		{ title: "Persona List", url: "personas" },
		{ title: "Skill List", url: "skills" },
		{ title: "Fusion Table", url: "fusion-table" },
		{ title: "Chain Calculator", url: "fusion-chain" },
		{ title: "DLC Settings", url: "settings" },
	]
}
