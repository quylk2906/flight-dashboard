var DatatablesSearchOptionsAdvancedSearch = function () {
  return {
    init: function () {
      $("#m_datepicker").datepicker({
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