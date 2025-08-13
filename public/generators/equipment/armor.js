import {
  BaseTemplate,
  Field,
  SelectField,
  NumberField,
  FileField,
  ChildItem,
} from "../../engine/templates.js";
import { VANILLA_DATA } from "../../dependencies/equipment/vanilla_data.js";

class ArmorPieceTemplate extends BaseTemplate {
  constructor() {
    super("armorPiece", "Armor Piece");
    this.isChild = true;
    // Add input fields.
    this.addField(new Field("pieceTitle", "", "title"));
    this.addField(
      new Field("itemName", "Item Name", "text", {
        placeholder: "e.g., Emerald Helmet",
        width: "half",
        required: true,
      })
    );
    this.addField(
      new Field("itemId", "Item ID", "text", {
        placeholder: "e.g., emerald_helmet",
        width: "half",
        required: true,
      })
    );
    this.addField(
      new Field("vanilla", "Base Vanilla Item", "text", {
        width: "half",
        readonly: true,
      })
    );
    this.addField(
      new NumberField("durability", "Durability", {
        defaultValue: 165,
        width: "half",
        required: true,
        range: { min: 1 },
      })
    );
    this.addField(
      new NumberField("enchantability", "Enchantability", {
        defaultValue: 9,
        width: "half",
        required: true,
        range: { min: 0 },
      })
    );
    this.addField(
      new NumberField("armor", "Armor Points", {
        defaultValue: 2,
        width: "half",
        required: true,
        range: { min: 0 },
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

  onGenerate(ctx) {
    const { assets, packSettings, parentContext } = ctx;
    const namespace = packSettings.packName;
    const id = ctx.getField("itemId");
    const itemName = ctx.getField("itemName");
    const pieceType = ctx.options.pieceType;
    const setName = parentContext
      .getField("setName")
      .toLowerCase()
      .replace(/\s+/g, "_");

    if (!id || !namespace) {
      console.warn(
        `Skipping generation for type ${pieceType}: Card is missing ID or namespace.`
      );
      return;
    }

    // Generate item definition.
    const repairItem = parentContext.getField("repairItem");

    const slot = {
      helmet: "head",
      chestplate: "chest",
      leggings: "legs",
      boots: "feet",
    }[pieceType];

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
      components: {
        "minecraft:equippable": {
          slot: slot,
          asset_id: namespace + ":" + setName,
        },
        "minecraft:enchantable": {
          value: ctx.getField("enchantability"),
        },
        "minecraft:repair_cost": 0,
        "minecraft:attribute_modifiers": [
          {
            type: "minecraft:armor",
            slot: slot,
            id: `${namespace}:${id}_armor`,
            amount: ctx.getField("armor"),
            operation: "add_value",
          },
        ],
      },
    };

    // Add optional properties.
    if (repairItem)
      itemDef.components["minecraft:repairable"] = {
        items: [
          repairItem.includes(":") ? repairItem : "minecraft:" + repairItem,
        ],
      };

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

    // Create item model definition.
    assets.createFile(
      `assets/${namespace}/models/item/${id}.json`,
      JSON.stringify(
        {
          parent: "minecraft:item/generated",
          textures: { layer0: `${namespace}:item/${id}` },
        },
        null,
        2
      )
    );

    // Generate trim model definitions.
    for (let material of VANILLA_DATA.TRIM_MATERIALS) {
      assets.createFile(
        `assets/${namespace}/models/item/${id}/${id}_${material}_trim.json`,
        JSON.stringify(
          {
            parent: "minecraft:item/generated",
            textures: {
              layer0: `${namespace}:item/${id}`,
              layer1: `minecraft:trims/items/${slot}_trim_${material}`,
            },
          },
          null,
          2
        )
      );
    }

    // Generate model selection definition.
    const modelDefString = `{
  "model": {
    "type": "minecraft:select",
    "cases": [
      {
        "model": {
          "type": "minecraft:model",
          "model": "${namespace}:item/${id}/${id}_quartz_trim"
        },
        "when": "minecraft:quartz"
      },
      {
        "model": {
          "type": "minecraft:model",
          "model": "${namespace}:item/${id}/${id}_iron_trim"
        },
        "when": "minecraft:iron"
      },
      {
        "model": {
          "type": "minecraft:model",
          "model": "${namespace}:item/${id}/${id}_netherite_trim"
        },
        "when": "minecraft:netherite"
      },
      {
        "model": {
          "type": "minecraft:model",
          "model": "${namespace}:item/${id}/${id}_redstone_trim"
        },
        "when": "minecraft:redstone"
      },
      {
        "model": {
          "type": "minecraft:model",
          "model": "${namespace}:item/${id}/${id}_copper_trim"
        },
        "when": "minecraft:copper"
      },
      {
        "model": {
          "type": "minecraft:model",
          "model": "${namespace}:item/${id}/${id}_gold_trim"
        },
        "when": "minecraft:gold"
      },
      {
        "model": {
          "type": "minecraft:model",
          "model": "${namespace}:item/${id}/${id}_emerald_trim"
        },
        "when": "minecraft:emerald"
      },
      {
        "model": {
          "type": "minecraft:model",
          "model": "${namespace}:item/${id}/${id}_diamond_trim"
        },
        "when": "minecraft:diamond"
      },
      {
        "model": {
          "type": "minecraft:model",
          "model": "${namespace}:item/${id}/${id}_lapis_trim"
        },
        "when": "minecraft:lapis"
      },
      {
        "model": {
          "type": "minecraft:model",
          "model": "${namespace}:item/${id}/${id}_amethyst_trim"
        },
        "when": "minecraft:amethyst"
      },
      {
        "model": {
          "type": "minecraft:model",
          "model": "${namespace}:item/${id}/${id}_resin_trim"
        },
        "when": "minecraft:resin"
      }
    ],
    "fallback": {
      "type": "minecraft:model",
      "model": "${namespace}:item/${id}"
    },
    "property": "minecraft:trim_material"
  }
}`;

    // Create trim equipment logic definition.
    assets.createFile(`assets/${namespace}/items/${id}.json`, modelDefString);

    // Write textures.
    const texture = ctx.getField("textureFile");
    if (texture) {
      assets.createFile(`assets/${namespace}/textures/item/${id}.png`, texture);
    }

    // Add tags.
    const tagMap = {
      helmet: "head_armor",
      chestplate: "chest_armor",
      leggings: "leg_armor",
      boots: "foot_armor",
    };
    assets.addTag("minecraft", tagMap[pieceType], `${namespace}:${id}`);
  }
}

class HorseArmorTemplate extends BaseTemplate {
  constructor() {
    super("horseArmor", "Horse Armor");
    this.isChild = true;
    // Add input fields.
    this.addField(new Field("pieceTitle", "", "title"));
    this.addField(
      new Field("itemName", "Item Name", "text", {
        placeholder: "e.g., Emerald Horse Armor",
        width: "half",
        required: true,
      })
    );
    this.addField(
      new Field("itemId", "Item ID", "text", {
        placeholder: "e.g., emerald_horse_armor",
        width: "half",
        required: true,
      })
    );
    this.addField(
      new Field("vanilla", "Base Vanilla Item", "text", {
        placeholder: "minecraft:iron_horse_armor",
        width: "half",
      })
    );
    this.addField(
      new NumberField("armor", "Armor Points", {
        defaultValue: 7,
        width: "half",
        required: true,
        range: { min: 0 },
      })
    );
    this.addField(
      new FileField("textureFile", "Item Texture (.png)", {
        accept: "image/png",
        withPreview: true,
        width: "full",
      })
    );
    this.addField(
      new FileField("wornTextureFile", "Worn Horse Armor Texture", {
        accept: "image/png",
        withPreview: true,
        width: "full",
      })
    );
  }

  onGenerate(ctx) {
    const { assets, packSettings, parentContext } = ctx;
    const namespace = packSettings.packName;
    const id = ctx.getField("itemId");
    const itemName = ctx.getField("itemName");

    const setName = parentContext
      .getField("setName")
      .toLowerCase()
      .replace(/\s+/g, "_");

    if (!id || !namespace) {
      console.warn(
        `Skipping generation for type horse_armor: Card is missing ID or namespace.`
      );
      return;
    }

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
      },
      translations: {
        en_us: itemName,
      },
      components: {
        "minecraft:equippable": {
          slot: "body",
          asset_id: namespace + ":" + setName,
        },
        "minecraft:attribute_modifiers": [
          {
            type: "minecraft:armor",
            slot: "body",
            id: `${namespace}:${id}_armor`,
            amount: ctx.getField("armor"),
            operation: "add_value",
          },
        ],
      },
    };

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

    // Create item model definition.
    assets.createFile(
      `assets/${namespace}/models/item/${id}.json`,
      JSON.stringify(
        {
          parent: "minecraft:item/generated",
          textures: { layer0: `${namespace}:item/${id}` },
        },
        null,
        2
      )
    );

    // Write textures.
    const texture = ctx.getField("textureFile");
    if (texture)
      assets.createFile(`assets/${namespace}/textures/item/${id}.png`, texture);

    const wornTexture = ctx.getField("wornTextureFile");
    if (wornTexture)
      assets.createFile(
        `assets/${namespace}/textures/entity/equipment/horse_body/${setName}.png`,
        wornTexture
      );

    // Create equipment texture definition.
    assets.addEquipmentTexture(
      setName,
      "horse_body",
      `${namespace}:${setName}`
    );
  }
}

export class ArmorSetTemplate extends BaseTemplate {
  constructor() {
    super("armorSet", "Armor Set");
    // Create input fields.
    this.addField(
      new Field("setName", "Armor Set Name", "text", {
        placeholder: "e.g., Emerald",
        width: "full",
        onChange: this.updateArmorPieceNames,
        required: true,
      })
    );
    this.addField(
      new SelectField(
        "baseSet",
        "Base Vanilla Set",
        [
          { value: "leather", text: "Leather" },
          { value: "chainmail", text: "Chainmail" },
          { value: "iron", text: "Iron" },
          { value: "gold", text: "Gold" },
          { value: "diamond", text: "Diamond" },
          { value: "netherite", text: "Netherite" },
        ],
        {
          width: "half",
          defaultValue: "iron",
          onChange: this.updateArmorPieceStats,
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
      new FileField("wornTextureFile", "Worn Armor Texture (Set)", {
        accept: "image/png",
        withPreview: true,
        width: "full",
      })
    );
    this.addField(
      new FileField("wornLeggingsTextureFile", "Worn Leggings Texture (Set)", {
        accept: "image/png",
        withPreview: true,
        width: "full",
      })
    );

    // Add child items.
    this.addChildItems(
      new ChildItem("Armor Pieces", [
        {
          label: "Add Helmet",
          template: new ArmorPieceTemplate(),
          options: { pieceType: "helmet" },
        },
        {
          label: "Add Chestplate",
          template: new ArmorPieceTemplate(),
          options: { pieceType: "chestplate" },
        },
        {
          label: "Add Leggings",
          template: new ArmorPieceTemplate(),
          options: { pieceType: "leggings" },
        },
        {
          label: "Add Boots",
          template: new ArmorPieceTemplate(),
          options: { pieceType: "boots" },
        },
        {
          label: "Add Horse Armor",
          template: new HorseArmorTemplate(),
          options: { pieceType: "horse_armor" },
        },
      ])
    );
  }

  onCardAdded = (card) => {
    this.updateArmorPieceStats({
      target: card.querySelector('[data-id="baseSet"]'),
    });
  };

  updateArmorPieceNames = (event) => {
    const setCard = event.target.closest(".card");
    const setName = setCard.querySelector('[data-id="setName"]').value.trim();
    setCard.querySelectorAll(".armor-piece-card").forEach((pieceCard) => {
      this.applyNameToPiece(setCard, pieceCard);
    });
  };

  applyNameToPiece = (parentCard, pieceCard) => {
    const setName = parentCard
      .querySelector('[data-id="setName"]')
      .value.trim();
    const pieceType = pieceCard.dataset.pieceType;
    if (setName) {
      const pieceNameInput = pieceCard.querySelector('[data-id="itemName"]');
      const pieceIdInput = pieceCard.querySelector('[data-id="itemId"]');
      if (pieceNameInput) {
        pieceNameInput.value =
          setName +
          " " +
          pieceType
            .split("_")
            .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
            .join(" ");
      }
      if (pieceIdInput) {
        const currentId = pieceIdInput.value;
        const newId =
          setName.toLowerCase().replace(/\s+/g, "_") + "_" + pieceType;
        if (currentId === "" || currentId.endsWith("_" + pieceType)) {
          pieceIdInput.value = newId;
        }
      }
    }
  };

  updateArmorPieceStats = (event) => {
    const setCard = event.target.closest(".card");
    const baseSet = setCard.querySelector('[data-id="baseSet"]').value;
    setCard.querySelectorAll(".child-card").forEach((pieceCard) => {
      const pieceType = pieceCard.dataset.pieceType;
      const stats = VANILLA_DATA.armor[baseSet]?.[pieceType];
      const pieceTypeDisplay = pieceType
        .split("_")
        .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
        .join(" ");
      pieceCard.querySelector('[data-id="pieceTitle"]').textContent =
        pieceTypeDisplay;
      if (!stats) return;
      pieceCard.querySelector('[data-id="vanilla"]').value = stats.vanilla;
      pieceCard.querySelector('[data-id="armor"]').value = stats.armor;
      if (pieceCard.querySelector("[data-id='durability']"))
        pieceCard.querySelector('[data-id="durability"]').value =
          stats.durability;
      if (pieceCard.querySelector("[data-id='enchantability']"))
        pieceCard.querySelector('[data-id="enchantability"]').value =
          stats.enchantability;
    });
  };

  onGenerate(ctx) {
    const { assets, packSettings } = ctx;
    const namespace = packSettings.packName;

    if (!namespace) {
      console.warn(
        "Skipping generation for armor set: Card is missing namespace."
      );
      return;
    }

    // Write texture files.
    const wornTexture = ctx.getField("wornTextureFile");
    const wornLeggingsTexture = ctx.getField("wornLeggingsTextureFile");
    const setName = ctx.getField("setName").toLowerCase().replace(/\s+/g, "_");

    if (wornTexture)
      assets.createFile(
        `assets/${namespace}/textures/entity/equipment/humanoid/${setName}.png`,
        wornTexture
      );
    if (wornLeggingsTexture)
      assets.createFile(
        `assets/${namespace}/textures/entity/equipment/humanoid_leggings/${setName}.png`,
        wornLeggingsTexture
      );

    // Write equipment texture definitions.
    assets.addEquipmentTexture(setName, "humanoid", `${namespace}:${setName}`);
    assets.addEquipmentTexture(
      setName,
      "humanoid_leggings",
      `${namespace}:${setName}`
    );
  }
}
