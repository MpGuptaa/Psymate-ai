export const inputElements =
  "text,email,number,textarea,select,basicSelect,api,date,time,textarea,password,color,radio,checkbox,picker,range,document,image,multiple,editor";

export const categories = [
  {
    components: [
      {
        label: "Add Form Name",
        element: "text",
        name: "displayName",
        width: 6,
        required: true,
        title: "This field will be used to enter the name of the form and is required",
      },
      {
        label: "Category of forms",
        element: "text",
        name: "category",
        width: 6,
        required: true,
        title: "This field will specify the category of the form and is required",
      },
      {
        label: "Sub Category",
        element: "text",
        name: "subCategory",
        width: 6,
        required: true,
        title: "This field will specify the sub-category of the form and is required",
      },
      {
        label: "URL you want this form to be visible",
        element: "text",
        name: "URL",
        width: 6,
        required: true,
        title: "This field will be used to enter the URL of the form and is required",
      },
      {
        label: "Other Options",
        element: "text",
        name: "options",
        width: 6,
        required: false,
        title: "This field will be used to specify options for the form and is required",
      },
      {
        label: "Instructions",
        element: "text",
        name: "instructions",
        width: 6,
        required: true,
        title: "This field will be used to specify Instructions for the form and is required for Assessments",
      },
      {
        label: "Psychoeducation",
        element: "text",
        name: "psychoeducation",
        width: 6,
        required: true,
        title: "This field will be used to specify Psychoeducation for the form and is required for Assessments",
      },
      {
        label: "Roles",
        element: "checkbox",
        width: 4,
        items: "admin,supervisor",
        name: "roles",
        required: true,
        title: "This field will indicate whether the form field is is accessible to which roles, and is required",
      },
    ],
  },
];
export const profileItems = [
  {
    subCategory: "personalItems",
    components: [
      {
        label: "Form Element element",
        element: "select",
        width: 4,
        name: "element",
        items: inputElements,
        for: inputElements,
        required: true,
        title: "This field will specify the element of the form field and is required",
      },
      {
        label: "Logo",
        element: "image",
        width: 4,
        for: "document,image",
        name: "logo",
        items: inputElements,
        required: true,
        title: "This field will add logo in the form, can be used only once",
      },
      {
        label: "Form Element Name",
        element: "text",
        name: "label",
        for: inputElements,
        width: 4,
        required: true,
        title: "This field will be used as the label for the form field and is required",
      },
      {
        label: "Width of your element",
        element: "text",
        name: "width",
        width: 4,
        for: inputElements,
        defaultValue: 4,
        required: true,
        title: "This field will specify the width of the form field and is required",
      },
      {
        label: "Form Element Variable",
        element: "text",
        name: "name",
        for: inputElements,
        width: 4,
        required: true,
        title: "This field will hold the variable name for the form field and is required",
      },
      {
        label: "Specify Options",
        element: "text",
        for: "select,basicSelect,api,date,time,textarea,password,color,radio,checkbox,picker,range,document,image,multiple",
        name: "options",
        width: 4,
        required: false,
        title: "This field will be used to specify options for the form field and is required",
      },
      {
        label: "Add Items",
        element: "text",
        for: "select,basicSelect,api,date,time,textarea,password,color,radio,checkbox,picker,range,document,image,multiple",
        width: 4,
        items: [],
        name: "items",
        required: false,
        title:
          "This field will be used to add items to the form field which will create radio or checkbox inputs which are seperated by commas. Also If yu want to add a subscript to the field just add items like OptionOne-DescriptionOne,OptionTwo-DescriptionTwo. So the description will be visible at the bottom of each element",
      },
      // {
      //   label: "Add Fields",
      //   element: "multiple",
      //   width: 4,
      //   multipleFields: [
      //     {
      //       name: "name",
      //       label: "Form Element Name",
      //       element: "text",
      //     },
      //     {
      //       name: "Label",
      //       label: "Form Element Label",
      //       element: "text",
      //     },
      //     {
      //       name: "element",
      //       label: "Form Element",
      //       element: "select",
      //       items: inputElements,
      //       variants: ["searchable"],
      //     },
      //     {
      //       name: "items",
      //       label: "Add Items",
      //       element: "text",
      //     },
      //     {
      //       name: "options",
      //       label: "Add options",
      //       element: "text",
      //     },
      //     {
      //       name: "variants",
      //       label: "Element variants",
      //       element: "select",
      //       items: ["searchable", "multiple"],
      //     },
      //   ],
      //   // items: "name,label,element,items,options,variants",
      //   name: "multipleFields",
      //   required: false,
      //   title: "Choose true if you want to Multiple dates or a date range",
      // },
      {
        label: "Tooltip",
        element: "text",
        for: inputElements,
        width: 4,
        name: "title",
        required: false,
        title: "This field will have the tooltip that will appear as a description of the form field if any",
      },
      {
        label: "Max Limit",
        element: "number",
        for: "number,range",
        width: 4,
        name: "max",
        required: false,
        title: "This field will specify the maximum number of the input value",
      },
      {
        label: "Heading",
        element: "text",
        name: "tag",
        for: inputElements,
        width: 4,
        required: false,
        title: "This field will hold heading categories",
      },
      {
        label: "Min Limit",
        element: "number",
        width: 4,
        name: "min",
        for: "number,range",
        required: false,
        title: "This field will specify the minimum number of the input value",
      },
      {
        label: "Icon",
        element: "text",
        width: 4,
        for: "text,email,number,date,time,textarea,password,color",
        name: "icon",
        required: false,
        title: "This field will indicate whether the form field is has an icon on the right or not",
      },
      {
        label: "Rows",
        element: "number",
        width: 4,
        for: "textarea",
        name: "rows",
        required: false,
        title: "This field will handle the height of the component",
      },
      {
        label: "Description",
        element: "text",
        for: inputElements,
        width: 4,
        name: "description",
        required: false,
        title: "This field will Place a description text at the bottom of the Input field",
      },
      {
        label: "PlaceHolder",
        element: "text",
        width: 4,
        for: inputElements,
        name: "placeholder",
        required: false,
        title: "You can add custom Place holder, If not provided, an autogenerated placeholder will be added",
      },
      {
        label: "Add Custom Css",
        element: "text",
        name: "colCssClasses",
        width: 4,
        for: inputElements,
        required: false,
        title: "This field will be used to add custom CSS in every field",
      },
      {
        label: "Add Options CSS",
        element: "text",
        name: "optionCssClasses",
        width: 4,
        for: "radio,checkbox",
        required: false,
        title: "This field will be used to add custom CSS in every field",
      },
      {
        label: "Size",
        element: "select",
        width: 4,
        name: "size",
        for: inputElements,
        items: "sm,normal,lg",
        required: false,
        title: "This field will Specify the Size, Leave empty if you want the default size",
      },
      {
        label: "Select Color",
        element: "select",
        width: 4,
        for: inputElements,
        name: "color",
        items: "secondary,success,warning,danger,info,dark",
        required: false,
        title: "This field will Specify the Size, Leave empty if you want the default size",
      },
      {
        label: "Variant",
        element: "select",
        width: 4,
        name: "variants",
        for: "select,basicSelect,api,multiple",
        variants: "multiple,searchable",
        items: "multiple,searchable,loading,clearable,rtl",
        required: false,
        title:
          "Select the element of select you want this field to be - Mu;tiple will allow the user to choose multiple option, and searchable is default",
      },
      {
        label: "Read Only",
        element: "radio",
        width: 4,
        items: "disabled",
        for: inputElements,
        name: "readOnly",
        required: false,
        title: "This field will indicate whether the form field is readOnly or not",
      },
      {
        label: "Is Disabled",
        element: "radio",
        width: 4,
        items: "disabled",
        for: inputElements,
        name: "true,false",
        required: false,
        title: "This field will indicate whether the form field is disabled or not",
      },
      {
        label: "Mandatory",
        element: "radio",
        width: 4,
        for: inputElements,
        items: "true,false",
        name: "required",
        required: true,
        title: "This field will indicate whether the form field is required or not and is required",
      },
      {
        label: "Is Rounded",
        element: "radio",
        width: 4,
        for: inputElements,
        items: "true,false",
        name: "rounded",
        required: false,
        title: "If true, the input box will have rounded corners",
      },
      {
        label: "Assign Roles",
        element: "api",
        width: 4,
        for: inputElements,
        items: "displayName,code",
        variants: "searchable,multiple",
        options: "data/roles?searchBy=displayName_Roles",
        name: "roles",
        required: false,
        title:
          "Assign Roles for this Field, If you want to add multiple APIs then use multiple APIs in the options with comma seperated values and the Label will be mentioned with _, Eg. /api_API",
      },
      {
        label: "Set Min Date",
        element: "picker",
        width: 4,
        for: "picker",
        mode: "single",
        dateFormat: "Y-m-d",
        name: "minDate",
        required: false,
        noCalendar: "false",
        title: "Set the minimum allowed date for the picker",
      },
      {
        label: "Set Max Date",
        element: "picker",
        width: 4,
        for: "picker",
        mode: "single",
        dateFormat: "Y-m-d",
        noCalendar: "false",
        name: "maxDate",
        required: false,
        title: "Set the maximum allowed date for the picker",
      },
      {
        label: "Enable Time",
        element: "radio",
        width: 4,
        items: "true,false",
        for: "picker",
        name: "enableTime",
        required: false,
        title: "Choose true if you want to store time values",
      },
      {
        label: "Week Numbers",
        element: "radio",
        width: 4,
        items: "true,false",
        for: "picker",
        name: "weekNumbers",
        required: false,
        title: "Choose true if you want to Weeks to be visible in the calender",
      },
      {
        label: "Disable Calendar",
        element: "radio",
        width: 4,
        items: "true,false",
        for: "picker",
        name: "noCalendar",
        required: false,
        title: "Choose true if you want to hide calender",
      },
      {
        label: "Date Format",
        element: "text",
        width: 4,
        for: "picker",
        name: "dateFormat",
        required: false,
        title: "Enter the date format, Acceptible values (H:i , Y-m-d) *",
      },
      {
        label: "24 Hour Format",
        element: "radio",
        width: 4,
        items: "true,false",
        for: "picker",
        name: "time_24hr",
        required: false,
        title: "Choose true if you want to 24 Hour Time format",
      },
      {
        label: "Mode",
        element: "select",
        width: 4,
        for: "picker",
        items: "single,multiple,range",
        name: "mode",
        required: false,
        title: "Choose true if you want to Multiple dates or a date range",
      },
    ],
  },
];