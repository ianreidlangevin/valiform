# Valiform

Welcome to Valiform, a lightweight, data-attribute based form validation library. Valiform is library-agnostic, easy to use, and highly customizable.

## Installation

```javascript
yarn add valiform
```

or

```javascript
npm install valiform
```

## Getting Started

Begin by creating a new instance for your form. You can select your form using a CSS selector as shown below:

```javascript
new FormValidation(".my-form").init()
```

### Configuration Options

You have the ability to customize the behavior of Valiform by passing an options object to the constructor. Here's an example:

```javascript
new FormValidation(".my-form", {
   formEndpoint: "https://endpoint-url.com", // Optional: Use this to send form data to a specific endpoint on submit. If left blank, the default form submission method will be used.
   emptyValues: [] // Optional: This array holds values that the validator will consider as empty. This can be useful for fields such as select.
}).init()
```

### Custom Validators

You can also override the default validators or add new ones. Each validator is an object with a `type` and a `regex`. The `type` is not tied to standard HTML field types, but is used in a data-attribute to match your field with the validator. Here's how you can define a custom validator:

```javascript
new FormValidation(".my-form", {}, [
   {
      type: "tel",
      regex: /^[+]?[(]?[0-9]{3}[)]?[-s. ]?[0-9]{3}[-s. ]?[0-9]{4,6}$/im
   },
]).init()
```


## Default Validators

Valiform comes with a set of pre-configured validators that you can use by assigning the appropriate type to the `data-valiform-regex` attribute in your HTML. Here's a list of the available validators:

- `tel`: For validating telephone numbers.
- `email`: For validating email addresses.
- `postal-code`: For validating postal codes.
- `alpha`: For validating alphabetical input.
- `text`: For validating text input, including special and accented characters.
- `numeric`: For validating numeric input.
- `alphanumeric`: For validating alphanumeric input.
- `alphanumeric-extended`: For validating alphanumeric input, including special and accented characters.
- `address`: For validating address input.
- `url`: For validating URLs.

If the provided validators do not meet your needs, you can define and use your own validators when creating a new instance of `FormValidation`. 

For more information on the regex patterns used by the default validators, refer to the [validators.js](https://github.com/ianreidlangevin/valiform/blob/develop/validators.js) file in the Valiform repository.



## Using Valiform in HTML

### Validating Fields

To enable validation on a field, add the `data-valiform` attribute to it. Validation can be based on whether the field is required or on its type. Here's an example:

```html
<input 
   data-valiform
   data-valiform-regex="name"
   data-valiform-msg-failed=" The value is invalid"
   data-valiform-msg-required="This field is required"
   required
   type="text" 
   name="my-test-field"
   id="my-test-field"
>
```

Let's break down the data attributes:

- `data-valiform`: Marks this field for validation.
- `data-valiform-regex="name"`: Specifies the validator type (matches a type in the validators). If you just want to validate the required attribute, remove it.
- `data-valiform-msg-failed="The value is invalid"`: Specifies the error message to be displayed when validation fails.
- `data-valiform-msg-required="This field is required"`: Specifies the error message to be displayed when the field is empty.

If you want to validate the length, use the default HTML `maxlength` and `minlength` attributes. To display an error message for length validation, add the following data attribute:

```html
data-valiform-msg-length="The length must be between 2 and 8 characters."
```

Similarly, for required fields, use the default HTML `required` attribute. This ensures that even if the JS validation fails, the native browser validation will take over.

### Error Messages

To display error messages, add a div with the `data-valiform-msg` attribute. The value of this attribute should match the field name. Example:

```html
<div data-valiform-msg="my-test-field"></div>
```

Initially, this div should be hidden (`display: none`). The JS will handle toggling its visibility based on validation results and insert the right message.

### Form Submission

To validate the form upon submission, add the `data-valiform-submit` attribute to your submit button:

```html
<button data-valiform-submit type="submit">Submit form</button>
```

### Sending Data to an Endpoint

If you're using a form endpoint service (for example, getform, useBasin, formKeep, etc.), Valiform will automatically manage the data-valiform-submit attribute on the form. This attribute indicates the status of the submission.

Possible values for the `data-valiform-submit` attribute are:

- `"sending"`: This value is set during the fetch request to the endpoint. You can use this to display a spinner or some other indication that data is being sent, using CSS or JavaScript.
- `"success"`: This value is set if the data is successfully sent to the endpoint.
- `"failed"`: This value is set if there's an error during the fetch request or if the endpoint is incorrectly configured in the `FormValidation` instance.

Note that the submit button will be disabled after the data is sent to prevent multiple submissions. This will occur regardless of whether the fetch request succeeds or fails.

## General Information

### Validation Status

The `data-valiform` attribute on each field will return a value based on the validation process. The possible values are:

- `"success"`: Validation passed.
- `"failed"`: Validation failed.
- `"required"`: Field is required but empty.
- `"length"`: The field's length does not meet the specified constraints.

In order for the form to be submitted, all fields must return a `"success"` value upon validation.

***

#### Author

This package was developed by Ian Reid Langevin. You can learn more about my other projects and get in touch with me at my personal website: [reidlangevin.com](https://reidlangevin.com).