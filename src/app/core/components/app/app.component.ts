import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  styleUrls: ["app.component.scss"],
  templateUrl: "app.component.html",
})
export class AppComponent {
  title = "smt-tools";
  links: { url: string; img: string; color: string }[] = [];

  constructor() {}

  events: string[] = [];
  opened: boolean = false;

  /**
   * Constructs information for the sidenav: routing path names, colors of the
   * links, and the location of the logo images.
   */
  buildGames() {
    let abbrvs: { abbrv: string; color: string }[] = [
      { abbrv: "p5", color: "#c10b0a" },
      { abbrv: "p5r", color: "#c10b0a" },
      { abbrv: "p4g", color: "#fcc203" },
      { abbrv: "smt4", color: "#520c85" },
      { abbrv: "smt3hd", color: "#000000" },
      { abbrv: "smtsjr", color: "#095709" },
      { abbrv: "pq2", color: "#9105f5" },
      { abbrv: "p3p", color: "#ffffff" },
    ];
    let logos = "assets/img/game-logos/";
    for (let game of abbrvs) {
      this.links.push({
        url: game.abbrv,
        img: logos + game.abbrv + ".png",
        color: game.color,
      });
    }
  }

  ngOnInit() {
    this.buildGames();
  }
}
