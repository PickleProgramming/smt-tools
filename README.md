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

### Bootstrap
While Bootstrap is supplying me with a variety of great tools, what am I supposed to do when I want to slightly change something? Am I supposed to extend the scss class? Am I supposed to just override something?
#### Nav Tabs
I have gotten the logos for the different games to be the right size, however the Bootstrap navtabs automatically grow to their max size, so they all end up on their own row anyway. I guess I need to ext end the Bootstrap navbar class.