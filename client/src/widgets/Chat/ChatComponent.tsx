import './style.scss';
import { useEffect, useState, useRef } from 'react';
import { io, Socket as ServerSocket } from 'socket.io-client';

const ChatComponent = () => {
    const [socket, setSocket] = useState<ServerSocket | null>(null);
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        if (!socket) {
            const newSocket = io('https://localhost:5000'); // Підключення до серверу сокетів
            console.log(123, 'connect');
            setSocket(newSocket);
        }

        return () => {
            if (socket) {
                console.log(1321);
                socket.emit('exit-user', { userName: 'Nikita' });
                socket.disconnect(); // Відключення при знищенні компонента або виході зі сторінки
            }
        };
    }, [socket]);

    useEffect(() => {
        if (socket) {
            console.log(32131231231);
            socket.emit('new-user', { userName: 'Nikita' });
            socket.emit('start-engine')
            socket.on('chat', (newMessage: string) => {
                console.log('message', newMessage);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        }
    }, [socket]);

    // Функція для відправлення повідомлення на сервер
    const sendMessage = (e: React.MouseEvent) => {
        e.preventDefault();
        if (socket && message.trim() !== '') {
            socket.emit('chat-server', message);
            setMessage('');
        }
    };

    return (
        <div className="container-chat">
            <ul className="messages">
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <form className="form-send__message">
                <div className="userName">Nikita</div>
                <input
                    type="text"
                    className="input-send__message"
                    autoComplete="off"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="btn-send__message" onClick={sendMessage}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatComponent;
