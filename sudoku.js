// Fichier js du sudoku

const puzzle = [  // tableau qui sert à générer la grille js ( elle contient la grille de la partie)
    [0,0,0, 0,6,5, 9,2,8],
    [1,0,5, 0,2,0, 7,6,0],
    [0,0,2, 8,0,0, 0,0,0],

    [5,3,0, 4,8,9, 0,0,0],
    [6,4,0, 7,0,0, 8,3,0],
    [0,0,7, 0,1,0, 0,4,9],

    [4,9,0, 0,0,8, 1,5,7],
    [0,1,8, 0,0,0, 3,0,0],
    [0,0,0, 0,9,1, 2,0,0]
];

var game = [  // tableau de la partie qui sera commpléter  par le joueur pendant la partie 
    [0,0,0, 0,6,5, 9,2,8],
    [1,0,5, 0,2,0, 7,6,0],
    [0,0,2, 8,0,0, 0,0,0],

    [5,3,0, 4,8,9, 0,0,0],
    [6,4,0, 7,0,0, 8,3,0],
    [0,0,7, 0,1,0, 0,4,9],

    [4,9,0, 0,0,8, 1,5,7],
    [0,1,8, 0,0,0, 3,0,0],
    [0,0,0, 0,9,1, 2,0,0]
];

var correction = [ // tableau de la partie compléter pour les fonction de victoire et de vérification
    [3,7,4, 1,6,5, 9,2,8],
    [1,8,5, 9,2,4, 7,6,3],
    [9,6,2, 8,7,3, 4,1,5],

    [5,3,1, 4,8,9, 6,7,2],
    [6,4,9, 7,5,2, 8,3,1],
    [8,2,7, 3,1,6, 5,4,9],

    [4,9,6, 2,3,8, 1,5,7],
    [2,1,8, 5,4,7, 3,9,6],
    [7,5,3, 6,9,1, 2,8,4]
];

window.onload = () => { // action réaliser à l'ouverture de la page 
    buildGrid();  // lancement de la fonction 

    const button = document.getElementById('delete');
    button.addEventListener("click", sup);

    const button2 = document.getElementById('delete_all');
    button2.addEventListener("click", sup_all);

    const button3 = document.getElementById('hint');
    button3.addEventListener("click", indice);

    const button4 = document.getElementById('resolve');
    button4.addEventListener("click", solution);

    const button5 = document.getElementById('restart');
    button5.addEventListener("click", recommencer);
};
let selectedCell = null; 


function buildGrid() {
    const Grille = document.getElementById('grid');
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {

            const cell = document.createElement('div');

            cell.classList.add('cell');
            if (col == 2|| col == 5 ) {
                cell.classList.add('cell-right');
            }
            if (row == 2 || row == 5) {
                cell.classList.add('cell-bottom');
            }

            cell.dataset.row = row;
            cell.dataset.col = col;

            if (puzzle[row][col] !== 0) {
                const span = document.createElement('span');
                span.textContent = puzzle[row][col];
                cell.appendChild(span);
            }else{
                const input = document.createElement('input');
                input.setAttribute('type','text');
                input.setAttribute('maxlength', '1');
                input.addEventListener("input",updatecell);
                cell.appendChild(input);
            }
            if (puzzle[row][col] == 0) {
                cell.addEventListener("click",()=>{ selectcell(cell)});
            }
            Grille.appendChild(cell);
        }
    }
}

function selectcell(cell) {
    if (selectedCell) {
        selectedCell.classList.remove('cell-select');
        removerowcol();
    }
    if (selectedCell != cell) {
        selectedCell = cell;
        cell.classList.add('cell-select');
        selectrowcol(cell);
    } else {
        selectedCell = null;
        removerowcol();   
    }
}

function selectrowcol(cell) {
    const Grille = document.getElementById('grid');
    if (!cell) return;
    removerowcol();
    const ligne = parseInt(cell.dataset.row);
    const colone = parseInt(cell.dataset.col) ;
    const indexcell = ligne * 9 + colone;
    for (let i = 0; i < 9; i++) {
        const indexligne = ligne * 9 + i;
        if (indexligne != indexcell)
        {
            const cell = Grille.children[indexligne];
            cell.classList.add('cell-select-row-col');  
        }
    }
    for (let i = 0; i < 9; i++) {
        const indexcol = i * 9 + colone;
        if (indexcol != indexcell)
        {
            const cell = Grille.children[indexcol];
            cell.classList.add('cell-select-row-col');
        }
    }

}

function removerowcol() {
    const Grille = document.getElementById('grid');
    for (let i = 0; i < 81; i++) {
        Grille.children[i].classList.remove('cell-select-row-col');
    }
}

