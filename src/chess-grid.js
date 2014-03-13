define([
	
    'backbone'
	
], function() {
	
	var Grid = Backbone.View.extend({
		
		elms: {
			item: '.chess-grid-item',
			image: '.chess-grid-image'
		},
		
		options: {},
		
		matrix: [],
		matrixRowLimit: 0,
		
		initialize: function(){
			var self = this;
			
			self.parseOptions();

			if (! self.options.columns) self.options.columns = 2;
			if (! self.options.margin) self.options.margin = 0;
			
			// Render grid
			self.renderGrid();

            if (true == ('onorientationchange' in window)) {
                $(window).on('orientationchange.chess-grid', function() {
					self.resizeGrid();               
                }).trigger('orientationchange.chess-grid');
            }            
            else {
                $(window).on('resize.chess-grid', function() {
					self.resizeGrid();             
                }).trigger('resize.chess-grid');   
            }			
		},
		
		parseOptions: function() {
			var self = this;
			var data = this.$el.data() || {};
			
			$.each(data, function(name, value) {
				if (data.hasOwnProperty(name)) {
					self.options[name] = value;
				}
			});
			return this;
		},		
		
		renderGrid: function() {
			var self = this;
			var widthItem = Math.round((self.$el.width() - (self.options.columns * 2 - 1) * self.options.margin) / self.options.columns / 2);
			
			// Init matrix
			self.addRowToMartix();
			// Calculate matrix
			self.$el.find(self.elms.item).each(function() {
				var sw = sh = 0;
				var type = $(this).data('type');
				var index = $(this).index() + 1;
				var result = {};

				switch (type) {
					case '2x1':
						sw = 2;
						sh = 1;		
						break;
					case '2x2':
						sw = sh = 2;
						break;	
					case 'nx2':
						sw = self.options.columns * 2;
						sh = 2;						
						break;												
				}	

			 	result = self.findPlaceInMatrix(sw, sh, index);	
				$(this).data({'top':result.top,'left':result.left});

				if (type == 'nx2') {
					self.matrixRowLimit = result.top + 2;
				}
			});

			if (self.options.textPosition == 'auto') {
				var flag = true;
				var top = 0;
				// Auto text position
				self.$el.find(self.elms.item).each(function() {
					if ($(this).is('.text-hover') == false) {
						$(this).removeClass('text-left text-right');
						var itemTop = $(this).data('top');
						
						if (itemTop != top) {
							flag = !flag;
							top = itemTop;
						}
						
						if (flag == true)
							$(this).addClass('text-left');
						else
							$(this).addClass('text-right');
					}
				});	
			}
		},
		
		// Add new row to matrix
		addRowToMartix: function() {
			this.matrix.push([]);
			var j = this.matrix.length - 1;
			for (i = 0; i < this.options.columns * 2; i++) {
				this.matrix[j][i] = 0;
			}		
		},
		
		// Find place for item in matrix
		findPlaceInMatrix: function(w, h, index) {
			var flag = false;
			var result = {top: 0, left: 0};

			for (j = this.matrixRowLimit; j < this.matrix.length; j++) {
				var i = _.indexOf(this.matrix[j], 0);							
				if (i != -1 && (i + w) <= this.options.columns * 2 &&  _.max(this.matrix[j].slice(i, i + w)) == 0) {
					for (k = 0; k < w; k ++) {
						for (l = 0; l < h; l++) {
							if (! this.matrix[j + l]) {
								this.addRowToMartix();
							}		
							this.matrix[j + l][i + k] = index;
							result = {top: j, left: i}
						}
					}
					flag = true;
					break;
				}
			} 
			if (flag == false) {
				i = 0;
				j = this.matrix.length;
				for (k = 0; k < w; k ++) {
					for (l = 0; l < h; l++) {
						if (! this.matrix[j + l]) {
							this.addRowToMartix();
						}		
						this.matrix[j + l][i + k] = index;
						result = {top: j, left: i}
					}
				}			
			}
			
			return result;
		},
		
		resizeGrid: function() {
			var self = this;
			var widthItem = Math.round((self.$el.width() - (self.options.columns * 2 - 1) * self.options.margin) / self.options.columns / 2);
			
			self.$el.find(self.elms.item).each(function() {
				var type = $(this).data('type');
				var rate = $(this).data('rate') || 1;
				
				var w = h = 0;
				
				switch (type) {
					case '2x1':
						w = widthItem * 2 + self.options.margin;
						h = widthItem;
						break;
					case '2x2':
						w = h = widthItem * 2 + self.options.margin;	
						break;	
					case 'nx2':
						w = '100%';
						h = widthItem * 2 + self.options.margin;	
						break;												
				}
				$(this).width(w).height(h).css({
					top: $(this).data('top') * (widthItem + self.options.margin), 
					left: $(this).data('left') * (widthItem + self.options.margin)
				});
				
				if ($(this).is('.text-left')) {
					var w = '50%';
					if (rate != 2) {
						w = widthItem;
					}					
					$(this).find('.chess-grid-text').width(w);
					$(this).find('.chess-grid-image').css('marginLeft', w);
				}
				
				if ($(this).is('.text-right')) {
					var w = '50%';
					if (rate != 2) {
						w = (widthItem * 2 + self.options.margin - widthItem) * rate;
					}	
					$(this).find('.chess-grid-text').width(w);
					$(this).find('.chess-grid-image').css('marginRight', w);
				}			
			});		
		},
		
		render: function() {
			return this;
		}
		
	});
	
	return Grid;
});
