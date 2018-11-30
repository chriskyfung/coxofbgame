$(document).ready(function() {
   var fpath = $('#file')[0].value;
   console.log(fpath)
   
   if (fpath) {
     readURL($('#file')[0]);
   } else{
     $('#blah').hide();
   }
 });

$('#file').change(function(){ 
   var fpath = $('#file')[0].value;
   console.log(fpath)
   readURL(this);
 });

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#blah').attr('src', e.target.result);
      $('#blah').show();
    }
    reader.readAsDataURL(input.files[0]);
  }
}