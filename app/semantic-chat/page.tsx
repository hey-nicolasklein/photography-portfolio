'use client';

import { useChat } from '@ai-sdk/react';
import { ImageCanvas } from '@/components/image-canvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import { ImageMetadata } from '@/lib/strapi';
import { useState, useEffect, useRef } from 'react';

// Prevent static generation for this interactive page
export const dynamic = 'force-dynamic';

export default function SemanticChatPage() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
    });

    const [canvasImages, setCanvasImages] = useState<ImageMetadata[]>([]);
    const [currentQuery, setCurrentQuery] = useState<string>('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Extract tool results from messages and update canvas
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];

        if (lastMessage?.role === 'assistant' && lastMessage.toolInvocations) {
            for (const toolInvocation of lastMessage.toolInvocations) {
                if (toolInvocation.state === 'result') {
                    if (toolInvocation.toolName === 'showImages') {
                        const result = toolInvocation.result as {
                            images: ImageMetadata[];
                            query: string;
                        };
                        setCanvasImages(result.images);
                        setCurrentQuery(result.query);
                    } else if (toolInvocation.toolName === 'clearCanvas') {
                        setCanvasImages([]);
                        setCurrentQuery('');
                    }
                }
            }
        }
    }, [messages]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Semantic Image Chat</h1>
                    <p className="text-sm text-gray-600">
                        Ask me to find and display photos from your portfolio
                    </p>
                </div>
            </header>

            {/* Main content */}
            <div className="container mx-auto p-4 h-[calc(100vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                    {/* Chat Panel */}
                    <div className="flex flex-col border rounded-lg bg-white overflow-hidden">
                        <div className="p-4 border-b bg-gray-50">
                            <h2 className="font-semibold text-gray-900">Chat</h2>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                            <div className="space-y-4">
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

                                {messages.map((message) => (
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
                                            <p className="text-sm whitespace-pre-wrap">
                                                {message.content}
                                            </p>

                                            {/* Show tool invocations */}
                                            {message.toolInvocations && (
                                                <div className="mt-2 text-xs opacity-70">
                                                    {message.toolInvocations.map((tool) => (
                                                        <div key={tool.toolCallId}>
                                                            {tool.state === 'call' && (
                                                                <p>Searching images...</p>
                                                            )}
                                                            {tool.state === 'result' &&
                                                                tool.toolName === 'showImages' && (
                                                                    <p>
                                                                        Found{' '}
                                                                        {
                                                                            (
                                                                                tool.result as {
                                                                                    count: number;
                                                                                }
                                                                            ).count
                                                                        }{' '}
                                                                        images
                                                                    </p>
                                                                )}
                                                        </div>
                                                    ))}
                                                </div>
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

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
                            <div className="flex gap-2">
                                <Input
                                    value={input || ''}
                                    onChange={handleInputChange}
                                    placeholder="Ask me to show you photos..."
                                    disabled={isLoading}
                                    className="flex-1 bg-white text-gray-900"
                                />
                                <Button
                                    type="submit"
                                    disabled={isLoading || !input || input.trim().length === 0}
                                    className="bg-black text-white hover:bg-gray-800"
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
