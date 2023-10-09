import './style.scss';
import { ChangeEvent, useEffect, useState } from 'react';
import { io, Socket as ServerSocket } from 'socket.io-client';

const   ChatComponent = () => {
    const [socket, setSocket] = useState<ServerSocket | null>(null);
    const [socketEngine, setSocketEngine] = useState<ServerSocket | null>(null)
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<string[]>([]);
    const [engineStarted, setEngineStarted] = useState<boolean>(false)
    const [move, setMove] = useState<string>('')

    useEffect(() => {
        if (!socket) {
            const newSocket = io('https://localhost:5000/chat'); // Підключення до серверу сокетів
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
            socket.on('chat', (newMessage: string) => {
                console.log('message', newMessage);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        }
    }, [socket]);

    useEffect(() => {
        if (!socketEngine) {
            const newSocket = io('https://localhost:5000/engine')
            console.log('connect socket engine')
            setSocketEngine(newSocket)
        } 

        return  () => {
            if (socketEngine) {
                console.log('The engine had previously been temporarily shut down')
                socketEngine.emit('stop-engine', {message: 'stop-engine'})
                socketEngine.disconnect()
            }
        }
    }, [socketEngine])

    useEffect(() => {
        if (socketEngine && engineStarted) {
            socketEngine.emit('start-engine', {message: 'start-engine'})
            console.log('start-engine')
        } else {
            console.log('Socket-engine is not defined')
        }
    }, [engineStarted])
    
    const sendMessage = (e: React.MouseEvent) => {
        e.preventDefault();
        if (socket && message.trim() !== '') {
            socket.emit('chat-server', message);
            setMessage('');
        }
    };

    const handleChangeMove = (e: ChangeEvent<HTMLInputElement>) => {
       setMove(e.target.value)
    }

    const handleSendMove = (e: React.MouseEvent) => {
        e.preventDefault()
        socketEngine?.emit('calculate-move', {message: 'calculate-move', move: 'e4'})
    }

    return (
        <div className="container-chat">
            <input type="text" value={move} onChange={handleChangeMove}/>
            <button onClick={handleSendMove}>send move</button>
            <button onClick={() => console.log(321312321)}>aye</button>
            <button onClick={() => setEngineStarted(!engineStarted)} style={{width: '100px', height: '100px'}}>Start engine</button>
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
