var all_blocks = new Array();

function add_to_all_blocks(shape) {
	for (block in shape.blocks)
		all_blocks.push(shape.blocks[block]);
}

function draw_all_blocks() {
	ctx.rect(0, 0, 300, 600);
	
	for (block in all_blocks)
		all_blocks[block].draw();
}

// ============== Point =======================

function Point (x, y) {
    this.x = x;
    this.y = y;    
}

// ============== Rectangle ===================

function Rectangle() {}

Rectangle.prototype.init = function(p1,p2) {
    this.px = p1.x;
    this.py = p1.y;
    this.width = p2.x - p1.x;
    this.height = p2.y - p1.y;
    this.lineWidth = 1;
    this.color = 'black';
}

Rectangle.prototype.draw = function() {
	ctx.fillStyle = this.color;
	ctx.lineWidth = this.lineWidth;
	ctx.strokeStyle = 'black';
	ctx.strokeRect(this.px, this.py, this.width, this.height);
	ctx.fillRect(this.px, this.py, this.width, this.height);
	
}

Rectangle.prototype.move = function(x,y){
    this.px += x;
    this.py += y;
    //this.draw();
}

Rectangle.prototype.erase = function() {
	ctx.beginPath();
	ctx.lineWidth = this.lineWidth + 2;
	ctx.strokeStyle = Tetris.BOARD_COLOR;
	ctx.rect(this.px, this.py, this.width, this.height);
	ctx.stroke();
	ctx.fillStyle = Tetris.BOARD_COLOR;
	ctx.fill()
}

Rectangle.prototype.setLineWidth = function(width) { this.lineWidth=width}
Rectangle.prototype.setFill = function(color) { this.color = color}

// ============== Block =======================

function Block (pos, color) {
	var punto1 = new Point(pos.x * Block.BLOCK_SIZE, pos.y * Block.BLOCK_SIZE);
    var punto2 = new Point(pos.x * Block.BLOCK_SIZE + Block.BLOCK_SIZE - Block.OUTLINE_WIDTH / 2, pos.y * Block.BLOCK_SIZE + Block.BLOCK_SIZE - Block.OUTLINE_WIDTH / 2);
    this.init(punto1, punto2);
    this.x = pos.x;
    this.y = pos.y;
    this.setFill(color);
    this.setLineWidth(Block.OUTLINE_WIDTH);
}

Block.prototype = new Rectangle();
Block.prototype.constructor = Block;

Block.prototype.can_move = function(board, dx, dy) {
    return board.can_move(this.x + dx, this.y + dy);
}

Block.prototype.move = function(dx, dy) {
    this.x += dx;
    this.y += dy;
    Rectangle.prototype.move.call(this, dx * Block.BLOCK_SIZE, dy * Block.BLOCK_SIZE);
}

Block.BLOCK_SIZE = 30;
Block.OUTLINE_WIDTH = 2;

// ============== Shape =======================

function Shape() {}

Shape.prototype.init = function(coords, color) {
    this.blocks = [];
    for (coord in coords) {
        this.blocks[coord] = new Block(coords[coord], color);
    }
    this.rotation_dir = 1;
    this.shift_rotation_dir = true;
    this.center_block = this.blocks[2];
};

Shape.prototype.draw = function() {
    for (block in this.blocks) { // block of this.blocks doesn't work on IE.
        this.blocks[block].draw();
    }
};

Shape.prototype.can_move = function(board, dx, dy) {
    for (block in this.blocks) {
		if (!this.blocks[block].can_move(board, dx, dy))
		    return false;
	}
	return true;
};

Shape.prototype.can_rotate = function(board) {
    var center = this.center_block;
	var dir = this.rotation_dir;
	for (block in this.blocks) {
        x = center.x - dir * center.y + dir * this.blocks[block].y;
        y = center.y + dir * center.x - dir * this.blocks[block].x;
		if (!board.can_move(x, y))
		    return false;
	}
	return true;
}

Shape.prototype.move = function(dx, dy) {
    for (block in this.blocks) {
        this.blocks[block].erase();
    }

    for (block in this.blocks) {
        this.blocks[block].move(dx, dy);
    }
}

