/**
 * @PACK_SETTINGS
 * Implements global settings for pack configuration.
 */
export const packSettings = [
  {
    id: "packName",
    label: "Pack Name / Namespace",
    type: "text",
    options: {
      placeholder: "my_awesome_pack",
      help: "No spaces or special characters. e.g., 'emerald_tools'",
      required: true,
    },
  },
  {
    id: "packDesc",
    label: "Pack Description",
    type: "text",
    options: {
      placeholder: "Emerald Tools Datapack",
      required: false,
    },
  },
  {
    id: "packIcon",
    label: "Pack Icon (`pack.png`)",
    type: "file",
    options: { accept: "image/png" },
  },
  { type: "divider" },
  {
    id: "useItemGroup",
    label: "Add to Custom Item Group",
    type: "toggle",
    options: { defaultValue: false },
  },
  {
    id: "itemGroupOptions",
    type: "group",
    options: {
      condition: { field: "useItemGroup", value: true },
      children: [
        {
          id: "itemGroupName",
          label: "Item Group Name",
          type: "text",
          options: { placeholder: "Awesome Items", required: true },
        },
        {
          id: "itemGroupId",
          label: "Item Group ID",
          type: "text",
          options: {
            placeholder: "e.g., my_pack:awesome_items",
            help: "If no namespace is provided, the pack's namespace will be used.",
            required: true,
          },
        },
        {
          id: "itemGroupItem",
          label: "Item Group Icon Item",
          type: "text",
          options: {
            placeholder: "e.g. minecraft:iron_pickaxe",
            help: "This item will be the icon for your category in the creative menu, defaults to minecraft:iron_pickaxe.",
          },
        },
        {
          id: "createItemGroup",
          label: "Initialize this item group?",
          type: "toggle",
          options: { defaultValue: false, isSmall: true },
        },
      ],
    },
  },
];
