import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { marked } from 'marked';

interface MarkdownFieldProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
    error?: string;
    maxLength?: number;
}

const markdownStyles = `
.markdown-body {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    margin: 0;
    color: #24292f;
    font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    word-wrap: break-word;
}

.markdown-body pre {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 6px;
}

.markdown-body code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    white-space: break-spaces;
    background-color: rgba(175, 184, 193, 0.2);
    border-radius: 6px;
}
`;

export const MarkdownField: React.FC<MarkdownFieldProps> = ({ 
    value, 
    onChange, 
    label,
    placeholder,
    error,
    maxLength
}) => {
    const [tab, setTab] = useState<'write' | 'preview' | 'help'>('write');

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <Tabs value={tab} onValueChange={(v: string) => setTab(v as 'write' | 'preview' | 'help')}>
                <TabsList>
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="help">Help</TabsTrigger>
                </TabsList>
                <TabsContent value="write">
                    <div className="relative">
                        <textarea
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            className={cn(
                                "mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm min-h-[200px]",
                                error 
                                    ? "border-red-500 focus:border-red-500" 
                                    : "border-gray-300 focus:border-indigo-500",
                                "appearance-none",
                                "touch-manipulation"
                            )}
                            maxLength={maxLength}
                            data-gramm="false"
                            data-gramm_editor="false"
                            data-enable-grammarly="false"
                            onTouchStart={(e) => e.stopPropagation()}
                            style={{
                                WebkitAppearance: 'none',
                                WebkitBorderRadius: '4px'
                            }}
                        />
                        {maxLength && (
                            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                                {value.length}/{maxLength}
                            </div>
                        )}
                    </div>
                    {error && (
                        <p className="mt-1 text-sm text-red-500">{error}</p>
                    )}
                </TabsContent>
                <TabsContent value="preview" className="prose max-w-none">
                    <div className="min-h-[200px] p-4 border rounded-md bg-gray-50">
                        {tab === 'preview' ? (
                            <>
                                <style>{markdownStyles}</style>
                                <div className="markdown-body">
                                    <ReactMarkdown>
                                        {value || '*No content yet*'}
                                    </ReactMarkdown>
                                </div>
                            </>
                        ) : (
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="help" className="prose">
                    <div className="p-4 border rounded-md bg-gray-50">
                        <h4>Markdown Cheat Sheet</h4>
                        <ul className="space-y-2">
                            <li><code># Heading 1</code></li>
                            <li><code>## Heading 2</code></li>
                            <li><code>- Bullet point</code></li>
                            <li><code>1. Numbered list</code></li>
                            <li><code>**Bold text**</code></li>
                            <li><code>`Code`</code></li>
                            <li><code>```\nCode block\n```</code></li>
                        </ul>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export const getMarkdownHtml = (markdown: string): string => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <style>${markdownStyles}</style>
        </head>
        <body>
            <div class="markdown-body">
                ${marked(markdown)}
            </div>
        </body>
        </html>
    `;
}; 