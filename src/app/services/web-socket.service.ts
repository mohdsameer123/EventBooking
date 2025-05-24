import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  private dataSubject = new Subject<string>();
  private connectionSubject = new Subject<void>();

  constructor() { }

  connect(): void {
    this.socket = new WebSocket('wss://bullionprice.logimaxindia.com:3004/socket.io/?EIO=3&transport=websocket');

    this.socket.onopen = () => {
      console.log('WebSocket connection opened');
      this.connectionSubject.next(); // Notify about the connection
    };

    this.socket.onmessage = (event) => {
      this.dataSubject.next(event.data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      // Reconnect if the connection closes
      this.reconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Optionally reconnect on error
      this.reconnect();
    };
  }

  reconnect(): void {
    console.log('Reconnecting WebSocket...');
    setTimeout(() => this.connect(), 3000); // Attempt reconnection after 3 seconds
  }

  getDataStream(): Observable<string> {
    return this.dataSubject.asObservable();
  }

  startFetching(): Observable<string> {
    // Ensure the WebSocket is connected
    this.connect();

    return timer(0, 3000).pipe(
      switchMap(() => this.getDataStream().pipe(takeUntil(timer(2500)))) // Fetch data every 3 seconds, stop after 2.5 seconds
    );
  }

  send(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open. Cannot send message.');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
