import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardIndexComponent } from './board-index.component';
import {input} from "@angular/core";

describe('BoardIndexComponent', () => {
    let component: BoardIndexComponent;
    let fixture: ComponentFixture<BoardIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BoardIndexComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BoardIndexComponent);
        component = fixture.componentInstance;
        component.bounds = input({width:0, height:0, cornerSize:0});
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
