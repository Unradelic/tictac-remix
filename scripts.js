function initializeGame() {
	let board = generate_board();
	game.appendChild(board);
	game.setAttribute("turn", "X");
}

function generate_board() {
	let board = document.createElement("div");
	board.classList.add("board");
	
	// Generate a board 3x3, each cell is a sub-board of 3x3
	for (let i = 0; i < 3; i++) {
		let row = document.createElement("div");
		row.classList.add("row");
		for (let j = 0; j < 3; j++) {
			let board_coord = i + "," + j;
			let cell = genertate_sub_board(board_coord);
			row.appendChild(cell);
		}
		board.appendChild(row);
	}
	return board;
}

function genertate_sub_board(board_coord) {
	let sub_board = document.createElement("div");
	sub_board.classList.add("sub-board");
	sub_board.setAttribute("coord", board_coord);
	
	// Generate a sub-board of 3x3
	for (let i = 0; i < 3; i++) {
		let row = document.createElement("div");
		row.classList.add("row");
		for (let j = 0; j < 3; j++) {
			let cell = document.createElement("div");
			cell.classList.add("cell");
			cell.classList.add("empty");
			cell.setAttribute("coord", i + "," + j);
			cell.setAttribute("onclick", "cell_clicked(this)");
			row.appendChild(cell);
		}
		sub_board.appendChild(row);
	}
	sub_board_selector = document.createElement("div");
	sub_board_selector.classList.add("sub-board-selector");
	sub_board_selector.setAttribute("onclick", "board_clicked(this)");
	sub_board.appendChild(sub_board_selector);
	return sub_board;
}

function cell_clicked(cell) {
	let sub_board = cell.parentNode.parentNode;
	let board = sub_board.parentNode.parentNode;
	if (sub_board.classList.contains("X") || sub_board.classList.contains("O") || cell.classList.contains("X") || cell.classList.contains("O")) {
		return;
	}
	let gameTurn = game.getAttribute("turn");
	if (cell.classList.contains("empty")) {
		cell.classList.remove("empty");
		cell.classList.add(gameTurn);
	}
	let sub_board_winner = get_board_winner(sub_board);
	if (sub_board_winner[0]) {
		sub_board.classList.add(sub_board_winner[0]);
		sub_board.classList.add(sub_board_winner[1]);
	}
	let sub_board_target = cell.getAttribute("coord");
	let sub_board_target_element = board.querySelector(".sub-board[coord='" + sub_board_target + "']");
	
	if (sub_board_target_element.classList.contains("X") || sub_board_target_element.classList.contains("O")) {
		let sub_boards = game.querySelectorAll(".sub-board");
		for (let i = 0; i < sub_boards.length; i++) {
			sub_boards[i].classList.remove("unplayable");
			sub_boards[i].classList.remove("playable");
		}
		let winner = sub_board_target_element.classList.contains("X") ? "X" : "O";
		let opponent = gameTurn == "X" ? "O" : "X"
		if (winner == opponent) {
			document.getElementById("game-turn").innerHTML = 'Wildcard for ' + winner + '!<span class="small-info">You break free! Choose any cell to play your next move!</span>';
			let current_turn = gameTurn == "X" ? "O" : "X"
			game.setAttribute("turn", current_turn);
		}
		else {
			let sub_board_selectors = board.querySelectorAll(".sub-board:not(.X):not(.O) .sub-board-selector");
			for (let i = 0; i < sub_board_selectors.length; i++) {
				sub_board_selectors[i].classList.add("selectable");
			}
			document.getElementById("game-turn").innerHTML = 'Decision for ' + winner + '!<span class="small-info">Where should ' + opponent + " play its move?!</span>";
		}
	}
	else {
		let sub_boards = game.querySelectorAll(".sub-board");
		for (let i = 0; i < sub_boards.length; i++) {
			sub_boards[i].classList.remove("playable");
			sub_boards[i].classList.add("unplayable");
		}
		sub_board_target_element.classList.remove("unplayable");
		sub_board_target_element.classList.add("playable");
		
		let current_turn = gameTurn == "X" ? "O" : "X"
		game.setAttribute("turn", current_turn);
		document.getElementById("game-turn").innerHTML = current_turn + "'s turn!";
	}
}

function board_clicked(sub_board_selector) {
	let board = sub_board_selector.parentNode.parentNode.parentNode;
	let gameTurn = game.getAttribute("turn");
	let sub_boards = game.querySelectorAll(".sub-board");
	for (let i = 0; i < sub_boards.length; i++) {
		sub_boards[i].classList.remove("playable");
		sub_boards[i].classList.add("unplayable");
	}
	let sub_board_target = sub_board_selector.parentNode;
	sub_board_target.classList.remove("unplayable");
	sub_board_target.classList.add("playable");
	let sub_board_selectors = board.querySelectorAll(".sub-board-selector");
	for (let i = 0; i < sub_board_selectors.length; i++) {
		sub_board_selectors[i].classList.remove("selectable");
	}
	let current_turn = gameTurn == "X" ? "O" : "X"
	game.setAttribute("turn", current_turn);
	document.getElementById("game-turn").innerHTML = current_turn + "'s turn!";
}

function get_board_winner(board) {
	// This function returns "X", "O" or false if there is a winner in the board by checking if the elements with class "cell" contain either "X" or "O" three in a row vertically, horizontally or diagonally.
	
	let cells = board.querySelectorAll(".cell");
	let cell_classes = [];
	for (let i = 0; i < cells.length; i++) {
		cell_classes.push(cells[i].classList);
	}
	
	// Check if there is a winner vertically
	for (let i = 0; i < 3; i++) {
		if (cell_classes[i].contains("X") && cell_classes[i+3].contains("X") && cell_classes[i+6].contains("X")) {
			return ["X", "vertical-" + i];
		}
		if (cell_classes[i].contains("O") && cell_classes[i+3].contains("O") && cell_classes[i+6].contains("O")) {
			return ["O", "vertical-" + i];
		}
	}
	
	// Check if there is a winner horizontally
	for (let i = 0; i < 9; i += 3) {
		if (cell_classes[i].contains("X") && cell_classes[i+1].contains("X") && cell_classes[i+2].contains("X")) {
			return ["X", "horizontal-" + i];
		}
		if (cell_classes[i].contains("O") && cell_classes[i+1].contains("O") && cell_classes[i+2].contains("O")) {
			return ["O", "horizontal-" + i];
		}
	}
	
	// Check if there is a winner diagonally
	if (cell_classes[0].contains("X") && cell_classes[4].contains("X") && cell_classes[8].contains("X")) {
		return ["X", "diagonal"];
	}
	if (cell_classes[0].contains("O") && cell_classes[4].contains("O") && cell_classes[8].contains("O")) {
		return ["O", "diagonal"];
	}
	if (cell_classes[2].contains("X") && cell_classes[4].contains("X") && cell_classes[6].contains("X")) {
		return ["X", "reversed-diagonal"];
	}
	if (cell_classes[2].contains("O") && cell_classes[4].contains("O") && cell_classes[6].contains("O")) {
		return ["O", "reversed-diagonal"];
	}
	
	return [false, null];
}

