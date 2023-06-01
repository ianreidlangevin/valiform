export const defaultValidators = [
   {
      type: "tel",
      regex: /^[+]?[(]?[0-9]{3}[)]?[-s. ]?[0-9]{3}[-s. ]?[0-9]{4,6}$/im
   },
   {
      type: "email",
      regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]*.[a-z]\.([a-z]+)(\/?)?$/
   },
   {
      type: "postal-code",
      regex: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s?[-]?\d[ABCEGHJ-NPRSTV-Z]\d$/i
   },
   {
      type: "alpha",
      regex: /^[a-zA-Z]+$/
   },
   {
      type: "text",
      regex: /^[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s?'`'-]+$/
   },
   {
      type: "numeric",
      regex: /^[ 0-9]+$/
   },
   {
      type: "alphanumeric",
      regex: /^[ 0-9a-zA-Z]+$/
   },
   {
      type: "alphanumeric-extended",
      regex: /^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'-]+$/
   },
   {
      type: "address",
      regex: /^(([A-Z])*(\d+)([A-Z])*)(-|\/|&)*(([A-Z])*(\d+)([A-Z])*)*((\/)*(([A-Z])*(\d+)([A-Z])*))*/
   },
   {
      type: "url",
      regex: /^(http:\/\/|https:\/\/)?(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{3}\.([a-z]+)(\/?)?$/
   }
]
