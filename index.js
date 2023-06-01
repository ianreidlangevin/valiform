/**
--------------------------------------------------------------------------
   @class FormValidation
   @author Ian Reid Langevin
   @classdesc - Lightweigt data-attribute based Form validation
--------------------------------------------------------------------------
*/

import { defaultValidators } from "./validators"

export class FormValidation {
   /**
   --------------------------------------------------------------------------
      @method constructor
      @params
      elem {string} - CSS selector - Wrapper of your menu
      options
         emptyValues - {array} - values in a input that you want to consider as empty
         formEndpoint {string} - endpoint if you want to submit to an external API
      validators {array} - [{ type {string}, regex {string} }]
   --------------------------------------------------------------------------
   */
   constructor (elem, options, validators) {
      const DEFAULT_OPTIONS = {
         emptyValues: [], // values from input that you want to considerate empty
         formEndpoint: ""
      }

      Object.assign(this, DEFAULT_OPTIONS, options)
      this.form = document.querySelector(elem)
      if (this.form) {
         this.inputsNodes = this.form.querySelectorAll("[data-valiform]")
         this.submitButton = this.form.querySelector("[data-valiform-submit]")
         this.validators = validators ? this._mergeValidators(validators, defaultValidators) : defaultValidators
      }
   }

   /**
   --------------------------------------------------------------------------
      @method init
      @desc main public method to execute by your instance
   --------------------------------------------------------------------------
   */
   init () {
      if (this.form) {
         // validate only the current field on change event
         this.inputsNodes.forEach(inputEl => {
            // the change and input events are used to show different validation status
            ["change", "blur"].forEach(event => {
               inputEl.addEventListener(event, () => this._handlerField(inputEl))
            })
         })
         // submit event - before submitting, check if all fields are validate
         if (this.submitButton) {
            this.submitButton.addEventListener("click", (event) => {
               event.preventDefault()
               const VALIDATION_STATUS = this._validateForm()
               if (VALIDATION_STATUS === true) {
                  this.submitButton.disabled = false
                  // if form endpoint is not empty, submit to API else, submit form as usual
                  this.formEndpoint !== "" ? this._submitToExternalApi() : this.form.submit()
               } else {
                  // validate each inputs and show errors
                  this.inputsNodes.forEach(inputEl => { this._handlerField(inputEl) })
               }
            })
         }
      }
   }

   /**
   --------------------------------------------------------------------------
      @method _handlerField
      @param  {HTMLElement} inputEl
   --------------------------------------------------------------------------
   */
   _handlerField (inputEl) {
      const STATUS = this._validateField(inputEl)
      this._toggleErrorsMessages(STATUS, inputEl)
      inputEl.setAttribute("data-valiform", STATUS)
   }

   /**
   --------------------------------------------------------------------------
      @method _mergeValidators
      @desc - Merge the instance validators with the default ones. The key type
      is used to find a match and override it if needed.
      @param  {array} customValidators
      @param  {array} defaultValidators
      *
      @return {array} validators
   --------------------------------------------------------------------------
   */

   _mergeValidators (customValidators, defaultValidators) {
      const VALIDATORS_MERGED = new Map(
         [...defaultValidators, ...customValidators].map(validator => [validator.type, validator])
      )
      return Array.from(VALIDATORS_MERGED.values())
   }

   /**
   --------------------------------------------------------------------------
      @method _toggleErrorsMessages
      @param  {string} status
      @param  {HTMLElement} inputEl
   --------------------------------------------------------------------------
   */
   _toggleErrorsMessages (status, inputEl) {
      const MSG_DIV = this.form.querySelector(`[data-valiform-msg="${inputEl.name}"]`)
      if (MSG_DIV) {
         if (status === "success") {
            MSG_DIV.style.display = "none"
         } else {
            MSG_DIV.textContent = inputEl.getAttribute(`data-valiform-msg-${status}`)
            MSG_DIV.style.display = "block"
         }
      }
   }

   /**
   --------------------------------------------------------------------------
      @method _validateField
      @param  {HTMLElement} inputEl
      *
      @return {string}
   --------------------------------------------------------------------------
   */
   _validateField (inputEl) {
      // field.offsetParent is use to validate item that has display none fields (or it parent)
      // usefull for conditionnal field
      if (inputEl.offsetParent === null) return "success"
      // if input is a checkbox or radio
      if (["checkbox", "radio"].includes(inputEl.type)) {
         const CHECKED_OPTION = this.form.querySelectorAll(`input[name="${inputEl.name}"]:checked`)
         return (!CHECKED_OPTION.length) ? "required" : "success"
      }
      // Values
      const INPUT_VALUE = inputEl.value.trim() // remove whitespace at beginning and end
      const FIELD_IS_EMPTY = (INPUT_VALUE.length < 1 || this.emptyValues.includes(INPUT_VALUE))

      // 1. Validate required property
      if (FIELD_IS_EMPTY) {
         return (inputEl.required) ? "required" : "success"
      }
      // 2. Validate the length and return length if fail not on input to avoid typing error
      const MIN_LENGTH = inputEl.getAttribute("minlength")
      const MAX_LENGTH = inputEl.getAttribute("maxlength")
      if (MIN_LENGTH && INPUT_VALUE.length < MIN_LENGTH) return "length"
      if (MAX_LENGTH && INPUT_VALUE.length > MAX_LENGTH) return "length"

      // 4. Validate the format
      if (inputEl.hasAttribute("data-valiform-regex")) {
         // get the right regex for the field format
         const REGEX_MATCH = this.validators.find(element => element.type === inputEl.getAttribute("data-valiform-regex"))
         if (!REGEX_MATCH) {
            // first check if the format exist in the regex validators js file, return with error if not
            console.error("The data-valiform-regex specified in your HTML is not find in validators.js list.")
            return
         } else if (!REGEX_MATCH.regex.test(INPUT_VALUE)) {
            return "failed"
         }
      }
      // field has pass through all validations
      return "success"
   }

   /**
   --------------------------------------------------------------------------
      @method _validateForm
      *
      @returns {boolean}
   --------------------------------------------------------------------------
   */
   _validateForm () {
      this.inputsNodes.forEach(inputEl => this._handlerField(inputEl))
      const ALL_FIELDS_ARE_VALIDATE = Array.from(this.inputsNodes).every(item => item.getAttribute("data-valiform") === "success")
      return ALL_FIELDS_ARE_VALIDATE
   }

   /**
   --------------------------------------------------------------------------
      @method _submitToExternalApi
      @note - The method used to send form data to an external API
   --------------------------------------------------------------------------
   */
   async _submitToExternalApi () {
      const FORM_DATA_VALUES = new FormData(this.form)
      this.form.setAttribute("data-valiform-submit", "sending")

      try {
         const response = await fetch(this.formEndpoint, {
            method: "POST",
            headers: {
               Accept: "application/json"
            },
            body: FORM_DATA_VALUES
         })

         if (response.ok) {
            this.form.setAttribute("data-valiform-submit", "success")
         } else {
            console.log("Looks like there was a problem. Status Code: " + response.status)
            this.form.setAttribute("data-valiform-submit", "failed")
         }
      } catch (error) {
         console.log(error)
         this.form.setAttribute("data-valiform-submit", "failed")
      }

      this.submitButton.disabled = true // avoid resubmit
   }
}
