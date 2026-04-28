import type { Meta, StoryObj } from '@storybook/react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from '../../../shadcn/ui/navigation-menu';

const meta: Meta<typeof NavigationMenu> = {
  title: 'Shadcn/UI/NavigationMenu',
  component: NavigationMenu,
};

export default meta;

type Story = StoryObj<typeof NavigationMenu>;

export const Basic: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-3 md:w-[500px] md:grid-cols-2">
              <NavigationMenuLink asChild>
                <a
                  className="rounded-md border p-3"
                  href="https://example.com/analytics"
                >
                  Analytics
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  className="rounded-md border p-3"
                  href="https://example.com/engagement"
                >
                  Engagement
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  className="rounded-md border p-3"
                  href="https://example.com/security"
                >
                  Security
                </a>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <a
                  className="rounded-md border p-3"
                  href="https://example.com/integrations"
                >
                  Integrations
                </a>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="https://example.com/pricing"
            className="rounded-md px-4 py-2"
          >
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuIndicator />
      <NavigationMenuViewport />
    </NavigationMenu>
  ),
};
