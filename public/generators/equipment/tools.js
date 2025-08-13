import {
  BaseTemplate,
  Field,
  SelectField,
  NumberField,
  FileField,
} from "../../engine/templates.js";
import { VANILLA_DATA } from "../../dependencies/equipment/vanilla_data.js";

export class ToolTemplate extends BaseTemplate {
  constructor() {
    super("tool", "Tool");
    // Add input fields.
    this.addField(
      new Field("itemName", "Item Name", "text", {
        placeholder: "e.g., Emerald Sword",
        width: "half",
        required: true,
      })
    );
    this.addField(
      new Field("itemId", "Item ID", "text", {
        placeholder: "e.g., emerald_sword",
        width: "half",
        required: true,
      })
    );
    this.addField(
      new SelectField(
        "itemType",
        "Tool Type",
        [
          { value: "sword", text: "Sword" },
          { value: "pickaxe", text: "Pickaxe" },
          { value: "axe", text: "Axe" },
          { value: "shovel", text: "Shovel" },
          { value: "hoe", text: "Hoe" },
        ],
        { width: "half", onChange: this.updateToolStats }
      )
    );
    this.addField(
      new SelectField("vanilla", "Base Vanilla Item", [], {
        width: "half",
        onChange: this.updateToolStats,
      })
    );
    this.addField(
      new NumberField("durability", "Durability", {
        defaultValue: 250,
        width: "half",
        required: true,
        range: { min: 1, max: 2147483647 },
      })
    );
    this.addField(
      new NumberField("enchantability", "Enchantability", {
        defaultValue: 14,
        width: "half",
        required: true,
        range: { min: 0 },
      })
    );
    this.addField(
      new NumberField("damage", "Attack Damage", {
        step: 0.5,
        defaultValue: 6,
        width: "half",
        required: true,
        range: { min: 0 },
      })
    );
    this.addField(
      new NumberField("speed", "Attack Speed", {
        step: 0.1,
        defaultValue: -2.4,
        width: "half",
        required: true,
      })
    );
    this.addField(
      new NumberField("miningSpeed", "Mining Speed", {
        width: "half",
        defaultValue: 1,
        range: { min: 0 },
      })
    );
    this.addField(
      new SelectField(
        "harvestability",
        "Harvest Level",
        [
          { value: "wooden", text: "Wooden" },
          { value: "stone", text: "Stone" },
          { value: "iron", text: "Iron" },
          { value: "gold", text: "Golden" },
          { value: "diamond", text: "Diamond" },
          { value: "netherite", text: "Netherite" },
        ],
        {
          width: "half",
        }
      )
    );
    this.addField(
      new Field("repairItem", "Repair Item", "text", {
        placeholder: "e.g. minecraft:emerald",
        width: "half",
      })
    );
    this.addField(
      new FileField("textureFile", "Item Texture (.png)", {
        accept: "image/png",
        withPreview: true,
        width: "full",
      })
    );
  }

  onCardAdded = (card) => {
    this.updateToolStats({
      target: card.querySelector('[data-id="itemType"]'),
    });
  };

  updateToolStats = (event) => {
    const card = event.target.closest(".card");
    if (!card) return;

    const type = card.querySelector('[data-id="itemType"]').value;
    const vanillaSelect = card.querySelector('[data-id="vanilla"]');

    if (event.target.dataset.id === "itemType") {
      const options = VANILLA_DATA.tools[type];
      vanillaSelect.innerHTML = "";
      for (const key in options) {
        const optionEl = document.createElement("option");
        optionEl.value = options[key].vanilla;
        optionEl.textContent = key
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        vanillaSelect.appendChild(optionEl);
      }
    }

    const vanillaId = vanillaSelect.value;
    if (!vanillaId) return;
    const vanillaKey = vanillaId.split(":")[1];
    const stats = VANILLA_DATA.tools[type][vanillaKey];

    if (stats) {
      card.querySelector('[data-id="durability"]').value = stats.durability;
      card.querySelector('[data-id="enchantability"]').value =
        stats.enchantability;
      card.querySelector('[data-id="damage"]').value = stats.damage;
      card.querySelector('[data-id="speed"]').value = stats.speed;
      card.querySelector('[data-id="harvestability"]').value =
        stats.harvestability;
      card.querySelector('[data-id="miningSpeed"]').value = stats.miningSpeed;
    }
  };

