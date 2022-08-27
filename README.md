# smt-tools
This is a project that started as a fork from this calculator: https://chinhodado.github.io/persona5_calculator/#/list . I wanted to add the function that if you inputted skills, the site would give you a fusion chain to create the desired persona. But as I worked to expand the site I quickly realized that there were several problems with this site. The Angular was all wrong, chinhodado had used Semantic UI with Angular which is designed to be used with React, not angular, his version of Angular was very outdated, and it seemed like he hadn't used any of the helpful tools that angular provides to make your project modular and streamlined. The sources he used for his database were riddled with errors, and *all* of the translations for P5R were different from the American localization. And the Persona that required complex fusion chains like Izanagi-No-Okami just didn't work. Then, I found this calculator: https://aqiu384.github.io/megaten-fusion-tool/p5r/personas . And while it doesn't look that great, has all the SMT games and none of the issues that chnhodado's calculator had. Its as modular as could be, is up-to-date with Angular 7, and aqiu384 is making corrections to the database as the community finds them.

Instead of slowly migrating chinhodado's project into the same state that aqiu384's is I decided to start from scratch with a new package and just give credit to aqiu384 and chinhodado for the parts of their code that I use. I still plan on using some of the backend functions for chinhodado's code and am probably going to use almost all of aqiu384's backend with a handful of tweaks, while making the front end look more presentable and adding in my own chain-building functions.

## My Structure
### src/app/core
This is where I put the elements that are standard across all games no matter what game is currently in view.
### src/app/games
Each game recieves it's own module along with any components unique to that game.
#### src/games/[GAME]/[GAME]-data-models.ts
These are the files where I will define all of the standard objects for each game. Each game's Compendium, for example, is unique, but every game still has that object.
### src/app/shared
This is where any services, directives, data, or constants go that are used by at least 2 games.


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

After some time this method with nginx just stopped working. Nothing really changed other than I was adding components as I had been then just *poof* nginx started throwing "internal redirection error" cycles. I looked into it a little, but couldn't figure out why it suddenly started throwing the errors. I couldn't find an easy way around it, so I just started using the command `ng serve --host 0.0.0.0` 
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

That being said, it's still got a lot of very strange and confusing syntax. Not that every language doesn't at first, but particularly with SASS the import system still feels arcane to me.

## Structure
I'm not 100% of all the logic behind all of aqui384's decisions, but it seems like his directory structure is ideal. It seems like it would be relativley trivial to add a new game to his setup if he was just given the data for every demon and a fusion table. Assuming there weren't any wild new features like QR codes or passwords.
That being said, its been difficult for me to decipher his app routing and structure as an Angular amatuer and the lack of any comments in his code. As best I can tell he has his base compendium module, and then every game gets its own module and extends the base compendium module in some fashion and add's its own quirks to it.

After some time away, I decided I wouldn't follow his directory structure exactly, but still something close to it. Looking at a lot of Angular tutorials it seems like they don't really encourage inheritance and abstraction but aqiu384 forced his way into it. I think I can do it without so many obtuse shortcuts and hacks that he used.

### Confusion
aqui384 has a compendium module seperate from any game, and after hours of hair pulling and reading Angular documentation I think I finally figured it out. I can't tell anymore if he's just modularizing everything and using a confusing naming strucutre, or if the whole setup is confusing and poorly planned. If you look at his webpage you can tell there's the 'Games List' component, the 'Tools Navigation' component (Persona, Enemies, Fusion Table links, etc.), and finally the Table component. Now, two of these three components are all named 'compendium' in aqiu384's project. And not 'base-compendium.component.ts' and 'p5r-compendium.component.ts', but literally the exact same file name. 36 files, all named the same thing in different folders. I can't see a reason for this other than laziness, but maybe I'm wrong. Anway, say you wanted to look at the list of persona in P5R, here's the route through the code Angular would follow, to my understanding:

(`index.html`: `<app-root></app-root>`) -> 
(`app/app.component.ts`: `<router-outlet></router-outlet>`) -> 
(`app/app-routing.module.ts`: `loadChildren: './p5r/compendium.module#CompendiumModule'`) -> 
(`app/p5r/compendium.module` : `P5CompendiumModule`) -> #No that is not a typo, the p5r module to the p5 module since they're pretty much the same game
(`app/p5/compendium.module`: `app/p5/components/compendium/component`) ->
(`app/p5/components/compendium/component`: `app-demon-compendium`) -> 
(`app/compendium/components/compendium.component.ts`: `<router-outlet></router-outlet>`) -> 
(`app/p5/compendium-routing.module.ts`: `DemonEntryContainerComponent`) -> 
(`app/p5/components/demon-entry.component.ts`)

