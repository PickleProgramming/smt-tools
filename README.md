# smt-tools

A series of tool to assist in fusing different personae/demons across the Shin Megami Tensei franchise of video games.

Currently supported games are:

*Persona 5 (kind of)

## Install

```
sudo snap install node --classic
npm install -g @angular/cli
git clone https://github.com/PickleProgramming/smt-tools.git
cd smt-tools
npm install
ng serve
```

Then you can navigate to http://127.0.0.1:4200/ to see the webpage

If you get an `EACCESS` error trying to globally install angular-cli you can follow this guide to setup an installation just for your user: https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally#reinstall-npm-with-a-node-version-manager

Using `sudo` is not recommended as it can lead to issues trying to update your projects to new versions of angular.

## Credits

JSON Data and Inspiration: https://github.com/aqiu384/megaten-fusion-tool
