var DatatablesSearchOptionsAdvancedSearch = function () {
  return {
    init: function () {
      $("#m_datepicker").datepicker({
        // format: "yyyy-mm-dd",
        format: "yyyy-mm-dd",
        todayHighlight: !0,
        templates: {
          leftArrow: '<i class="la la-angle-left"></i>',
          rightArrow: '<i class="la la-angle-right"></i>'
        }
      })
    }
  }
}();
jQuery(document).ready(function () {
  DatatablesSearchOptionsAdvancedSearch.init()
});