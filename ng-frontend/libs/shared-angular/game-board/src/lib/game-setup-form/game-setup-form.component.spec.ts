import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameSetupFormComponent } from './game-setup-form.component';

describe('GameSetupComponent', () => {
    let component: GameSetupFormComponent;
    let fixture: ComponentFixture<GameSetupFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameSetupFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GameSetupFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
