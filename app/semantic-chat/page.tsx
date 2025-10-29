'use client';

import { useChat } from '@ai-sdk/react';
import { ImageCanvas } from '@/components/image-canvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import { ImageMetadata } from '@/lib/strapi';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/header';

// Prevent static generation for this interactive page
export const dynamic = 'force-dynamic';

export default function SemanticChatPage() {
    const { messages, isLoading, sendMessage, error } = useChat({
        api: '/api/chat',
        onError: (error: Error) => {
            console.error('Chat error:', error);
        },
    });

    const [canvasImages, setCanvasImages] = useState<ImageMetadata[]>([]);
    const [currentQuery, setCurrentQuery] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Example queries
    const exampleQueries = [
        "Show me wedding photos",
        "Display gallery images",
        "Find story images",
        "Show all portfolio photos"
    ];

    // Handle example query click - directly send the message
    const handleExampleClick = async (query: string) => {
        try {
            await sendMessage({
                text: query,
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const message = inputValue.trim();
        setInputValue(''); // Clear input immediately

        try {
            await sendMessage({
                text: message,
            });
        } catch (error) {
            console.error('Error sending message:', error);
            setInputValue(message); // Restore message on error
        }
    };

    // Extract tool results from messages and update canvas
    useEffect(() => {
        if (error) {
            console.error('Chat API error:', error);
        }

        // Check all messages for tool results in parts
        for (const message of messages) {
            if (message.role === 'assistant') {
                // In AI SDK 6, tool calls are in parts array
                const parts = (message as any).parts || [];
                
                for (const part of parts) {
                    // Check if it's a tool part with output available
                    if (part.type?.startsWith('tool-') && part.state === 'output-available') {
                        const toolName = part.type.replace('tool-', ''); // e.g., "tool-showImages" -> "showImages"
                        const output = part.output as any;
                        
                        console.log('Tool part found:', toolName, output);
                        
                        if (toolName === 'showImages' && output) {
                            const result = output as {
                                images: ImageMetadata[];
                                query: string;
                                count?: number;
                                total?: number;
                            };
                            console.log('showImages output:', result);
                            if (result?.images && Array.isArray(result.images)) {
                                setCanvasImages(result.images);
                                setCurrentQuery(result.query || '');
                            }
                        } else if (toolName === 'clearCanvas') {
                            setCanvasImages([]);
                            setCurrentQuery('');
                        }
                    }
                }
            }
        }

        // Debug: log message structure occasionally
        if (messages.length > 0 && messages.length % 2 === 0) {
            console.log('Latest messages structure:', messages.slice(-2));
        }
    }, [messages, error]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="min-h-screen bg-white">
            <Header currentPage="semantic-chat" />

            {/* Main content */}
            <div className="container mx-auto p-4 h-[calc(100vh-100px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                    {/* Chat Panel */}
                    <div className="flex flex-col border rounded-lg bg-white overflow-hidden">
                        <div className="p-4 border-b bg-gray-50">
                            <h2 className="font-semibold text-gray-900">Chat</h2>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                            <div className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <p className="text-red-800 text-sm">
                                    Error: {error.message || 'Failed to communicate with server'}
                                </p>
                            </div>
                        )}

                        {messages.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="mb-2">Start a conversation!</p>
                                <p className="text-sm">Try asking:</p>
                                <ul className="text-sm mt-2 space-y-1">
                                    <li>"Show me wedding photos"</li>
                                    <li>"Display all portrait images"</li>
                                    <li>"Find photos of Vinny"</li>
                                </ul>
                            </div>
                        )}

                                {messages.map((message: any) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${
                                            message.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                                message.role === 'user'
                                                    ? 'bg-black text-white'
                                                    : 'bg-gray-100 text-gray-900'
                                            }`}
                                        >
                                            {/* Render message parts (text and tool parts) */}
                                            {(message as any).parts && (message as any).parts.length > 0 ? (
                                                <div>
                                                    {(message as any).parts.map((part: any, index: number) => {
                                                        if (part.type === 'text') {
                                                            return (
                                                                <p key={index} className="text-sm whitespace-pre-wrap">
                                                                    {part.text || ''}
                                                                </p>
                                                            );
                                                        } else if (part.type?.startsWith('tool-')) {
                                                            const toolName = part.type.replace('tool-', '');
                                                            if (part.state === 'output-available' && toolName === 'showImages') {
                                                                const output = part.output as { count?: number };
                                                                return (
                                                                    <div key={index} className="mt-2 text-xs opacity-70">
                                                                        <p>
                                                                            Found {output?.count || 0} images
                                                                        </p>
                                                                    </div>
                                                                );
                                                            } else if (part.state === 'call' || part.state === 'partial-output') {
                                                                return (
                                                                    <div key={index} className="mt-2 text-xs opacity-70">
                                                                        <p>Searching images...</p>
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-sm whitespace-pre-wrap">
                                                    {message.content || ''}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Example Queries */}
                        {messages.length === 0 && (
                            <div className="px-4 py-2 border-t bg-white">
                                <p className="text-xs text-gray-500 mb-2">Try these examples:</p>
                                <div className="flex flex-wrap gap-2">
                                    {exampleQueries.map((query, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleExampleClick(query)}
                                            disabled={isLoading}
                                            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {query}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
                            <div className="flex gap-2">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask me to show you photos..."
                                    disabled={isLoading}
                                    className="flex-1 bg-white text-gray-900 border-gray-300"
                                    autoComplete="off"
                                />
                                <Button
                                    type="submit"
                                    disabled={isLoading || inputValue.trim().length === 0}
                                    className="bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Canvas Panel */}
                    <div className="flex flex-col border rounded-lg bg-white overflow-hidden">
                        <div className="p-4 border-b bg-gray-50">
                            <h2 className="font-semibold text-gray-900">Image Canvas</h2>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <ImageCanvas images={canvasImages} query={currentQuery} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
