import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { ShoppingItem } from './shopping-item';

const meta = {
  title: 'Shopping List/ShoppingItem',
  component: ShoppingItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80 border border-border rounded-xl overflow-hidden">
        <ul>
          <Story />
        </ul>
      </div>
    ),
  ],
  args: {
    onCheckedChange: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof ShoppingItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: {
    id: 'item-1',
    name: 'Organic milk',
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    id: 'item-2',
    name: 'Sourdough bread',
    checked: true,
  },
};

export const LongName: Story = {
  args: {
    id: 'item-3',
    name: 'Extra virgin cold-pressed olive oil from Greece',
    checked: false,
  },
};
