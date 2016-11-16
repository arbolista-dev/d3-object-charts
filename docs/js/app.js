$(document).ready(function () {
  $('body').scrollspy({ target: '#navbar', offset: 100});
  $('.collapse').on('show.bs.collapse', function () {
    $(this).siblings().collapse('hide');
  })
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
});
