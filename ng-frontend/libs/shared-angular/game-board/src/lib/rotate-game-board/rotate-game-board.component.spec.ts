import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RotateGameBoardComponent } from './rotate-game-board.component';

describe('RotateGameBoardComponent', () => {
    let component: RotateGameBoardComponent;
    let fixture: ComponentFixture<RotateGameBoardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RotateGameBoardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RotateGameBoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
