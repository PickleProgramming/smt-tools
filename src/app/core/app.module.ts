import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { HeaderComponent } from './components/header/header.component'
import { FooterComponent } from './components/footer/footer.component'
import { GameWrapperComponent } from './components/game-wrapper/game-wrapper.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		GameWrapperComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		NgbModule,
		BrowserAnimationsModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
