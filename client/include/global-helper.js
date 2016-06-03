Template.registerHelper("helper_generatePagination", function(countName) {

	// TODO :: work on pagination... 

	var paginationEL = [];

	var currentUrl = WebUtil.getCurrentRoute();
	currentUrl = currentUrl.substring(0, currentUrl.length -2);

	var currentPage = WebUtil.getCurrentParams().pageNo;
	var totalRecord = Counts.get(countName);

	// 1. translate total record to page
	var totalPage =  Math.ceil(totalRecord / WebUtil.CONSTANT.PAGINATION.RECORD_LIMIT);
	var showDot = true;


	// 2. construct the pagination... 
	for(var i =1; i <= totalPage ; i++){
		if(i == 1 
			|| i == totalPage 
			|| (i >= (currentPage - WebUtil.CONSTANT.PAGINATION.PAGE_LIMIT) 
				&& i <= (currentPage + WebUtil.CONSTANT.PAGINATION.PAGE_LIMIT) ) ){

			showDot = true;
			var style = '';
			if(currentPage == i)
				style='class="active"';


			var pageLink = '<li '+style+' ><a href="'+currentUrl+'/'+i+'">'+i+'</a></li>';
			paginationEL.push(pageLink);

		}else{
			if(!showDot)
				continue;

			showDot = false;
			paginationEL.push('<li class="disabled" ><a>...</a></li>');
		}
	}

	var element = '<ul class="pagination catalogue-pagination">' + paginationEL.join('') + '</ul>';
	element = '<div class="text-center">' + element + '</div>';

	return Spacebars.SafeString(element);
});




Template.registerHelper("helper_extractSplashImage", function(item) {
	return WebUtil.extractSplashImage(item);
	/*
	var url = '';
    if(!item.images)
        return url;

    var url;
    var image = _.find(item.images,function(image){
        return (image.splash =='Y');
    });

    return (image) ? image.path : (item.images && item.images.length > 0) ?  item.images[0].path : 'no image';

	*/
});



Template.registerHelper("helper_outputHtml", function(text) {
	return Spacebars.SafeString(_.unescape(text));
});

Template.registerHelper("helper_firstIndex", function(count) {
	return count == 0;
});

Template.registerHelper("helper_setActiveStyle", function(count) {
	return (count == 0) ? Spacebars.SafeString('active') : '';
});





Template.registerHelper("helper_getCart", function() {
	var cartReactive = Carts.findOne({});
	var cart = {items : [], totalPrice : 0, totalItem : 0};
	if(cartReactive)
		cart.items = cartReactive.items;

	_.each(cart.items, function(item){
		cart.totalPrice += item.totalPrice;
		cart.totalItem += item.quantity;
	});

	return cart;
});


Template.registerHelper("helper_isWebAdmin", function() {
	return SecurityUtil.role.isWebAdmin();
});




