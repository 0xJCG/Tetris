var all_blocks2 = new Array();

function add_to_all_blocks2(shape) {
	for (block in shape.blocks)
		all_blocks2.push(shape.blocks[block]);
}

function draw_all_blocks2() {
	if (!game2.game_over) {
		ctx2.rect(0, 0, 300, 600);
		for (block in all_blocks2)
			all_blocks2[block].draw();
	}
}

// ============== Point =======================

function Point2(x, y) {
    this.x = x;
    this.y = y;    
}

// ============== Rectangle ===================

function Rectangle2() {}

Rectangle2.prototype.init = function(p1,p2) {
    this.px = p1.x;
    this.py = p1.y;
    this.width = p2.x - p1.x;
    this.height = p2.y - p1.y;
    this.lineWidth= 1;
    this.color = 'black';
}

Rectangle2.prototype.draw = function() {
	ctx2.fillStyle = this.color;
	ctx2.lineWidth = this.lineWidth;
	ctx2.strokeStyle = 'black';
	ctx2.strokeRect(this.px, this.py, this.width, this.height);
	ctx2.fillRect(this.px, this.py, this.width, this.height);
	
}

Rectangle2.prototype.move = function(x,y){
    this.px += x;
    this.py += y;
    //this.draw();
}

Rectangle2.prototype.erase = function() {
	ctx2.beginPath();
	ctx2.lineWidth = this.lineWidth + 2;
	ctx2.strokeStyle = Tetris2.BOARD_COLOR;
	ctx2.rect(this.px, this.py, this.width, this.height);
	ctx2.stroke();
	ctx2.fillStyle = Tetris2.BOARD_COLOR;
	ctx2.fill()
}

Rectangle2.prototype.setLineWidth = function(width) { this.lineWidth=width}
Rectangle2.prototype.setFill = function(color) { this.color = color}

// ============== Block =======================

function Block2 (pos, color) {
	var punto1 = new Point2(pos.x * Block2.BLOCK_SIZE, pos.y * Block2.BLOCK_SIZE);
    var punto2 = new Point2(pos.x * Block2.BLOCK_SIZE + Block2.BLOCK_SIZE - Block2.OUTLINE_WIDTH / 2, pos.y * Block2.BLOCK_SIZE + Block2.BLOCK_SIZE - Block2.OUTLINE_WIDTH / 2);
    this.init(punto1, punto2);
    this.x = pos.x;
    this.y = pos.y;
    this.setFill(color);
    this.setLineWidth(Block2.OUTLINE_WIDTH);
}

Block2.prototype = new Rectangle2();
Block2.prototype.constructor = Block2;

Block2.prototype.can_move = function(board, dx, dy) {
    return board.can_move(this.x + dx, this.y + dy);
}

Block2.prototype.move = function(dx, dy) {
    this.x += dx;
    this.y += dy;
    Rectangle2.prototype.move.call(this, dx * Block2.BLOCK_SIZE, dy * Block2.BLOCK_SIZE);
}

Block2.BLOCK_SIZE = 30;
Block2.OUTLINE_WIDTH = 2;

// ============== Shape =======================

function Shape2() {}

Shape2.prototype.init = function(coords, color) {
    this.blocks = [];
    for (coord in coords) {
        this.blocks[coord] = new Block2(coords[coord], color);
    }
    this.rotation_dir = 1;
    this.shift_rotation_dir = true;
    this.center_block = this.blocks[2];
};

Shape2.prototype.draw = function() {
    for (block in this.blocks) { // block of this.blocks doesn't work on IE.
        this.blocks[block].draw();
    }
};

Shape2.prototype.can_move = function(board, dx, dy) {
    for (block in this.blocks) {
		if (!this.blocks[block].can_move(board, dx, dy))
		    return false;
	}
	return true;
};

