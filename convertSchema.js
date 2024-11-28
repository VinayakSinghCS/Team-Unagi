module.exports = function convertSchema() {
  // function convertSchema() {
  let jsonObject = {
    contentModel: {
      data_type: 'redirect',
      display_name: 'Redirect',
      uid: 'redirect',
      fields: [
        {
          data_type: 'text',
          display_name: 'Redirect URL',
          uid: 'redirect_url',
          field_metadata: {
            description: 'The URL to redirect to',
            default_value: '',
          },
          format: '',
          error_messages: {
            format: '',
          },
          mandatory: true,
          multiple: false,
          unique: false,
        },
        {
          data_type: 'reference',
          display_name: 'Reference URL',
          uid: 'reference_url',
          reference_to: 'url',
          field_metadata: {
            ref_multiple: false,
          },
          mandatory: false,
          multiple: false,
          unique: false,
        },
        {
          data_type: 'boolean',
          display_name: ' Permanent Redirect',
          uid: 'permanent_redirect',
          field_metadata: {
            description:
              'Whether this is a permanent redirect (301) or a temporary redirect (302)',
            default_value: false,
          },
          mandatory: false,
          multiple: false,
          unique: false,
        },
        {
          data_type: 'number',
          display_name: 'Redirect Code',
          uid: 'redirect_code',
          field_metadata: {
            description: 'The HTTP status code for the redirect',
            default_value: 302,
          },
          multiple: false,
          mandatory: false,
          unique: false,
        },
      ],
    },
  };

  try {
    // Update the JSON as per the requirements
    jsonObject.contentModel.title = jsonObject.contentModel.display_name; // Replace "display_name" with "title"
    delete jsonObject.contentModel.display_name; // Remove the "display_name" field

    delete jsonObject.contentModel.data_type; // Remove the "data_type" field
    delete jsonObject.contentModel.mandatory; // Remove the "mandatory" field
    delete jsonObject.contentModel.unique; // Remove the "unique" field

    jsonObject.contentModel.multiple = true; // Change "multiple" value to true

    // Add the "options" object
    jsonObject.contentModel.options = {
      title: 'title',
      publishable: true,
      is_page: true,
      singleton: false,
      sub_title: ['url'],
      url_pattern: '/:title',
      url_prefix: '/',
    };
    console.log('::: jsonObject', jsonObject?.contentModel);
    return jsonObject?.contentModel;
  } catch (error) {
    console.error('Error data:', error.message);
  }
};
