function insert() {
    const back = document.getElementById('back');
    back.innerHTML = ''; // Limpiar cualquier contenido anterior

    const inputs = document.querySelectorAll('.box1 textarea');
    const rows = parseInt(inputs[0].value);
    const cols = parseInt(inputs[1].value);

    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
        alert('Por favor, ingrese números válidos para filas y columnas.');
        return;
    }

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.padding = '2rem';
    container.style.backgroundColor = 'white';
    container.style.margin = '5rem auto';
    container.style.width = 'fit-content';

    const table = document.createElement('div');
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('textarea');
            cell.rows = 1;
            cell.cols = 3;
            cell.style.margin = '0.3rem';
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    const closeBtn=document.createElement('button');
    closeBtn.innerText='Cerrar';
    closeBtn.className='button';
    closeBtn.onclick = () => { back.style.display='none'; };

    container.appendChild(table);
    container.appendChild(closeBtn);
    back.appendChild(container);
    back.style.display='flex';
    back.style.justifyContent='center';
    back.style.alignItems='center';
}



