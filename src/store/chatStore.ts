import { create } from 'zustand';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface ChatState {
    messages: Message[];
    uuid: string | null;
    savedChats: string[];
    isLoading: boolean;
    isUploading: boolean;
    isMedGamma: boolean; // New State
    initialize: () => Promise<void>;
    createNewChat: () => Promise<void>;
    switchChat: (id: string) => Promise<void>;
    sendMessage: (text: string) => Promise<void>;
    uploadPdf: (file: File) => Promise<void>;
    toggleMedGamma: () => void; // New Action
    triggerEmergency: (location?: string) => Promise<void>; // New Action
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    uuid: localStorage.getItem('chat_uuid'),
    savedChats: JSON.parse(localStorage.getItem('saved_chat_ids') || '[]'),
    isLoading: false,
    isUploading: false,
    isMedGamma: false, // Default off

    toggleMedGamma: () => set((state) => ({ isMedGamma: !state.isMedGamma })),

    triggerEmergency: async (location) => {
        try {
            // Optimistic UI update or notification
            console.log("TRIGGERING EMERGENCY...");
            const response = await fetch(`${BACKEND_URL}/emergency/trigger`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'sos', location: location || 'Unknown' })
            });
            if (!response.ok) throw new Error("Failed to trigger emergency");
            alert("SOS Alert Sent! Emergency contacts have been notified.");
        } catch (error) {
            console.error("Emergency Failed:", error);
            alert("Failed to send SOS. Please call emergency services directly.");
        }
    },

    switchChat: async (id: string) => {
        localStorage.setItem('chat_uuid', id);
        set({ uuid: id, messages: [] }); // Clear messages to avoid flash of old chat
        await get().initialize();
    },

    initialize: async () => {
        const uuid = get().uuid;
        console.log("uuid", uuid);
        if (!uuid) {
            // No UUID found, request new one
            await get().createNewChat();
        } else {
            // UUID exists, fetch history if not already loaded
            if (get().messages.length === 0) {
                set({ isLoading: true });
                try {
                    const response = await fetch(`${BACKEND_URL}/chat/${uuid}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    console.log("response", data);
                    if (response.ok) {
                        if (!data.messages) {
                            console.warn("No messages found for this chat session");
                            set({
                                messages: [{
                                    id: 'init-1',
                                    text: "No messages found for this chat session, how can I help you?",
                                    sender: 'bot',
                                    timestamp: new Date()
                                }]
                            });
                        }
                        else {
                            const parsedMessages = data.messages.map((msg: any) => ({
                                ...msg,
                                timestamp: new Date(msg.timestamp)
                            }));
                            set({ messages: parsedMessages });
                        }
                    }
                    else {
                        console.warn("Failed to fetch history");
                        set({
                            messages: [{
                                id: 'init-1',
                                text: "No messages found for this chat session, try creating a new chat",
                                sender: 'bot',
                                timestamp: new Date()
                            }]
                        });
                    }

                } catch (error) {
                    console.error('Failed to fetch history:', error);
                } finally {
                    set({ isLoading: false });
                }
            }
        }
    },

    createNewChat: async () => {

        set({ isLoading: true });
        try {
            console.log("new chhat");
            const response = await fetch(`${BACKEND_URL}/chat/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            const data = await response.json();

            const newUuid = data.uuid;

            // Update Saved Chats
            const currentSaved = get().savedChats;
            const updatedSaved = [newUuid, ...currentSaved]; // Newest first
            localStorage.setItem('saved_chat_ids', JSON.stringify(updatedSaved));
            localStorage.setItem('chat_uuid', newUuid);

            set({
                uuid: newUuid,
                savedChats: updatedSaved,
                messages: [{
                    id: 'new-1',
                    text: "Hello! New chat started. How can I help you regarding analysis or general questions?",
                    sender: 'bot',
                    timestamp: new Date()
                }]
            });
            console.log(`New chat created with UUID: ${newUuid}`);
        } catch (error) {
            console.error('Failed to create new chat:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    sendMessage: async (text: string) => {
        const { uuid, messages } = get();
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date()
        };

        // Optimistically add user message
        const botMsgId = (Date.now() + 1).toString();
        const initialBotMsg: Message = {
            id: botMsgId,
            text: "",
            sender: 'bot',
            timestamp: new Date()
        };

        set({ messages: [...messages, userMsg, initialBotMsg] });

        try {
            const response = await fetch(`${BACKEND_URL}/chat/${uuid}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    mode: get().isMedGamma ? 'medgamma' : 'general'
                })
            });

            if (!response.ok || !response.body) {
                throw new Error("Failed to send message");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                botText += chunk;

                // Update the last message (bot message) with new text
                set((state) => ({
                    messages: state.messages.map(msg =>
                        msg.id === botMsgId ? { ...msg, text: botText } : msg
                    )
                }));
            }

        } catch (error) {
            console.error('Failed to send message:', error);
            // Optionally remove the empty bot message on failure
        }
    },

    uploadPdf: async (file: File) => {
        const { uuid } = get();
        set({ isUploading: true });

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${BACKEND_URL}/chat/${uuid}/upload`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log(`Uploading ${file.name} to session ${uuid}`);
                set(state => ({
                    isUploading: false,
                    messages: [...state.messages, {
                        id: Date.now().toString(),
                        text: `PDF "${file.name}" uploaded successfully. You can now ask questions about it.`,
                        sender: 'bot',
                        timestamp: new Date()
                    }]
                }));
            } else {
                console.error('Upload failed');
                set({ isUploading: false });
            }

        } catch (error) {
            console.error('Failed to upload PDF:', error);
            set({ isUploading: false });
        }
    }
}));
