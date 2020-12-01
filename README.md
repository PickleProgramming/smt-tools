# smt-tools
This is a project that started as a fork from this calculator: https://chinhodado.github.io/persona5_calculator/#/list . I wanted to add the function that if you inputted skills, the site would give you a fusion chain to create the desired persona. But as I worked to expand the site I quickly realized that there were several problems with this site. The Angular was all wrong, chinhodado had used Semantic UI with Angular which is designed to be used with React, not angular, his version of Angular was very outdated, and it seemed like he hadn't used any of the helpful tools that angular provides to make your project modular and streamlined. The sources he used for his database were riddled with errors, and *all* of the translations for P5R were different from the American localization. And the Persona that required complex fusion chains like Izanagi-No-Okami just didn't work. Then, I found this calculator: https://aqiu384.github.io/megaten-fusion-tool/p5r/personas . And while it doesn't look that great, has all the SMT games and none of the issues that chnhodado's calculator had. Its as modular as could be, is up-to-date with Angular 7, and aqiu384 is making corrections to the database as the community finds them.

Instead of slowly migrating chinhodado's project into the same state that aqiu384's is I decided to start from scratch with a new package and just give credit to aqiu384 and chinhodado for the parts of their code that I use. I still plan on using some of the backend functions for chinhodado's code and am probably going to use almost all of aqiu384's backend with a handful of tweaks, while making the front end look more presentable and adding in my own chain-building functions.

# The Journey

I like to thoroughly document my process for setup on new projects as when I come back to them 8 months later and I have no idea what I was doing I can quickly jog my memory, or start the whole thing again from scratch without having to find every resource I was using.

## Initial Setup
### Angular
I started with this tutorial here: https://aqiu384.github.io/megaten-fusion-tool/p5r/personas

```
cd /var/www
npm install -g @angular/cli
sudo ng new smt-tools
cd smt-tools
```
Since I'm a big fan of Bootstrap, I was elated to hear that ng-bootstrap made it so easy to use Bootstrap with Angular: `ng add @ng-bootstrap/ng-bootstrap`
From there I created this repository and pushed the first commit here. Then I built the initial landing page `ng build --prod`
### Nginx
```
vim /etc/nginx/sites-available/smt-tools
sudo ln -s /etc/nginx/sites-available/smt-tools /etc/nginx/sites-enables/smt-tools
sudo systemctl resteart nginx
```
smt-tools:
```
server {
        listen 4200;
        listen [::]:4200;
    server_name www.smt-tools.com, smt-tools.com;
    root /var/www/smt-tools/dist/smt-tools;
    index index.html;
    location / {
        try_files $uri$args $uri$args/ /index.html;
    }
}
```
After that I was able to go to the server on the port 4200 and see the base Angular 11 landing page.
## Learning Angular
As the previous iteration of the calculator was my first experience with Angular, it took me a while to understand that chinhodado's implementation kinda of defeated the purpose of Angular, and this will be my first attempt to create something like the modular setup that aqiu384 has.
This is my lazy and rough mockup of what I would want the site to look like:
TODO: Add image here :)
### Live Environment
Working from a server, initially I thought I wouldn't be able to use `ng serve` as that only worked on localhost, but thanks to Nathan Friends article (https://codinglatte.com/posts/angular/working-with-assets-styles-and-scripts-in-angular/) I was able to set up a reverse proxy that can let me use all the handy features of `ng serve` without running it on my main computer.
I added this block to my `/etc/nginx/sites-available/smt-tools/`
```
location ^~ /d/ {
    proxy_pass http://127.0.0.1:4201/;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_http_version 1.1;
    proxy_cache_bypass $http_upgrade;
}
```
And now when I go to `192.168.7.x/dev/` I can see the live environment that `ng serve` is hosting.
### Header and Footer
```
ng g component components/header
ng g component components/footer
```
I then deleted the placeholder code in `app.component.html` and replaced it with this:
```
<app-header></app-header>
<router-outlet></router-outlet>
<app-footer></app-footer>
```
### Assets
The first thing that really threw me off was that despite the fact that the header component is in the `app/component/header` file, I still call images simply using `assets/imgs/.../example.png`. This is awesome and so much better than the alternatives, but still tripped me up at first.
### Translation
My biggest hangup with Angular my first time around is that since I'm not that familiar with CSS I would look up how to do what I wanted on things like StackOverflow, CSS-Tricks, or even W3School and they would all tell me to use JQuery for something. Then I'd try to use JQuery with Angular and I would break something.
This time around, now that I have a much more stable and Angular intended environment, I'm having an easier time attempting to fill in the JQuery bits with Angular bits instead, as the Angular developers intended.
Specifically, I want something like this nice rounded tab implementation you can see here: https://css-tricks.com/better-tabs-with-round-out-borders/ but, it also calls for JQuery. I don't think there's any reason to *actually* use JQuery here since I'm already running Angular.
### JSON
In order to import objects from a JSON file I needed to add these lines to my `tsconfig.json`:
```
{
	...
	"compilerOptions":{
		...
		"resolveJsonModule": true,
		"esModuleInterop": true,
		...
	},
	...
}
```
## CSS
After about 30 minutes of scraping and finding why my flex items weren't centering vertically in my navrow I learned that `align-content:` and `align-items` are two different things.
### SASS
I love SASS. Can't believe I ever did any CSS without it, and I didn't do that much. Loops, lists, maps, makes everything so much easier.

