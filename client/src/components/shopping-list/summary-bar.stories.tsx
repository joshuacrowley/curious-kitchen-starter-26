import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { SummaryBar } from './summary-bar';

const meta = {
  title: 'Shopping List/SummaryBar',
  component: SummaryBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  args: {
    onClearChecked: fn(),
  },
} satisfies Meta<typeof SummaryBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoneChecked: Story = {
  args: {
    total: 5,
    checked: 0,
  },
};

export const SomeChecked: Story = {
  args: {
    total: 8,
    checked: 3,
  },
};

export const AllChecked: Story = {
  args: {
    total: 4,
    checked: 4,
  },
};

export const SingleItem: Story = {
  args: {
    total: 1,
    checked: 1,
  },
};
