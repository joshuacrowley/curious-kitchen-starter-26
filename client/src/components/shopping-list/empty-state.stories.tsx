import type { Meta, StoryObj } from '@storybook/react-vite';

import { EmptyState } from './empty-state';

const meta = {
  title: 'Shopping List/EmptyState',
  component: EmptyState,
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
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithTitle: Story = {
  args: {
    title: 'Nothing here yet',
    description: 'Add your first item to get started.',
  },
};

export const CustomIcon: Story = {
  args: {
    icon: '🎉',
    title: 'All done!',
    description: 'Everything on the list has been checked off.',
  },
};

export const AllCleared: Story = {
  args: {
    icon: '✅',
    title: 'List is clear',
    description: 'Add some items above to start your shopping.',
  },
};
