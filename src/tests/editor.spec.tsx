import React from 'react';
import { render, screen } from '@testing-library/react';
import EditorCanvas from '../components/EditorCanvas/EditorCanvas';
import useEditorStore from '../components/EditorCanvas/useEditorStore';

jest.mock('../components/EditorCanvas/useEditorStore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('EditorCanvas', () => {
  it('renders EditorCanvas with a sample image and 4 default tags', () => {
    (useEditorStore as jest.Mock).mockReturnValue({
      imageUrl: 'sample.jpg',
      imageNaturalSize: { w: 800, h: 600 },
      tags: Array.from({ length: 4 }, (_, i) => ({
        id: `tag-${i}`,
        x: (i % 2) * 200 + 50,
        y: (i < 2) * 100 + 50,
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
      setImageUrl: jest.fn(),
      addTag: jest.fn(),
      updateTag: jest.fn(),
      setTags: jest.fn(),
      setSelectedIds: jest.fn(),
      setZoom: jest.fn(),
      lockBackground: false,
      setLockBackground: jest.fn(),
      zoom: 1,
    });

    render(<EditorCanvas />);

    const konvaCanvas = screen.getByRole('img');
    expect(konvaCanvas).toBeInTheDocument();
  });
});
