import { inject, Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { map, Observable } from 'rxjs';
import { Move } from '@ng-frontend/generated-api-client';

@Injectable({ providedIn: 'root' })
export class LiveGameService {
    private readonly ROUTE = 'live-game/';
    private readonly webSocketService = inject(WebSocketService<Move>);

    private webSocketSubject!: WebSocketSubject<Move>;

    public joinGame(gameCode: string) {
        this.webSocketSubject = this.webSocketService.connect(this.ROUTE + gameCode);
    }

    public moves$(): Observable<Move> {
        return this.webSocketSubject.asObservable().pipe(
            map((value) => {
                // This is a bit unfortunate, the payload is always of type string, despite the type annotation
                const valueAsString = value as unknown as string;
                return JSON.parse(valueAsString);
            })
        );
    }

    public sendMove(move: Move) {
        if (this.webSocketSubject) {
            this.webSocketSubject.next(move);
        }
    }

    public leaveGame() {
        this.webSocketSubject.complete();
    }
}
