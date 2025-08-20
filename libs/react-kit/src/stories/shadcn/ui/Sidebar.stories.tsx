import type { Meta, StoryObj } from '@storybook/react';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarInput,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarInset,
  SidebarRail,
  SidebarFooter,
  SidebarMenuBadge,
  SidebarMenuAction,
} from '../../../shadcn/ui/sidebar';
import { Inbox, Send, Star, Trash2, Folder, Settings2, Plus } from 'lucide-react';

const meta: Meta<typeof Sidebar> = {
  title: 'Shadcn/UI/Sidebar',
  component: Sidebar,
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const BasicLayout: Story = {
  parameters: {
    centered: false,
  },
  render: () => (
    <div className="h-svh w-full">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarTrigger />
            <SidebarInput placeholder="Search..." />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Mailboxes</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Inbox">
                      <Inbox />
                      <span>Inbox</span>
                      <SidebarMenuBadge>12</SidebarMenuBadge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Sent">
                      <Send />
                      <span>Sent</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Starred">
                      <Star />
                      <span>Starred</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Trash">
                      <Trash2 />
                      <span>Trash</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Project Alpha">
                      <Folder />
                      <span>Alpha</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction title="New item">
                      <Plus />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Project Beta">
                      <Folder />
                      <span>Beta</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Settings2 />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter />
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <div>
            <h3>Content Area</h3>
            <p>Put any content here. This panel slides from the right and can be closed via the X button.</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
};
