import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MarkdownFieldProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
}

export const MarkdownField: React.FC<MarkdownFieldProps> = ({ 
    value, 
    onChange, 
    label,
    placeholder 
}) => {
    const [tab, setTab] = useState<'write' | 'preview'>('write');

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>
            <Tabs value={tab} onValueChange={(v) => setTab(v as 'write' | 'preview')}>
                <TabsList>
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write">
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full min-h-[200px] p-2 border rounded"
                    />
                </TabsContent>
                <TabsContent value="preview" className="prose">
                    <div className="min-h-[200px] p-4 border rounded bg-gray-50">
                        <ReactMarkdown>{value}</ReactMarkdown>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}; 