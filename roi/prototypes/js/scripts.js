
$(function () {
	$('[data-toggle="popover"]').popover();
});







    $("input[name='input-percentage']").TouchSpin({
        min: 0,
		step: 0.01,
		decimals: 2
    });






    $("input[name='input-numeric']").TouchSpin({
        min: 0,
		step: 1,
		max: 1000000000,
		maxboostedstep: 10000000
    });





$(function () {

    var active = true;

    $('#collapse-init').click(function () {
        if (active) {
            active = false;
            $('.collapse').collapse('show');
            $('.title').attr('data-toggle', 'collapse');
            $(this).text('Collapse all');
        } else {
            active = true;
            $('.collapse').collapse('hide');
            $('.title').attr('data-toggle', 'collapse');
            $(this).text('Expand all');
        }
    });
    
    $('#accordion').on('show.bs.collapse', function () {
        if (active) $('#accordion .in').collapse('hide');
    });

});





$('.select-all').click(function(){
    var $this = $(this);
    $this.toggleClass('select-all');
    if($this.hasClass('select-all')){
        $this.text('Include all');         
    } else {
        $this.text('Exclude all');
    }
});





$(document).ready(function() {
    $('#select-all').click(function(event) {  //on click 
        if(this.checked) { // check select status
            $('.checkbox-input').each(function() { //loop through each checkbox
                this.checked = true;  //select all checkboxes with class "checkbox1"               
            });
        }else{
            $('.checkbox-input').each(function() { //loop through each checkbox
                this.checked = false; //deselect all checkboxes with class "checkbox1"                       
            });         
        }
    });
});