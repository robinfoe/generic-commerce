
Schema = {
	entity : {
		cart : {
			construct : function(item){
				var self = this;
				self._id = WebUtil.getBlankIfEmpty(item,'_id');
				self.username = WebUtil.getBlankIfEmpty(item,'username');
				self.items = [];
				self.grandTotal = 0;
				return self;
			}
		},
		category : {
			construct : function(item){
				var self = this;
				self.name = WebUtil.getBlankIfEmpty(item,'name');
				self.seq = WebUtil.getBlankIfEmpty(item,'seq');
				self._id = WebUtil.getBlankIfEmpty(item,'_id');
				self.child = [];
				if(item && !item.child instanceof HTMLElement)
					self.child = item.child

				if(self._id && !self._id.hasOwnProperty('_str'))
					self._id._str = null;

				return self;
			}
		},

		product : {
			construct : function(item){
				var self = this;
				self.name = WebUtil.getBlankIfEmpty(item,'name');
				self.code = WebUtil.getBlankIfEmpty(item,'code');
				self.shortDescription = WebUtil.getBlankIfEmpty(item,'shortDescription');
				self._id = WebUtil.getBlankIfEmpty(item,'_id');
				self.stock = WebUtil.getZeroIfEmpty(item,'stock');
				//self.thumbImage = WebUtil.getZeroIfEmpty(item,'thumbImage');
				self.price = WebUtil.getZeroIfEmpty(item,'price');
				self.status = WebUtil.getBlankIfEmpty(item,'status');
				self.published = WebUtil.getBlankIfEmpty(item,'published');

				if(!self.published)
					self.published = 'N';

				self.tags = [];
				self.images=[];
				self.details = [];
				//console.log(item && (!item.tags instanceof HTMLElement));
				if(item && item.tags )
					self.tags = item.tags

				if(item && item.images)
					self.images = item.images;
				
				//console.log(self);
				return self;
			}
		},

		product_image : {
			construct : function(item){
				var self = this;
				self.path = WebUtil.getBlankIfEmpty(item,'path');
				//self.context = Meteor.settings.path.upload;
				self.splash = WebUtil.getBlankIfEmpty(item,'splash');
			}
		},


		product_info : {
			type : {
				DESCRIPTION : 'D',
				SPECS : 'S'
			},
			construct : function(item){
				var self = this;
				self._id = WebUtil.getBlankIfEmpty(item,'_id');
				self.productId = WebUtil.getBlankIfEmpty(item,'productId');
				self.type = WebUtil.getBlankIfEmpty(item,'type'); // could be Long descriptions, Specs, Info, shipping info , etc.
				self.text = WebUtil.getBlankIfEmpty(item,'text');
				self.label = (Schema.entity.product_info.type.DESCRIPTION == self.type) ? 'Description' : 'Specifications'
				//if(unescape){
				//	self.text = _.unescape(self.text);
				//	self.text = _.unescape(self.text);
				
				//}
					

				return self;
			},

			constructDescription : function(){
				return new Schema.entity.product_info.construct({_id : 0 , type:Schema.entity.product_info.type.DESCRIPTION});
			},

			constructSpecification : function(){
				return new Schema.entity.product_info.construct({_id : 1 ,type:Schema.entity.product_info.type.SPECS});
			}

		}

	}
};