function removecell() {
    const Grille = document.getElementById('grid');
    for (let i = 0; i < 81; i++) {
        Grille.children[i].classList.remove('cell-select');
    }
}

function updatecell(e) {
    const val = parseInt(e.target.value);
    const ligne = parseInt(e.target.parentElement.dataset.row);
    const colone = parseInt(e.target.parentElement.dataset.col) ;
    game[ligne][colone]= val;
    verification();
}

function verification() {
    var erreur = 0;
    var blanc = 0;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (game[row][col] == 0) {
                blanc = blanc + 1;
            }
            if (game[row][col] != correction[row][col] &&  game[row][col] != 0 ) {
                erreur = erreur + 1;
                incorrect(row,col);
            }
            if (game[row][col] == correction[row][col]) {
                correct(row,col); 
            }
        }
    }
    document.getElementById("fautes").innerHTML = erreur;
    if (erreur == 0 && blanc == 0 ){
        win()
    }
}

function incorrect(row,col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const input = cell.querySelector("input");
    input.classList.add('cell-incorrect')

}

function correct(row,col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const input = cell.querySelector("input");
    if(input){
        input.remove();
        const span = document.createElement('span');
        span.textContent = correction[row][col];
        cell.appendChild(span);
        cell.classList.remove('cell-select');
        if (cell.classList.contains('cell-incorrect')){
           cell.classList.remove('cell-incorrect'); 
        }
        cell.classList.add('cell-correct');
    }
}

function win() {
    const end = document.getElementById("victory");
    end.classList.add("active"); 
    showConfetti();
}

function sup(){
    const Grille = document.getElementById('grid');
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const index = row * 9 + col;
            const cell = Grille.children[index];
            if (cell.classList.contains('cell-select')){
                const input = cell.querySelector("input");
                if(input){
                    input.value = "";
                    game[row][col] = 0;
                    verification()
                    input.classList.remove('cell-incorrect')
                    cell.classList.remove('cell-select');
                    removerowcol();
                }
            }
        }
    }
}

function sup_all(){
    const Grille = document.getElementById('grid');
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const index = row * 9 + col;
            const cell = Grille.children[index];     
            const input = cell.querySelector("input");
            if(input){
                input.value = "";
                game[row][col] = 0;
                verification()
                input.classList.remove('cell-incorrect')
            }
            
        }
    }
    removerowcol();
    removecell();
}

function solution(){
    const Grille = document.getElementById('grid');
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const index = row * 9 + col;
            const cell = Grille.children[index];
            const input = cell.querySelector("input");
            if (cell.contains(input)){
                input.remove();
                const span = document.createElement('span');
                span.textContent = correction[row][col];
                game[row][col] = correction[row][col];
                cell.appendChild(span);
                cell.classList.remove('cell-select');
                cell.classList.remove('cell-incorrect'); 
                cell.classList.add('cell-correct');
                verification()
                removerowcol();
            }
        }
    }
}

function indice(){
    const Grille = document.getElementById('grid');
    let not_span = false;
    let cell;
    let input;
    while (not_span == false){
        var row = Math.floor(Math.random() * 9);
        var col = Math.floor(Math.random() * 9);
        const index = row * 9 + col;
        cell = Grille.children[index];
        input = cell.querySelector("input");
        if(input){
            not_span = true;
        }
    }
    input.remove();
    const span = document.createElement('span');
    span.textContent = correction[row][col];
    cell.appendChild(span);
    setTimeout(() => {

    span.remove();
    cell.appendChild(input);
    input.value = "";

    }, 1000);
}

function recommencer(){
    const end = document.getElementById("victory");
    end.classList.remove("active");
    const Grille = document.getElementById('grid');
    while (Grille.firstChild) {
        Grille.removeChild(Grille.firstChild);
    }
    buildGrid();
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            game[row][col] = puzzle[row][col];    
        }
    }
    verification();
}

function showConfetti() {
    const confettiBox = document.getElementById("confetti");
    const colors = ["#ff4757", "#ffa502", "#2ed573", "#1e90ff", "#a55eea"];

    confettiBox.innerHTML = "";
    confettiBox.classList.add("active");

    for (let i = 0; i < 80; i++) {
        const piece = document.createElement("span");
        piece.classList.add("confetti-piece");
        piece.style.left = Math.random() * 100 + "%";
        piece.style.backgroundColor = colors[i % colors.length];
        piece.style.animationDelay = Math.random() * 0.8 + "s";
        piece.style.animationDuration = 2 + Math.random() * 1.5 + "s";
        confettiBox.appendChild(piece);
    }

    setTimeout(() => {
        confettiBox.classList.remove("active");
        confettiBox.innerHTML = "";
    }, 4000);
}