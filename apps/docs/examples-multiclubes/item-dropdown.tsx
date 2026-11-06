"use client";

import { Avatar, AvatarFallback } from "@multiclubes/ui/components/avatar";
import { Button } from "@multiclubes/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@multiclubes/ui/components/dropdown-menu";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@multiclubes/ui/components/item";
import { ChevronDownIcon } from "lucide-react";

const people = [
  {
    username: "multiclubes",
    avatar: "",
    email: "multiclubes@example.com",
  },
  {
    username: "maxleiter",
    avatar: "",
    email: "maxleiter@vercel.com",
  },
  {
    username: "evilrabbit",
    avatar: "",
    email: "evilrabbit@vercel.com",
  },
];

export function ItemDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Select <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuGroup>
          {people.map((person) => (
            <DropdownMenuItem key={person.username}>
              <Item size="xs" className="w-full p-2">
                <ItemMedia>
                  <Avatar className="size-[--spacing(6.5)]">
                    <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent className="gap-0">
                  <ItemTitle>{person.username}</ItemTitle>
                  <ItemDescription className="leading-none">{person.email}</ItemDescription>
                </ItemContent>
              </Item>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default ItemDropdown;