Shape2.prototype.can_rotate = function(board) {
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

Shape2.prototype.move = function(dx, dy) {
    for (block in this.blocks) {
        this.blocks[block].erase();
    }

    for (block in this.blocks) {
        this.blocks[block].move(dx, dy);
    }
}

Shape2.prototype.rotate = function() {
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

Shape2.prototype.getName = function() { // For IE, Object.constructor.name doesn't work.
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

// ============= I_Shape ================================

function I_Shape2(center) {
     var coords = [new Point2(center.x - 2, center.y),
               new Point2(center.x - 1, center.y),
               new Point2(center.x , center.y),
               new Point2(center.x + 1, center.y)];
    
     Shape2.prototype.init.call(this, coords, "blue");   

     this.shift_rotation_dir = true;
     this.center_block = this.blocks[2];
}

I_Shape2.prototype = new Shape2();
I_Shape2.prototype.constructor = I_Shape2;

// ============= J_Shape ================================

function J_Shape2(center) {
    var coords = [new Point2(center.x - 1, center.y),
               new Point2(center.x, center.y),
               new Point2(center.x + 1, center.y),
               new Point2(center.x + 1, center.y + 1)];
    
    Shape2.prototype.init.call(this, coords, "orange");
    
    this.shift_rotation_dir = false;
    this.center_block = this.blocks[1];
}

J_Shape2.prototype = new Shape2();
J_Shape2.prototype.constructor = J_Shape2;

// ============ L Shape ===========================

function L_Shape2(center) {
    var coords = [new Point2(center.x - 1, center.y),
               new Point2(center.x, center.y),
               new Point2(center.x + 1, center.y),
               new Point2(center.x - 1, center.y + 1)];
    
    Shape2.prototype.init.call(this, coords, "cyan");
    
    this.shift_rotation_dir = false;
    this.center_block = this.blocks[1];
}

L_Shape2.prototype = new Shape2();
L_Shape2.prototype.constructor = L_Shape2;

// ============ O Shape ===========================

function O_Shape2(center) {
    var coords = [new Point2(center.x - 1, center.y),
               new Point2(center.x, center.y),
               new Point2(center.x - 1, center.y + 1),
               new Point2(center.x, center.y + 1)];
    
    Shape2.prototype.init.call(this, coords, "red");
    
    this.shift_rotation_dir = true;
    this.center_block = this.blocks[1];
}

O_Shape2.prototype = new Shape2();
O_Shape2.prototype.constructor = O_Shape2;

O_Shape2.prototype.can_rotate = function() {
	return false;
}

// ============ S Shape ===========================

function S_Shape2(center) {
    var coords = [new Point2(center.x, center.y),
               new Point2(center.x + 1, center.y),
               new Point2(center.x, center.y + 1),
               new Point2(center.x - 1, center.y + 1)];
    
    Shape2.prototype.init.call(this, coords, "green");
    
    this.shift_rotation_dir = true;
    this.center_block = this.blocks[0];
}

S_Shape2.prototype = new Shape2();
S_Shape2.prototype.constructor = S_Shape2;

// ============ T Shape ===========================

function T_Shape2(center) {
    var coords = [new Point2(center.x - 1, center.y),
               new Point2(center.x, center.y),
               new Point2(center.x + 1, center.y),
               new Point2(center.x, center.y + 1)];
    
    Shape2.prototype.init.call(this, coords, "yellow");
    
    this.shift_rotation_dir = false;
    this.center_block = this.blocks[1];
}

T_Shape2.prototype = new Shape2();
T_Shape2.prototype.constructor = T_Shape2;

// ============ Z Shape ===========================

function Z_Shape2(center) {
    var coords = [new Point2(center.x, center.y),
               new Point2(center.x - 1, center.y),
               new Point2(center.x, center.y + 1),
               new Point2(center.x + 1, center.y + 1)];
    
    Shape2.prototype.init.call(this, coords, "magenta");
    
    this.shift_rotation_dir = true;
    this.center_block = this.blocks[0];
}

Z_Shape2.prototype = new Shape2();
Z_Shape2.prototype.constructor = Z_Shape2;

// ====================== BOARD ================

function Board2(width, height) {
    this.width = width;
    this.height = height;
    this.grid = {};
}

Board2.prototype.add_shape = function(shape) {
	for (block in shape.blocks) {
        this.grid[shape.blocks[block].x + "," + shape.blocks[block].y] = shape.blocks[block];
    }
}

Board2.prototype.draw_shape = function(shape){
	for (block in shape.blocks) {
		if (undefined != this.grid[shape.blocks[block].x + "," + shape.blocks[block].y])
			return false;
	}
	shape.draw();
	return true;
}

Board2.prototype.can_move = function(x,y){
	if (x < this.width && x >= 0) {
        if (y < this.height && y >= 0) {
            if (undefined == this.grid[x + "," + y]) {
                return true;
            }
        }
	}
    return false;
}

Board2.prototype.is_row_complete = function(y){
    for (var x = 0; x < 10; x++) {
        if (undefined == this.grid[x + "," + y])
            return false;
    }
    return true;
};

Board2.prototype.move_down_rows = function(y_start){
    for (var y = y_start; y >= 0; y--) {
        var next_y = y + 1;
        for (var x = 0; x < 10; x++) {
			this.grid[x + "," + next_y] = this.grid[x + "," + y];
			if (undefined != this.grid[x + "," + y]) {
				this.grid[x + "," + y].erase();
				this.grid[x + "," + y].move(0, 1)
            }
			delete this.grid[x + "," + y];
        }
    }
};
 
Board2.prototype.delete_row = function(y) {
    for (var x = 0; x < 10; x++) {
		if (undefined != this.grid[x + "," + y]) {
			this.grid[x + "," + y].erase();
			delete this.grid[x + "," + y];
			index = all_blocks2.indexOf(block);
			all_blocks2.splice(index, 1);
		}
    }
};

Board2.prototype.remove_complete_rows = function(){
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

Board2.prototype.game_over = function() {
	var over_background = new Image();
	over_background.src = 'images/game_over.png';
	over_background.onload = function(){
		ctx2.drawImage(over_background, 0, 0);
	}
}

// ==================== Tetris ==========================

function Tetris2() {
    this.board = new Board2(Tetris2.BOARD_WIDTH, Tetris2.BOARD_HEIGHT);
    this.reloj;
	this.game_paused = false;
	this.game_muted = false;
	this.game_over = false;
	this.level = 1;
	this.total_lines = 0;
}

Tetris2.SHAPES = [I_Shape2, J_Shape2, L_Shape2, O_Shape2, S_Shape2, T_Shape2, Z_Shape2];
Tetris2.DIRECTION = {'Left':[-1, 0], 'Right':[1, 0], 'Down':[0, 1]};
Tetris2.BOARD_WIDTH = 10;
Tetris2.BOARD_HEIGHT = 20;
Tetris2.BOARD_COLOR='white';

Tetris2.prototype.create_new_shape = function(){
    var point = new Point2(Tetris2.BOARD_WIDTH / 2, 0);
    var random = Math.floor(Math.random() * (Tetris2.SHAPES.length));
    return new Tetris2.SHAPES[random](point);
}

Tetris2.prototype.do_rotate = function(){
    if (!this.game_paused && this.current_shape.can_rotate(this.board)) {
		this.play_sound(rotate_audio);
		this.current_shape.rotate();
		draw_all_blocks2();
	}
}

Tetris2.prototype.init = function(){
    this.current_shape = this.create_new_shape();
	this.next_shape = this.create_new_shape();
	this.show_next_shape();
	
	add_to_all_blocks2(this.current_shape);
  
	this.score = 0;
	
    this.board.draw_shape(this.current_shape);
	
    document.addEventListener("keydown", this.key_pressed.bind(this));
    
	this.animate_shape();
}

Tetris2.prototype.key_pressed = function(e) {
	if (!e) e = window.event;
	
	switch(e.keyCode) {
		case 107:
			// + key pressed
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
			if (!this.game_paused)
				(this.game_muted) ? this.game_muted = false : this.game_muted = true;
			break;
		case 109:
			// m key pressed
			if (!this.game_paused)
				(this.game_muted) ? this.game_muted = false : this.game_muted = true;
			break;
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

Tetris2.prototype.do_move = function(direction){
    if (this.game_paused)
		return false;
	
    var x = Tetris.DIRECTION[direction][0];
    var y = Tetris.DIRECTION[direction][1];
    if (this.current_shape.can_move(this.board, x, y)) {
        this.current_shape.move(x, y);
		draw_all_blocks2();
    } else {
        if (direction == "Down") {
            this.play_sound(falldown_audio);
			this.board.add_shape(this.current_shape);
			draw_all_blocks2();
            var lines = this.board.remove_complete_rows();
			if (lines > 0) {
				this.score += (lines * 10 * this.level);
				this.total_lines += lines;
				this.show_score();
			}
			
			var new_level = Math.floor(this.total_lines / 10) + 1;
			if (new_level > this.level) {
				this.level = new_level;
				this.show_level();
			}
				
            this.current_shape = this.next_shape;
            if (!this.board.draw_shape(this.current_shape)) {
				this.update_record();
				clearInterval(this.reloj);
				delete this.current_shape;
				this.play_sound(gameover_audio);
				this.game_over = true;
				if (this.game_over && game1.game_over) { // Only stopping the music if both players have lost.
					background_audio.pause();
					background_audio.currentTime = 0;
				}
				this.board.game_over();
			} else {
				this.next_shape = this.create_new_shape();
				this.show_next_shape();
				add_to_all_blocks2(this.current_shape);
				draw_all_blocks2();
			}
        }
        return false;
    }
    return true;
};

Tetris2.prototype.pause_resume_game = function() {
	this.play_sound(pause_audio);
	if (this.game_paused) {
		document.getElementById('pause2').setAttribute('style','display: none');
		
		this.animate_shape();
		this.game_paused = false;
	} else {
		document.getElementById('pause2').setAttribute('style','display: initial');
		clearInterval(this.reloj);
		this.game_paused = true;
	}
};

Tetris2.prototype.animate_shape = function(timestamp) {
    var t = this;
	clearInterval(this.reloj);
    this.reloj = setInterval(function(){ t.do_move("Down"); }, 1000 / this.level);
};

Tetris2.prototype.show_next_shape = function() {
	document.getElementById("shape2").src = "images/" + this.next_shape.getName().slice(0, -1) + ".png";
};

Tetris2.prototype.show_level = function() {
	document.getElementById('level2').innerHTML = this.level;
	this.animate_shape();
};

Tetris2.prototype.show_score = function() {
	var score = document.getElementById('score2');
	score.innerHTML = this.score;
};

Tetris2.prototype.update_record = function() {
	if (record < this.score) {
		localStorage.setItem("tetris_record", this.score);
		document.getElementById('record2').innerHTML = this.score;
	}
};

Tetris2.prototype.play_sound = function(sound) {
	if (!this.game_muted) {
		sound.play();
		sound.currentTime = 0;
	}
}