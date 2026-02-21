import type { Meta, StoryObj } from '@storybook/react-vite';

import { PageHeader } from './page-header';

const meta = {
  title: 'Shopping List/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  args: {
    title: 'Shopping List',
  },
};

export const TitleAndSubtitle: Story = {
  args: {
    title: 'Shopping List',
    subtitle: 'Shared with 3 people',
  },
};
