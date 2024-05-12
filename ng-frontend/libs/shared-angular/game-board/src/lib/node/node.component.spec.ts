import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeComponent } from './node.component';
import { GameBoardStore } from '../state/game-board.store';

describe('NodeComponent', () => {
    let component: NodeComponent;
    let fixture: ComponentFixture<NodeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NodeComponent],
            providers: [GameBoardStore],
        }).compileComponents();

        fixture = TestBed.createComponent(NodeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
