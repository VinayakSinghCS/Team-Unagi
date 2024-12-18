const axios = require('axios'); // Axios for HTTP requests


function extractJsonFromText(text) {
    // Regex to match the JSON block inside the triple backticks
    const jsonPattern = /```json\n([\s\S]*?)\n```/;
    const match = text.match(jsonPattern);
  
    if (match && match[1]) {
      // Parse the matched JSON string into an object
      try {
        const jsonObject = JSON.parse(match[1]);
        return jsonObject;
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
      }
    } else {
      console.error("No JSON found in the provided text.");
      return null;
    }
  }
  

// Helper function to send the prompt to the AI model and generate a new content model
const sendRequestToAI = async (prompt, apiKey) => {
    console.info("promptsendRequestToAI",prompt)
  const url = 'https://api.groq.com/openai/v1/chat/completions';  // Ensure this is the correct URL
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  try {
    const response = await axios.post(url, {
      model: "llama-3.1-70b-versatile",  // Ensure this model name is correct
      messages: [{
        role: "user",
        content: `
          Based on the following prompt, create a detailed and optimized content model. The content model should adhere to CMS best practices. Consider the following CMS schema:
          Data Types and their Purpose

1. Single Line
The Single Line Textbox field enables users to type in single-line arbitrary text. When you add this field in content type, you will see a single-line textbox on the entry page to enter plain text only, for example, a name or an address line.This field possesses certain properties that you can change at any time as per your needs. The properties that can be modified are “Display Name,” “Unique ID,” “Placeholder Value,” “Instruction Value,” “Help Text,” “Number of Characters,” “Validation (Regex),” “Validation Error Message,” “Default Value,” “Mandatory,” “Multiple,” and “Non-localizable.”


JSON format (default):
{
  "data_type": "text",
  "display_name": "Single Line Textbox",
  "uid": "single_line",
  "field_metadata": {
    "description": "",
    "default_value": ""
  },
  "format": "",
  "error_messages": {
    "format": ""
  },
  "mandatory": false,
  "multiple": false,
  "non_localizable": false,
  "unique": false
}




2. MultiLine 
The Multi Line Textbox field enables users to enter multi-line arbitrary text as content.
When you add this field in content type, it displays a text area on the entry page to enter a large chunk of data, for example, an address.
This field possesses certain properties that you can change at any time as per your needs. The properties that can be modified are “Display Name,” “Unique ID,” “Placeholder Value,” “Instruction Value,” “Help Text,” “Number of Characters,” “Validation (Regex),” “Validation Error Message,” “Default Value,” “Mandatory,” “Multiple,” and “Non-localizable.”

JSON format (default): 
{
    "data_type": "text",
    "display_name": "Multi Line Textbox",
    "uid": "multi_line",
    "field_metadata": {
        "description": "",
        "default_value": "",
        "multiline": true
    },
    "format": "",
    "error_messages": {
        "format": ""
    },
    "mandatory": false,
    "multiple": false,
    "non_localizable": false,
    "unique": false
}

3. Title
By default, the Title field is available for all content types created. It accepts single-line text and does not provide any formatting options or line breaks. The value entered in this field, while creating an entry, is considered as the title of the entry.

This field possesses certain properties that you can change at any time as per your needs. The properties that can be modified are “Display Name,” “Placeholder Value,” “Instruction Value,” “Help Text,” “Number of Characters,” “Validation (Regex),” and “Validation Error Message,” and “Non-localizable.”

JSON format (default):
{
    "data_type": "text",
    "display_name": "Single Line Textbox",
    "uid": "title",
    "field_metadata": {
        "description": "",
        "default_value": ""
    },
    "format": "",
    "error_messages": {
        "format": ""
    },
    "mandatory": false,
    "multiple": false,
    "non_localizable": false,
    "unique": false
}

4.HTML
The HTML-based Rich Text Editor (RTE) field enables users to input different types of content such as text, image, videos, and so on. When you add a HTML-based RTE field in a content type, it displays a text area with editing and formatting options in the entry page. This field allows you to edit and format content entered in the field without using HTML tags (however, you can use HTML tags in the HTML mode, if needed).
We now have a JSON Rich Text Editor that stores content in structured JSON blocks and returns clean data in the response body. You can also migrate content from your HTML-based RTE to the new JSON RTE using our CLI.

JSON format (default):
{
    "data_type": "text",
    "display_name": "Rich Text Editor",
    "uid": "rich_text_editor",
    "field_metadata": {
        "allow_rich_text": true,
        "description": "",
        "multiline": false,
        "rich_text_type": "advanced",
        "options": []
    },
    "mandatory": false,
    "multiple": false,
    "non_localizable": false,
    "unique": false
}

5. JSON Rich Text Editor
The JSON Rich Text Editor (RTE) in Contentstack delivers structured content in a clean JSON format, making it ideal for seamless integration with modern front-end frameworks. It offers flexibility with customizable toolbar options, enabling developers to tailor the editor’s features to suit specific content needs. Designed for both simplicity and advanced use, the JSON RTE supports rich text formatting, custom blocks, and embeds, ensuring scalability and ease of content management.

JSON format(default):
{
    "data_type": "json",
    "display_name": "JSON Rich Text Editor",
    "uid": "json_rte",
    "field_metadata": {
        "allow_json_rte": true,
        "embed_entry": false,
        "description": "",
        "default_value": "",
        "multiline": false,
        "rich_text_type": "advanced",
        "options": []
    },
    "format": "",
    "error_messages": {
        "format": ""
    },
    "reference_to": [],
    "multiple": false,
    "non_localizable": false,
    "unique": false,
    "mandatory": false
}

6. Markdown
The Markdown field enables users to input text in markdown format in an entry. Markdown text is marked with certain tags or formatting instructions. Once done entering your content, click on the Preview tab to preview your formatted text in real time.This field possesses certain properties that you can change any time as per your needs. The properties that can be modified are “Display Name,” “Unique ID,” “Placeholder Value,” “Instruction Value,” “Help Text,” “Mandatory,” “Multiple,” and “Non-localizable.”

JSON format(default):
{
    "data_type": "text",
    "display_name": "Markdown",
    "uid": "markdown",
    "field_metadata": {
        "description": "",
        "markdown": true
    },
    "mandatory": false,
    "multiple": false,
    "non_localizable": false,
    "unique": false
}

7. Select
The Select field allows users to choose one or more options from a set of predefined choices. You can configure this field to be a Radio button, Checkbox, or Dropdown menu.
You can add choices within the Select field in two ways:

1 . Single-value choices: You can add options containing single values, for example, in eCommerce, let someone pick a shirt size from S, M, L, or XL


JSON format (default):
{
  "data_type": "text",
  "display_name": "Select",
  "display_type": "dropdown",
  "enum": {
    "advanced": false,
    "choices": [
      {
        "value": "S"
      },
      {
        "value": "M"
      },
      {
        "value": "L"
      },
      {
        "value": "XL"
      }
    ]
  },
  "multiple": false,
  "uid": "select",
  "field_metadata": {
    "description": "",
    "default_value": "S"
  },
  "mandatory": false,
  "non_localizable": false,
  "unique": false
}

2. Key-value pair choices: You can toggle the Key-value enabled option.
Note: Only the key name is displayed in the entry page, while the value is stored in the backend database for reference.When the Key-value pair option is toggled on, the advanced parameter in the Select field schema is set to true and the schema displays the key and value added by the user.

{
    "data_type":"text",
    "display_name":"Select",
    "display_type":"dropdown",
    "enum":{
        "advanced":true,
        "choices":[
            {
                "key":"New York",
                "value":"NY"
            },
            {
                "key":"India",
                "value":"IN"
            },
            {
                "key":"Australia",
                "value":"AUS"
            }
        ]
    },
    "multiple":true,
    "uid":"select",
    "field_metadata":{
        "description":"",
        "default_value":""
    },
    "mandatory":false,
    "unique":false
}

Additionally, you need to set the parameters given below:
display_type: This parameter allows you to assign a display type either in the form of radio button, checkboxes, or dropdown.
enum: This parameter allows you to provide the choice for the ‘Select’ field.
advanced: This parameter when set to true allows you to provide choices for the 'Select' field in key-value pairs.


8. Modular Blocks
Modular Blocks is a field that allows content managers to dynamically create and modify components of a page or app on the go.

Modular Blocks - Real World Scenarios
Example 1 - Fluid Page Components
Creating a single content type for many similar, but still different pages can be a complicated task. However, by using modular blocks, this can be simplified to a great extent. While giving the content editor the freedom to structure and order the page components as he/she wants, he/she can still only conform to the norms and standards the web page (or any other channel editing content for) offers.

Example 2 - Creating a Menu

With Modular Blocks, you can create a navigation menu for your web page. In this example, we will create two content types: Landing Page and Menu.

The Landing Page content type will serve as the referenced content type whereas the Menu content type is where we will add the modular block field. The entries in this content type will refer to the entries of the Landing Page content type.

Nested Modular Blocks

You can add Modular Blocks within a Modular Blocks field while creating a content type. This provides content managers with the flexibility of creating complex data structures with different content schemas.

Tip: You can use nested Modular Blocks to create nested or flexible content pieces that have different structures. However, for similar structures, you can use nested Group fields instead.


The schema of a Modular Blocks field consisting of a Single Line Textbox and a Rich Text Editor is given as follows:


{
    "data_type": "blocks",
    "display_name": "Modular Blocks",
    "abstract": "Create content dynamically",
    "blocks": [{
        "title": "Block",
        "uid": "block",
        "autoEdit": true,
        "schema": [{
                "data_type": "text",
                "display_name": "Single line textbox",
                "abstract": "Name, title, email address, any short text",
                "uid": "single_line",
                "field_metadata": {
                    "description": "",
                    "default_value": ""
                },
                "class": "high-lighter",
                "format": "",
                "error_messages": {
                    "format": ""
                }
            },
            {
                "data_type": "text",
                "display_name": "Rich text editor",
                "abstract": "Long text with formatting options",
                "uid": "rich_text_editor",
                "field_metadata": {
                    "allow_rich_text": true,
                    "description": "",
                    "multiline": false,
                    "rich_text_type": "advanced"
                },
                "class": "high-lighter"
            }
        ]
    }],
    "multiple": true,
    "uid": "modular_blocks",
    "field_metadata": {}
}

You can also add Global fields as blocks in a Modular Blocks field. The schema of a Modular Blocks field consisting of a Global field as a block and a normal block schema is given as follows:

{
    "data_type": "blocks",
    "display_name": "Modular Blocks",
    "abstract": "Create content dynamically",
    "blocks": [{
        "title": "Block",
        "uid": "block",
        "autoEdit": true,
        "schema": [{
                "data_type": "text",
                "display_name": "Single line textbox",
                "abstract": "Name, title, email address, any short text",
                "uid": "single_line",
                "field_metadata": {
                    "description": "",
                    "default_value": ""
                },
                "class": "high-lighter",
                "format": "",
                "error_messages": {
                    "format": ""
                }
            },
            {
                "data_type": "text",
                "display_name": "Rich text editor",
                "abstract": "Long text with formatting options",
                "uid": "rich_text_editor",
                "field_metadata": {
                    "allow_rich_text": true,
                    "description": "",
                    "multiline": false,
                    "rich_text_type": "advanced"
                },
                "class": "high-lighter"
            }
        ]
    }, {
        "title": "Block",
        "uid": "block",
        "reference_to": "global_field_uid"
    }],
    "multiple": true,
    "uid": "modular_blocks",
    "field_metadata": {}
}

9. Number
The Number field enables users to enter numeric data, for example, phone number or ZIP code.

JSON format(default):
{
    "data_type": "number",
    "display_name": "Number",
    "uid": "number",
    "field_metadata": {
        "description": "",
        "default_value": ""
    },
    "multiple": false,
    "mandatory": false,
    "unique": false
}

10. Boolean

The Boolean input field enables users to input a “true” or “false” value in an entry. When you add this field in content type, it reflects as a toggle switch on the entry page.


JSON format:
{
    "data_type": "boolean",
    "display_name": "Boolean",
    "uid": "boolean",
    "field_metadata": {
        "description": "",
        "default_value": ""
    },
    "multiple": false,
    "mandatory": false,
    "unique": false
}

Boolean Field - Real World Scenarios

Let's understand how we can use the Boolean field in the content type with a couple of use cases.

    Clickwrap Boolean Field
    Default Boolean Value

Example 1 - Clickwrap Boolean Field
Using the Boolean field let's create a clickwrap field to obtain consent from users over the terms and conditions or privacy policies of your company’s legal agreement.

Example 2 - Default Boolean Value
Contentstack allows you to have a Default Value of the radio button or Boolean field. This default button helps users to pre-define the value of the Boolean field. The value entered here will appear by default while creating an entry for this content type.




12. Date

The Date field accepts a date in the ISO format. When you add this field in content type, it renders a calendar to select the date and time on the entry page.

{
    "data_type": "isodate",
    "display_name": "Date",
    "uid": "date",
    "startDate": null,
    "endDate": null,
    "field_metadata": {
        "description": "",
        "default_value": ""
    },
    "multiple": false,
    "mandatory": false,
    "unique": false
}


13. File

The File field enables users to upload and use files in an entry. The File field can be used to add assets, such as images, videos, PDFs, and audio files to your entries.

JSON
{
    "data_type": "file",
    "display_name": "File",
    "uid": "file",
    "extensions": [],
    "field_metadata": {
        "description": "",
        "rich_text_type": "standard"
    },
    "multiple": false,
    "mandatory": false,
    "unique": false
}



14. Link

The Link field enables users to add link(s) in their entry page. This field possesses two subfields:

    Title: Lets you specify the display text for the corresponding link
    Link: Lets you specify a static or relative (to the site’s root) URL for the corresponding title

JSON format:

{
    "data_type": "link",
    "display_name": "Link",
    "uid": "link",
    "field_metadata": {
        "description": "",
        "default_value": {
            "title": "",
            "url": ""
        }
    },
    "multiple": false,
    "mandatory": false,
    "unique": false
}

15. Reference

The Reference field allows you to create references to entries of the same content type or other content type(s). It lets you access and use entries of other content types as an input within your field.

The process of creating references of the same content type is known as “Self Referencing” and creating references of other content type(s) is known as “Include Referencing.”

JSON format:
{
    "data_type": "reference",
    "display_name": "Reference",
    "reference_to": "",
    "field_metadata": {
        "ref_multiple": false
    },
    "uid": "reference",
    "mandatory": false,
    "multiple": false,
    "unique": false
}



Self Referencing
In Self Referencing, the Reference field allows you to create references to entries of the same content type. It lets you use entries of the same content type as input.

JSON format:
{
    "data_type": "reference",
    "display_name": "Reference",
    "reference_to": "",
    "field_metadata": {
        "ref_multiple": false
    },
    "uid": "reference",
    "mandatory": false,
    "multiple": false,
    "unique": false
}



In Include Referencing, the “Reference” field allows you to create references to entries of a single or multiple content type(s). It lets you use entries of the selected content type(s) as input.

There are two subtypes of Include Referencing - “Single Content Type Referencing” and “Multiple Content Type Referencing.” Let’s look at them in detail.

Additional Resource: To know the difference between Single and Multiple Content types, refer to the Single vs Multiple guide.
Single Content Type Referencing

In Single Content Type Referencing, the Reference field allows you to create references to entries of a single content type.

Example: Let’s say you want to create news articles, and you want to link each news article to its author. In this case, you will begin by creating two content types: “News Article” and “Authors.” In your “News Article” content type, you can add a Reference field named “Author(s)” that points to the entries of the “Authors” content type for author data

Multiple Content Type Referencing

In Multiple Content Type Referencing, the “Reference” field allows you to create references to entries of multiple content types.

Example: Let’s say you are creating an e-commerce site, and your primary items are “Clothes,” “Shoes,” and “Bags,” and you want to create a page that displays all products of a selected brand.

Note: When selecting content types, at a time you can add 10 content types into a single field. For more limitations, refer to the Limitations section.


16. Group

The Group field enables users to group multiple fields together. When set to “Multiple,” users will be able to create multiple iterations of a Group field while creating entries.

JSON format:
{
    "data_type": "group",
    "display_name": "Group",
    "field_metadata": {},
    "schema": [{
        "data_type": "text",
        "display_name": "Single line textbox",
        "uid": "single_line",
        "field_metadata": {
            "description": "",
            "default_value": ""
        },
        "format": "",
        "error_messages": {
            "format": ""
        },
        "multiple": false,
        "mandatory": false,
        "unique": false
    }],
    "uid": "group",
    "multiple": true,
    "mandatory": false,
    "unique": false
}



Group Field Real World Scenarios

Let's understand a few real-world scenarios where we can use group fields on our website. Here, are a few group field real-world use cases:

    Banner/header of a website
    Survey using Group field
    Global field within Group Field

Example 1: Banner/ Header of a Website
A particular section of a website that has multiple fields can be created using the group field. A common example is the banner/header page of a website. The banner section of a website uses multiple fields to display content.

Example 2: Survey Using Group Field
Group fields can be used to dedicate a section of your website for specific purposes (for example, survey form). Within this field, you can incorporate all the existing fields Contentstack offers, to create your questionnaire. Apart from survey forms, you can also generate an online polling system, quizzes, or even a rating system.

Example 3: SEO Global Field Within a Group Field

Group fields can also accommodate global fields. While group fields can be iterated and used multiple times in a content type, the global field adds flexibility by allowing users to globally create fields and use them across all content types of a stack.

Global fields within a group help users to fetch content from global fields within the group field of a content type.



Additional Resources:

    To extend the functionality of your Group field you can add Global fields to the Group field and even set up Field Visibility Rules.
    If you are planning to edit any existing field of your content type, make sure to check out our Content Type Change Management guide to avoid data loss.



17. Global

A Global field is a reusable field (consisting of a group of fields) that you can define once and reuse in any content type within your stack. This field saves the time and effort of adding the same set of fields (and their settings) in multiple content types of a stack.

{
  "data_type": "global_field",
  "display_name": "Global Field",
  "reference_to": "{{global_field_uid}}",
  "uid": "global_field",
  "mandatory": false,
  "multiple": false,
  "unique": false
}




        

          **Prompt**: ${prompt.prompt}

          Ensure the model adheres to the following:
          - Choose appropriate fields for each content type (e.g., text, reference, number, etc.).
          - Maintain relationships between entities using reference fields.
          - Include nested content models using groups or blocks if necessary.

          Provide the content model in JSON format that can be used in the CMS.
        `
      }]
    }, { headers });

    return extractJsonFromText(response.data.choices[0].message.content); // Return the AI-generated content
  } catch (error) {
    console.error('Error during request:', error.response ? error.response.data : error.message);
    return null; // Return null in case of error
  }
};
// const extractJsonFromTexts=(text)=> {
//     console.info("textextractJsonFromTexts",text)
//     // Regex to match the JSON block inside the triple backticks
//     const jsonPattern = /```json\n([\s\S]*?)\n```/;
//     const match = text.match(jsonPattern);
  
//     if (match && match[1]) {
//       // Parse the matched JSON string into an object
//       try {
//         const jsonObject = JSON.parse(match[1]);
//         return jsonObject;
//       } catch (error) {
//         console.error("Error parsing JSON:", error);
//         return null;
//       }
//     } else {
//       console.error("No JSON found in the provided text.");
//       return null;
//     }
//   }
  
 
  

// Function to generate a new content model based on a user prompt
const generateContentModelFromPrompt = async (prompt, apiKey) => {
  try {
    const contentModel = await sendRequestToAI(prompt, apiKey);
    // const updatedData=extractJsonFromTexts(contentModel)

    // console.log('Generated Content Model:', contentModel);  // Log the content model
    return contentModel; // Return the newly generated content model
  } catch (error) {
    console.error('Error generating content model:', error);
    return null; // Return null in case of error
  }
};

module.exports = { generateContentModelFromPrompt }; // Export the function
