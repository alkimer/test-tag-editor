import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EditorCanvas from '../components/EditorCanvas/EditorCanvas';
import useEditorStore from '../components/EditorCanvas/useEditorStore';

vi.mock('../components/EditorCanvas/useEditorStore', () => ({
  default: vi.fn(),
}));

describe('EditorCanvas', () => {
  it('renders EditorCanvas with a sample image and 4 default tags', () => {
    (useEditorStore as any).mockReturnValue({
      imageUrl: 'sample.jpg',
      imageNaturalSize: { w: 800, h: 600 },
      tags: Array.from({ length: 4 }, (_, i) => ({
        id: `tag-${i}`,
        x: (i % 2) * 200 + 50,
        y: (i < 2 ? 1 : 0) * 100 + 50,
        width: 160,
        height: 60,
        rotation: 0,
        text: `Tag ${i + 1}`,
        bgColor: '#ffffff',
        textColor: '#000000',
        fontSize: 16,
        padding: 8,
        zIndex: i,
      })),
      setImageUrl: vi.fn(),
      addTag: vi.fn(),
      updateTag: vi.fn(),
      setTags: vi.fn(),
      setSelectedIds: vi.fn(),
      setZoom: vi.fn(),
      lockBackground: false,
      setLockBackground: vi.fn(),
      zoom: 1,
    });

    render(<EditorCanvas />);

    const konvaCanvas = screen.getByRole('img');
    expect(konvaCanvas).toBeInTheDocument();
  });
});
