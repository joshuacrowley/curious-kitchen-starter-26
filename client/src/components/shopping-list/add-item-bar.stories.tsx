import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { AddItemBar } from './add-item-bar';

const meta = {
  title: 'Shopping List/AddItemBar',
  component: AddItemBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
  args: {
    onAdd: fn(),
  },
} satisfies Meta<typeof AddItemBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
