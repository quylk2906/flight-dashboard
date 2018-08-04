var Inputmask = {
   init: function() {
           $("#m_inputmask_7").inputmask("numeric", {
               numericInput: !0,
               radixPoint: ".",
               groupSeparator: ".",
               digits: 0,
               autoGroup: true,
               rightAlign: false
           })
   }
};
jQuery(document).ready(function() {
   Inputmask.init()
});