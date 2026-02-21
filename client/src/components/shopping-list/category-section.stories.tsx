import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { CategorySection } from './category-section';
import { ShoppingItem } from './shopping-item';

const meta = {
  title: 'Shopping List/CategorySection',
  component: CategorySection,
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
} satisfies Meta<typeof CategorySection>;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = fn();

export const Produce: Story = {
  args: {
    name: 'Produce',
    children: (
      <>
        <ShoppingItem id="p1" name="Apples" checked={false} onCheckedChange={noop} onDelete={noop} />
        <ShoppingItem id="p2" name="Spinach" checked={true} onCheckedChange={noop} onDelete={noop} />
        <ShoppingItem id="p3" name="Cherry tomatoes" checked={false} onCheckedChange={noop} onDelete={noop} />
      </>
    ),
  },
};

export const DairyAndEggs: Story = {
  args: {
    name: 'Dairy & Eggs',
    children: (
      <>
        <ShoppingItem id="d1" name="Whole milk" checked={false} onCheckedChange={noop} onDelete={noop} />
        <ShoppingItem id="d2" name="Greek yoghurt" checked={false} onCheckedChange={noop} onDelete={noop} />
      </>
    ),
  },
};

export const Other: Story = {
  args: {
    name: 'Other',
    children: (
      <ShoppingItem id="o1" name="Birthday candles" checked={false} onCheckedChange={noop} onDelete={noop} />
    ),
  },
};
