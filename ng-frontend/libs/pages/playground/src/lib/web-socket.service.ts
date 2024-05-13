import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({ providedIn: 'root' })
export class WebSocketService<T> {
    // TODO inject via token / make configurable for different environment
    private readonly URL = 'ws://localhost:8000/ws/'
    private webSocketSubject: WebSocketSubject<T> | undefined;

    public connect(route: string) {
        if (!this.webSocketSubject) {
            this.webSocketSubject = webSocket<T>(this.URL + route);
        }
        return this.webSocketSubject;
    }

    // Potentially we can add some multiplexing here in the future. This way we don't have to open multiple connections
    //  for multiple WebSocket users
}