Shape.prototype.rotate = function() {
	for (block in this.blocks)
        this.blocks[block].erase();
	
	var center = this.center_block;
	var dir = this.rotation_dir;
	
	for (block in this.blocks) {
        x = center.x - dir * center.y + dir * this.blocks[block].y;
        y = center.y + dir * center.x - dir * this.blocks[block].x;
        this.blocks[block].move(x - this.blocks[block].x, y - this.blocks[block].y);
    }
	
    if (this.shift_rotation_dir)
		this.rotation_dir *= -1;
}

Shape.prototype.getName = function() { // For IE, Object.constructor.name doesn't work.
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

// ============= I_Shape ================================

function I_Shape(center) {
     var coords = [new Point(center.x - 2, center.y),
               new Point(center.x - 1, center.y),
               new Point(center.x , center.y),
               new Point(center.x + 1, center.y)];
    
     Shape.prototype.init.call(this, coords, "blue");   

     this.shift_rotation_dir = true;
     this.center_block = this.blocks[2];
}

I_Shape.prototype = new Shape();
I_Shape.prototype.constructor = I_Shape;

// ============= J_Shape ================================

function J_Shape(center) {
    var coords = [new Point(center.x - 1, center.y),
               new Point(center.x, center.y),
               new Point(center.x + 1, center.y),
               new Point(center.x + 1, center.y + 1)];
    
    Shape.prototype.init.call(this, coords, "orange");
    
    this.shift_rotation_dir = false;
    this.center_block = this.blocks[1];
}

J_Shape.prototype = new Shape();
J_Shape.prototype.constructor = J_Shape;

// ============ L Shape ===========================

function L_Shape(center) {
    var coords = [new Point(center.x - 1, center.y),
               new Point(center.x, center.y),
               new Point(center.x + 1, center.y),
               new Point(center.x - 1, center.y + 1)];
    
    Shape.prototype.init.call(this, coords, "cyan");
    
    this.shift_rotation_dir = false;
    this.center_block = this.blocks[1];
}

L_Shape.prototype = new Shape();
L_Shape.prototype.constructor = L_Shape;

// ============ O Shape ===========================

function O_Shape(center) {
    var coords = [new Point(center.x - 1, center.y),
               new Point(center.x, center.y),
               new Point(center.x - 1, center.y + 1),
               new Point(center.x, center.y + 1)];
    
    Shape.prototype.init.call(this, coords, "red");
    
    this.shift_rotation_dir = true;
    this.center_block = this.blocks[1];
}

O_Shape.prototype = new Shape();
O_Shape.prototype.constructor = O_Shape;

O_Shape.prototype.can_rotate = function() {
	return false;
}

// ============ S Shape ===========================

function S_Shape(center) {
    var coords = [new Point(center.x, center.y),
               new Point(center.x + 1, center.y),
               new Point(center.x, center.y + 1),
               new Point(center.x - 1, center.y + 1)];
    
    Shape.prototype.init.call(this, coords, "green");
    
    this.shift_rotation_dir = true;
    this.center_block = this.blocks[0];
}

S_Shape.prototype = new Shape();
S_Shape.prototype.constructor = S_Shape;

// ============ T Shape ===========================

function T_Shape(center) {
    var coords = [new Point(center.x - 1, center.y),
               new Point(center.x, center.y),
               new Point(center.x + 1, center.y),
               new Point(center.x, center.y + 1)];
    
    Shape.prototype.init.call(this, coords, "yellow");
    
    this.shift_rotation_dir = false;
    this.center_block = this.blocks[1];
}

T_Shape.prototype = new Shape();
T_Shape.prototype.constructor = T_Shape;

// ============ Z Shape ===========================

function Z_Shape(center) {
    var coords = [new Point(center.x, center.y),
               new Point(center.x - 1, center.y),
               new Point(center.x, center.y + 1),
               new Point(center.x + 1, center.y + 1)];
    
    Shape.prototype.init.call(this, coords, "magenta");
    
    this.shift_rotation_dir = true;
    this.center_block = this.blocks[0];
}

Z_Shape.prototype = new Shape();
Z_Shape.prototype.constructor = Z_Shape;

// ====================== BOARD ================

function Board(width, height) {
    this.width = width;
    this.height = height;
    this.grid = {};
}

Board.prototype.add_shape = function(shape) {
	for (block in shape.blocks) {
        this.grid[shape.blocks[block].x + "," + shape.blocks[block].y] = shape.blocks[block];
    }
}

Board.prototype.draw_shape = function(shape){
	for (block in shape.blocks) {
		if (undefined != this.grid[shape.blocks[block].x + "," + shape.blocks[block].y])
			return false;
	}
	
	shape.draw();
	return true;
}

Board.prototype.can_move = function(x,y){
	if (x < this.width && x >= 0) {
        if (y < this.height && y >= 0) {
            if (undefined == this.grid[x + "," + y]) {
                return true;
            }
        }
	}
    return false;
}

Board.prototype.is_row_complete = function(y){
    for (var x = 0; x < 10; x++) {
        if (undefined == this.grid[x + "," + y])
            return false;
    }
    return true;
};

Board.prototype.move_down_rows = function(y_start){
    for (var y = y_start; y >= 0; y--) {
        var next_y = y + 1;
        for (var x = 0; x < 10; x++) {
			this.grid[x + "," + next_y] = this.grid[x + "," + y];
			if (undefined != this.grid[x + "," + y]) {
				this.grid[x + "," + y].erase();
				this.grid[x + "," + y].move(0, 1);
            }
			delete this.grid[x + "," + y];
        }
    }
};
 
Board.prototype.delete_row = function(y) {
    for (var x = 0; x < 10; x++) {
		if (undefined != this.grid[x + "," + y]) {
			block = this.grid[x + "," + y];
			this.grid[x + "," + y].erase();
			delete this.grid[x + "," + y];
			index = all_blocks.indexOf(block);
			all_blocks.splice(index, 1);
		}
    }
};

Board.prototype.remove_complete_rows = function(){
	var lines = 0;
    for (var y = 0; y < 20; y++) {
        if (this.is_row_complete(y)) {
            this.delete_row(y);
            this.move_down_rows(y - 1);
			lines++;
        }
    }
	return lines;
};

Board.prototype.game_over = function() {
	var over_background = new Image();
	over_background.src = 'images/game_over.png';
	over_background.onload = function(){
		ctx.drawImage(over_background, 0, 0);
	}
}

// ==================== Tetris ==========================

function Tetris() {
    this.board = new Board(Tetris.BOARD_WIDTH, Tetris.BOARD_HEIGHT);
    this.reloj;
	this.game_paused = false;
	this.game_muted = false;
	this.game_over = false;
	this.level = 1;
	this.total_lines = 0;
}

Tetris.prototype.init = function(){
    this.current_shape = this.create_new_shape();
	this.next_shape = this.create_new_shape();
	this.show_next_shape();
	
	add_to_all_blocks(this.current_shape);
	
	this.score = 0;
	
    this.board.draw_shape(this.current_shape);
	
    document.addEventListener("keydown", this.key_pressed.bind(this));
    
	this.animate_shape();
}

Tetris.SHAPES = [I_Shape, J_Shape, L_Shape, O_Shape, S_Shape, T_Shape, Z_Shape];
Tetris.DIRECTION = {'Left':[-1, 0], 'Right':[1, 0], 'Down':[0, 1]};
Tetris.BOARD_WIDTH = 10;
Tetris.BOARD_HEIGHT = 20;
Tetris.BOARD_COLOR = 'white';

Tetris.prototype.create_new_shape = function(){
    var point = new Point(Tetris.BOARD_WIDTH / 2, 0);
    var random = Math.floor(Math.random() * (Tetris.SHAPES.length));
    return new Tetris.SHAPES[random](point);
}

Tetris.prototype.do_rotate = function(){
    if (!this.game_paused && this.current_shape.can_rotate(this.board)) {
        this.current_shape.rotate();
		draw_all_blocks();
		this.play_sound(rotate_audio);
	}
}

Tetris.prototype.key_pressed = function(e) {
	if (!e) e = window.event;
	
	switch(e.keyCode) {
		case 32:
			// spacebar key pressed
			if (!this.game_over)
				while (this.do_move("Down"));
			break;
		case 37:
			// left key pressed
			if (!this.game_over)
				this.do_move("Left");
			break;
		case 38:
			// up key pressed
			if (!this.game_over)
				this.do_rotate();
			break;
		case 39:
			// right key pressed
			if (!this.game_over)
				this.do_move("Right");
			break;
		case 40:
			// down key pressed
			if (!this.game_over)
				this.do_move("Down");
			break;
		case 77:
			// M key pressed
			if (!this.game_paused && !this.game_over) {
				(this.game_muted) ? this.game_muted = false : this.game_muted = true;
				this.pause_resume_music();
			}
			break;
		case 109:
			// m key pressed
			if (!this.game_paused && !this.game_over) {
				(this.game_muted) ? this.game_muted = false : this.game_muted = true;
				this.pause_resume_music();
			}
		case 80:
			// P key pressed
			if (!this.game_over)
				this.pause_resume_game();
			break;
		case 112:
			// p key pressed
			if (!this.game_over)
				this.pause_resume_game();
			break;
	}
};

Tetris.prototype.do_move = function(direction){
    if (this.game_paused)
		return false;
	
    var x = Tetris.DIRECTION[direction][0];
    var y = Tetris.DIRECTION[direction][1];
    if (this.current_shape.can_move(this.board, x, y)) {
        this.current_shape.move(x, y);
		draw_all_blocks();
    } else {
        if (direction == "Down") {
			this.play_sound(falldown_audio);
            this.board.add_shape(this.current_shape);
			draw_all_blocks();
            var lines = this.board.remove_complete_rows();
			if (lines > 0) {
				this.play_sound(linekill_audio);
				this.score += (lines * 10 * this.level);
				this.total_lines += lines;
				this.show_score();
			}
			
			var new_level = Math.floor(this.total_lines / 10) + 1;
			if (new_level > this.level) {
				this.level = new_level;
				this.play_sound(levelup_audio);
				this.show_level();
			}
				
            this.current_shape = this.next_shape;
            if (!this.board.draw_shape(this.current_shape)) {
				this.board.game_over();
				this.update_record();
				clearInterval(this.reloj);
				delete this.current_shape;
				this.play_sound(gameover_audio);
				background_audio.pause();
				background_audio.currentTime = 0;
				this.game_over = true;
			} else {
				this.next_shape = this.create_new_shape();
				this.show_next_shape();
				add_to_all_blocks(this.current_shape);
				draw_all_blocks();
			}
        }
        return false;
    }
	
    return true;
};

Tetris.prototype.pause_resume_game = function() {
	this.play_sound(pause_audio);
	if (this.game_paused) {
		document.getElementById('pause').setAttribute('style','display: none');
		this.animate_shape();
		this.game_paused = false;
	} else {
		document.getElementById('pause').setAttribute('style','display: initial');
		clearInterval(this.reloj);
		this.game_paused = true;
	}
	this.pause_resume_music();
};

Tetris.prototype.animate_shape = function(timestamp) {
    var t = this;
	clearInterval(this.reloj);
    this.reloj = setInterval(function(){ t.do_move("Down"); }, 1000 / this.level);
};

Tetris.prototype.show_next_shape = function() {
	document.getElementById("shape").src = "images/" + this.next_shape.getName().substring(0, 7) + ".png";
};

Tetris.prototype.show_level = function() {
	document.getElementById('level').innerHTML = this.level;
	this.animate_shape();
};

Tetris.prototype.show_score = function() {
	var score = document.getElementById('score');
	score.innerHTML = this.score;
};

Tetris.prototype.update_record = function() {
	if (record < this.score) {
		localStorage.setItem("tetris_record", this.score);
		document.getElementById('record').innerHTML = this.score;
	}
};

Tetris.prototype.play_sound = function(sound) {
	if (!this.game_muted) {
		sound.play();
		sound.currentTime = 0;
	}
}

Tetris.prototype.pause_resume_music = function() {
	if (background_audio.paused) {
		if (!this.game_muted) {
			document.getElementById('mute').setAttribute('style','display: none');
			document.getElementById('sound').setAttribute('style','display: initial');
			background_audio.play();
			this.game_muted = false;
		}
	} else {
		document.getElementById('mute').setAttribute('style','display: initial');
		document.getElementById('sound').setAttribute('style','display: none');
		background_audio.pause();
	}	
}