## Structure
I'm not 100% of all the logic behind all of aqui384's decisions, but it seems like his directory structure is ideal. It seems like it would be relativley trivial to add a new game to his setup if he was just given the data for every demon and a fusion chart. Assuming there weren't any wild new features like QR codes or passwords.
That being said, its been difficult for me to decipher his app routing and structure as an Angular amatuer and the lack of any comments in his code. As best I can tell he has his base compendium module, and then every game gets its own module and extends the base compendium module in some fashion and add's its own quirks to it.
### Confusion
aqui384 has a compendium module seperate from any game, and after hours of hair pulling and reading Angular documentation I think I finally figured it out. I can't anymore if he's just modularizing everything and using a confusing naming strucutre, or if the whole setup is confusing and poorly planned. If you look at his webpage you can tell there's the 'Games List' component, the 'Tools Navigation' component (Persona, Enemies, Fusion Chart links, etc.), and finally the Table component. Now, two of these three components are all named 'compendium' in aqiu384's project. And not 'base-compendium.component.ts' and 'p5r-compendium.component.ts', but literally the exact same file name. 36 files, all named the same thing in different folders. I can't see a reason for this other than laziness, but maybe I'm wrong. Anway, say you wanted to look at the list of persona in P5R, here's the route through the code Angular would follow, to my understanding:

(`index.html`: `<app-root></app-root>`) -> 
(`app/app.component.ts`: `<router-outlet></router-outlet>`) -> 
(`app/app-routing.module.ts`: `loadChildren: './p5r/compendium.module#CompendiumModule'`) -> 
(`app/p5r/compendium.module` : `P5CompendiumModule`) -> #No that is not a typo, the p5r module points to the p5 module
(`app/p5/compendium.module`: `app/p5/components/compendium/component`) ->
(`app/p5/components/compendium/component`: `app-demon-compendium`) -> 
(`app/compendium/components/compendium.component.ts`: `<router-outlet></router-outlet>`) -> 
(`app/p5/compendium-routing.module.ts`: `DemonEntryContainerComponent`) -> 
(`app/p5/components/demon-entry.component.ts`)

And the `demon-entry.component.ts` in `app/p5/components`, not to be confused with the 36 other `demon-entry.component.ts`s, has all the HTML for the table you see when you click Persona 5. Writing it all out I can see the logic behind it. But this little chain I wrote doesn't properly convey how strange and confusing it is with no documentation, countless overloaded variables containing paths to questionable places. I think I still will use the same structure aqiu384 did, but I'm definitely using different naming conventions.

## Fixes
### Angular
Angular Live and Visual Studio Code would often spit out this error: `Error: ENOSPC: System limit for number of file watchers reached, watch '/x/x/x/x/x'`
The fix was pretty straight forward, add more watchers: `sudo echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`
### SASS
#### ~
All over the web youll see people using Angular and SASS using things like `@import ~x.scss` but this doesn't work anymore. `~` now popints to the `/var/www/smt-tools` in my case and I need to add `src` infront of it. This took me too long to figure out
#### Global variables
I want to just have a global list of games for SASS so I can iterate through them without needing to type out each one everytime, but there aren't global variable really. Even if you import a variable file into your "global" scss style sheet, the still won't be in scope and *every* component will need to import that variable sheet.
I found a "solution" here: https://stackoverflow.com/questions/55131372/global-scss-variables-for-angular-components-without-importing-them-everytime which mostly works, but the syntax necessary makes things like @mixins and @each loops impossible, so I can't use it.

## Expansion
To add in the initial P5R module I did the following:
```
cd src/app/modules/games
ng g module p5r
cd p5r
ng g component components/compendium
```
Then I created the file `p5r-routing.module.ts` and added this to it:
```
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompendiumComponent } from './components/compendium/compendium.component';

const routes: Routes = [
	{ path: '', component: CompendiumComponent }
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class P5RRoutingModule { }
```
Finally I added this to the `routes` array in the `app-routing.module.ts` file:
```
{
	path: 'p5r',
	loadChildren: () => import('./modules/games/p5r/p5r.module').then(m => m.P5rModule)
}
```