And the `demon-entry.component.ts` in `app/p5/components`, not to be confused with the 36 other `demon-entry.component.ts`s, has all the HTML for the table you see when you click Persona 5. Writing it all out I can see the logic behind it. But this little chain I wrote doesn't properly convey how strange and confusing it is with no documentation, countless overloaded variables containing paths to questionable places. I think I still will use the same structure aqiu384 did, but I'm definitely using different naming conventions.
I have decided that this man did not plan any form of structure whatsoever, and when his project an ambitions ballooned, coming back to repair the structure seemed an increasiongly impossible task. All of the code looks great, except for the fact that he never used strict typing, leaving numerous instances of bad practice, but every works, works well, and while even just a little bit commenting would have helped *immensely* his naming conventions speak for themselves. Except in one instance, where he uses "SortFun" over and over and I have no idea what that means.
With all this in mind I am simply going to restructure everything according to this guide: https://itnext.io/choosing-a-highly-scalable-folder-structure-in-angular-d987de65ec7 and keep everything else. His use of abstract components allows for relatively easy extendability, and he already did all the leg work for the all the minute differences between fusion for the games, and collected all the data already. If he used more than a dozen CSS properties, wrote a least one comment per function, and structered this in any kind of sensical way, it would be perfect. But he didn't do those things, and the lack of such simple practices is driving me insane.

### Bootstrap
I'm at the point where I've finally gotten the infrastructure setup in a cohesive way that I understand and I'm ready to start making things look a little nicer. Instead of trying to teach my self CSS I'm going to try to get a handle on bootstrap. To install it to my angular project I just went to the root angular directory and used the command
`ng add @ng-bootstrap/ng-bootstrap`

ng-bootstrap doesn't cover tables at the moment...but I'll still be using it for a few other things in the future.

### Data Tables
I like the looks of this package: https://l-lin.github.io/angular-datatables/#/basic/zero-config so I'm going to give that a shot. Installing was a simple as
`ng add angular-datatables`

## Fixes
### Angular
Angular Live and Visual Studio Code would often spit out this error: `Error: ENOSPC: System limit for number of file watchers reached, watch '/x/x/x/x/x'`
The fix was pretty straight forward, add more watchers: `sudo echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`
### SASS
#### ~
All over the web youll see people using Angular and SASS using things like `@import ~x.scss` but this doesn't work anymore. `~` now popints to the `/var/www/smt-tools` in my case and I need to add `src` infront of it. This took me too long to figure out
#### Global variables
I want to just have a global list of games for SASS so I can iterate through them without needing to type out each one everytime, but there aren't global variable really. Even if you import a variable file into your "global" scss style sheet, the still won't be in scope and *every* component will need to import that variable sheet.
I found a "solution" here: https://stackoverflow.com/questions/55131372/global-scss-variables-for-angular-components-without-importing-them-everytime which mostly works, but the syntax necessary makes things like @mixins and @each loops impossible as far as I can tell, so I can't use it.

## Expansion
### Components
The first thing to ask yourself when adding a game is if that game is already in the database. For example, Persona 5 Royal should instantiate the different variables that it needs that are unique to the Royal version of the game, and then just route those to the Persona 5 version of the game. This will vary from game to game so I won't go into that here.
If you are adding a new base game, such as SMT4, you would start with the following:
```
cd /var/www/smt-tools/src/app/modules/games
ng g module smt4
cd smt4
touch smt4-routing.module.ts
mkdir components
cd components
ng g component smt4-fusion-table
ng g component smt4-demon-list
ng g component smt4-demon-entry
ng g component smt4-skill-list
```
The `demon-list` component will be used for the list of persona/demons and enemies, the `demon-entry` will be used to display more information when a demon/persona/enemy is selected from the list, the `skill-list` will be used to display a list of skills for each game, and the `fusion-table` will be used for the fusion table tab for each game.
from there you might need to generate more components depending on what else you'd like to include, like a persona game would need a `shadow-entry` component as well, or Strange Journey would need a password generator components, but that is the base for every initial release of a game. For creating a second release of a game, like P4G or P3P you'd only need the module and the data:
```
cd /var/www/smt-tools/src/app/modules/games
ng g module p4g
cd p4g
mkdir data
```