  onGenerate(ctx) {
    const { assets, packSettings } = ctx;
    const namespace = packSettings.packName;
    const id = ctx.getField("itemId");
    const itemName = ctx.getField("itemName");
    const itemType = ctx.getField("itemType");

    // Stop generation if data missing.
    if (!id || !namespace) {
      console.warn(
        "Skipping generation for tool: Card is missing ID or namespace."
      );
      return;
    }

    const fullId = `${namespace}:${id}`;
    const repairItem = ctx.getField("repairItem");

    // Create item definition.
    const itemDef = {
      id: namespace + ":" + id,
      vanillaItem: ctx.getField("vanilla"),
      itemResource: {
        models: {
          default: `${namespace}:item/${id}`,
        },
      },
      properties: {
        stackSize: 1,
        durability: ctx.getField("durability"),
      },
      translations: {
        en_us: itemName,
      },
      behaviors: {},
      components: {
        "minecraft:enchantable": {
          value: ctx.getField("enchantability"),
        },
        "minecraft:weapon": {},
        "minecraft:attribute_modifiers": [
          {
            type: "minecraft:attack_damage",
            slot: "mainhand",
            id: `${namespace}:${id}_attack_damage`,
            amount: ctx.getField("damage") - 1,
            operation: "add_value",
            display: {
              type: "override",
              value: [
                "",
                {
                  color: "dark_green",
                  text: ` ${ctx.getField("damage")} Attack Damage`,
                },
              ],
            },
          },
          {
            type: "minecraft:attack_speed",
            slot: "mainhand",
            id: `${namespace}:${id}_attack_speed`,
            amount: ctx.getField("speed") - 4,
            operation: "add_value",
            display: {
              type: "override",
              value: [
                "",
                {
                  color: "dark_green",
                  text: ` ${ctx.getField("speed")} Attack Speed`,
                },
              ],
            },
          },
        ],
      },
    };

    // Add optional properties.
    if (repairItem) {
      itemDef.components["minecraft:repairable"] = {
        items: [
          repairItem.includes(":") ? repairItem : "minecraft:" + repairItem,
        ],
      };
    }

    // Sword-specific
    if (itemType === "sword") {
      itemDef.components["minecraft:tool"] = {
        can_destroy_blocks_in_creative: false,
        rules: [
          {
            blocks: "#minecraft:sword_efficient",
            speed: 1.5,
            correct_for_drops: true,
          },
          {
            blocks: "#minecraft:sword_instantly_mines",
            speed: 30,
            correct_for_drops: true,
          },
          {
            blocks: "minecraft:cobweb",
            speed: 20,
            correct_for_drops: true,
          },
        ],
      };
    } else {
      itemDef.components["minecraft:tool"] = {
        default_mining_speed: 1,
        rules: [
          {
            blocks: `#minecraft:incorrect_for_${ctx.getField(
              "harvestability"
            )}_tool`,
            correct_for_drops: false,
          },
          {
            blocks: `#minecraft:mineable/${itemType}`,
            speed: ctx.getField("miningSpeed"),
            correct_for_drops: true,
          },
        ],
      };
    }

    // Tool-specific
    if (itemType === "axe") {
      itemDef.components["minecraft:weapon"].disable_blocking_for_seconds = 5;
      itemDef.behaviors.stripper = {};
    } else if (itemType === "shovel") {
      itemDef.behaviors.shovel = {};
    } else if (itemType === "hoe") {
      itemDef.behaviors.hoe = {};
    }

    // Add to item group.
    if (packSettings.useItemGroup && packSettings.itemGroupId) {
      itemDef.group = packSettings.itemGroupId.includes(":")
        ? packSettings.itemGroupId
        : `${namespace}:${packSettings.itemGroupId}`;
    }

    // Write definition.
    assets.createFile(
      `data/${namespace}/filament/item/${id}.json`,
      JSON.stringify(itemDef, null, 2)
    );

    // Create item model JSON
    assets.createFile(
      `assets/${namespace}/models/item/${id}.json`,
      JSON.stringify(
        {
          parent: "minecraft:item/handheld",
          textures: { layer0: `${namespace}:item/${id}` },
        },
        null,
        2
      )
    );

    // Add texture file
    const texture = ctx.getField("textureFile");
    if (texture) {
      assets.createFile(`assets/${namespace}/textures/item/${id}.png`, texture);
    }

    // Add to tags
    const tagMap = {
      axe: "axes",
      pickaxe: "pickaxes",
      shovel: "shovels",
      sword: "swords",
      hoe: "hoes",
    };
    if (tagMap[itemType]) {
      assets.addTag("minecraft", tagMap[itemType], fullId);
    }
  }
}
