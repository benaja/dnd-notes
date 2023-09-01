import {
  FormFieldType,
  IDateField,
  IFormField,
  IImageField,
  IPageField,
  IRichTextField,
  ISelectField,
  ITextField,
} from "~/jsonTypes";

type PartialRequired<T> = Partial<T> & {
  name: string;
};

export class FormField implements IFormField {
  type: IFormField["type"] = FormFieldType.Text;
  showOnCreate: ITextField["showOnCreate"] = false;
  showOnPreview: ITextField["showOnPreview"] = false;
  label: ITextField["label"] = "";
  width: ITextField["width"] = 1;
  name: ITextField["name"] = "";
  className: ITextField["className"] = "";

  constructor(props: PartialRequired<FormField>) {
    Object.assign(this, props);
  }
}

export class TextField extends FormField implements ITextField {
  type: ITextField["type"] = FormFieldType.Text;
  value: ITextField["value"] = "";
  options: ITextField["options"] = {
    type: "text",
  };

  constructor(
    props: PartialRequired<TextField>,
    options: Partial<ITextField["options"]> = {},
  ) {
    super(props);
    Object.assign(this, props);
    Object.assign(this.options, options);
  }
}

export class SelectField extends FormField implements ISelectField {
  type: ISelectField["type"] = FormFieldType.Select;
  value: ISelectField["value"] = null;
  options: ISelectField["options"] = {
    items: [],
  };

  constructor(props: PartialRequired<SelectField>) {
    super(props);
    Object.assign(this, props);
  }
}

export class RichTextField extends FormField implements IRichTextField {
  type: IRichTextField["type"] = FormFieldType.RichText;
  value: IRichTextField["value"] = "";
}

export class DateField extends FormField implements IDateField {
  type: IDateField["type"] = FormFieldType.Date;
  value: IDateField["value"] = null;

  constructor(props: PartialRequired<DateField>) {
    super(props);
    Object.assign(this, props);
  }
}

export class ImageField extends FormField implements IImageField {
  type: IImageField["type"] = FormFieldType.Image;
  value: IImageField["value"] = null;
  options: IImageField["options"] = {
    type: "round",
    multiple: false,
  };

  constructor(
    props: PartialRequired<ImageField>,
    options: Partial<IImageField["options"]> = {},
  ) {
    super(props);
    Object.assign(this, props);
    Object.assign(this.options, options);
  }
}

export class PageField extends FormField implements IPageField {
  type: IPageField["type"] = FormFieldType.PageSelector;
  value: IPageField["value"] = null;
  options: IPageField["options"] = {
    type: [],
  };

  constructor(
    props: PartialRequired<PageField>,
    options: Partial<IPageField["options"]> = {},
  ) {
    super(props);
    Object.assign(this, props);
    Object.assign(this.options, options);
  }
}
