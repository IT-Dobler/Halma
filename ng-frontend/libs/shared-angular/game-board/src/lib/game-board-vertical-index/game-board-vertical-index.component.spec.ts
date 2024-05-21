import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameBoardVerticalIndexComponent } from './game-board-vertical-index.component';

describe('GameBoardVerticalIndexComponent', () => {
    let component: GameBoardVerticalIndexComponent;
    let fixture: ComponentFixture<GameBoardVerticalIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameBoardVerticalIndexComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GameBoardVerticalIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
