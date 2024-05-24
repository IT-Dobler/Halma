import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameBoardHorizontalIndexComponent } from './game-board-horizontal-index.component';

describe('GameBoardHorizontalIndexComponent', () => {
    let component: GameBoardHorizontalIndexComponent;
    let fixture: ComponentFixture<GameBoardHorizontalIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameBoardHorizontalIndexComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GameBoardHorizontalIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
