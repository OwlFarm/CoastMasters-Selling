
'use client';

import * as React from 'react';
import { Bold, Italic, Strikethrough, List, ListOrdered } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

interface TextEditorProps extends Omit<React.ComponentProps<'textarea'>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export function TextEditor({ value, onChange, ...props }: TextEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const applyFormat = (format: 'bold' | 'italic' | 'strike' | 'ul' | 'ol') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let newText = '';
    let replacement = '';

    switch (format) {
      case 'bold':
        replacement = `**${selectedText}**`;
        break;
      case 'italic':
        replacement = `*${selectedText}*`;
        break;
      case 'strike':
        replacement = `~~${selectedText}~~`;
        break;
      case 'ul':
        replacement = selectedText
          .split('\n')
          .map(line => `- ${line}`)
          .join('\n');
        break;
      case 'ol':
        replacement = selectedText
          .split('\n')
          .map((line, index) => `${index + 1}. ${line}`)
          .join('\n');
        break;
    }

    newText = `${value.substring(0, start)}${replacement}${value.substring(end)}`;
    onChange(newText);

    // Re-focus and set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + replacement.length);
    }, 0);
  };

  return (
    <div className="flex flex-col rounded-md border border-input">
      <div className="flex items-center p-2 border-b">
        <ToggleGroup type="multiple" size="sm">
          <ToggleGroupItem value="bold" aria-label="Toggle bold" onClick={() => applyFormat('bold')}>
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic" onClick={() => applyFormat('italic')}>
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough" onClick={() => applyFormat('strike')}>
            <Strikethrough className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Separator orientation="vertical" className="h-6 mx-2" />
        <ToggleGroup type="multiple" size="sm">
            <ToggleGroupItem value="ul" aria-label="Unordered List" onClick={() => applyFormat('ul')}>
                <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="ol" aria-label="Ordered List" onClick={() => applyFormat('ol')}>
                <ListOrdered className="h-4 w-4" />
            </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        {...props}
      />
    </div>
  );
}
