"use client";

import { Avatar, AvatarFallback } from "@multiclubes/ui/components/avatar";
import { Button } from "@multiclubes/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@multiclubes/ui/components/item";
import { PlusIcon } from "lucide-react";
import * as React from "react";

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

export function ItemGroupExample() {
  return (
    <ItemGroup className="max-w-sm">
      {people.map((person, index) => (
        <Item key={person.username} variant="outline">
          <ItemMedia>
            <Avatar>
              <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent className="gap-1">
            <ItemTitle>{person.username}</ItemTitle>
            <ItemDescription>{person.email}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="icon" className="rounded-full">
              <PlusIcon />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}
export default ItemGroupExample;
