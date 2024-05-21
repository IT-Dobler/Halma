import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardIndexComponent } from './board-index.component';

describe('BoardIndexComponent', () => {
    let component: BoardIndexComponent;
    let fixture: ComponentFixture<BoardIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BoardIndexComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BoardIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
