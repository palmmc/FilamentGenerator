// Base class for field types
class BaseField {
  constructor(id, label, type, options = {}) {
    this.id = id;
    this.label = label;
    this.type = type;
    this.options = options;
    this.required = options.required || false;
    this.requiredMessage = options.requiredMessage || "This field is required.";
  }
}

// Basic text input field
export class Field extends BaseField {
  constructor(id, label, type = "text", options = {}) {
    super(id, label, type, options);
  }
}
// Dropdown/choices field
export class SelectField extends BaseField {
  constructor(id, label, choices = [], options = {}) {
    super(id, label, "select", options);
    this.choices = choices; // [{value: 'val', text: 'Display'}]
  }
}
// Integer input field
export class NumberField extends BaseField {
  constructor(id, label, options = {}) {
    super(id, label, "number", options);
    this.range = options.range || null; // e.g., { min: 0, max: 100 }
  }
}
// File upload field
export class FileField extends BaseField {
  constructor(id, label, options = {}) {
    super(id, label, "file", options);
  }
}
// Child/parent cards
export class ChildItem {
  constructor(title, buttons = []) {
    this.title = title;
    this.buttons = buttons;
  }
}

// Base class for all generator templates
export class BaseTemplate {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.fields = [];
    this.childItemDef = null;
    this.cardStyle = "";
    this.isChild = false;
  }

  addField(field) {
    this.fields.push(field);
  }

  addChildItems(childItemDef) {
    this.childItemDef = childItemDef;
  }

  // Called after a card of this template type is created.
  onCardAdded(cardElement) {}

  // Generation logic when the pack is compiled for this template.
  onGenerate(context) {
    throw new Error(`onGenerate() not implemented by ${this.constructor.name}`);
  }
}
