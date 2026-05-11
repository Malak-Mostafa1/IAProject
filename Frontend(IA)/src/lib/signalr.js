import * as signalR from '@microsoft/signalr';

const HUB_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '/notificationHub');

class SignalRService {
  connection = null;

  async startConnection(token) {
    if (this.connection) return;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
      console.log('SignalR Connected.');
    } catch (err) {
      console.error('SignalR Connection Error: ', err);
      setTimeout(() => this.startConnection(token), 5000);
    }
  }

  onNotificationReceived(callback) {
    if (!this.connection) return;
    this.connection.on('ReceiveNotification', callback);
  }

  stopConnection() {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
  }
}

export const signalRService = new SignalRService();