import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeComponent } from './node.component';
import { GameBoardStore } from '../state/game-board.store';
import { Color } from '../state/models/color';
import { NodeType } from '../state/models/node';

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
        component.node = { id: '', color: Color.NONE, type: NodeType.EMPTY };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
